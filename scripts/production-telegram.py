"""Event-only production observer. Only trusted main code consumes credentials."""
import base64
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

spec = importlib.util.spec_from_file_location("observer", Path(__file__).with_name("production-notifier.py"))
observer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(observer)
BRANCH = "codex/production-notification-state"
FILE = "production-notifications-state.json"


class Fault(RuntimeError):
    pass


def gh(path, method="GET", body=None):
    args = ["gh", "api", "repos/" + observer.REPO + path, "--method", method]
    if body is not None:
        args += ["--input", "-"]
    try:
        result = subprocess.run(args, input=json.dumps(body) if body is not None else None,
                                capture_output=True, text=True, timeout=90)
        if result.returncode:
            raise Fault("GitHub request failed; credentials and raw diagnostics suppressed")
        return json.loads(result.stdout)
    except (OSError, ValueError, subprocess.TimeoutExpired):
        raise Fault("GitHub request unavailable; production failure is not established") from None


GUARD_FILES = ("vercel.json", "apps/demo/vercel.json")


class Store:
    def read_json(self, path):
        entry = self.entries.get(path, {})
        if entry.get("type") != "blob" or entry.get("mode") not in ("100644", "100755"):
            raise Fault("State branch requires regular state and deployment guard files")
        try:
            data = gh("/git/blobs/" + entry["sha"])
            if data.get("encoding") != "base64":
                raise ValueError("Unsupported blob encoding")
            return json.loads(base64.b64decode("".join(data["content"].split()), validate=True))
        except (KeyError, TypeError, ValueError):
            raise Fault("State branch JSON invalid; history and deployment guards must be preserved") from None

    def verify_guards(self):
        for path in GUARD_FILES:
            config = self.read_json(path)
            if (not isinstance(config, dict) or not isinstance(config.get("git"), dict)
                    or config["git"].get("deploymentEnabled") is not False):
                raise Fault("State branch Vercel deployment guard missing or enabled; refusing update")

    def load(self):
        # Pin the complete parent tree: checking only the state blob cannot
        # detect a concurrent commit that removes a deployment guard.
        self.head = gh("/git/ref/heads/" + BRANCH)["object"]["sha"]
        self.tree = gh("/git/commits/" + self.head)["tree"]["sha"]
        tree = gh("/git/trees/" + self.tree + "?recursive=1")
        if tree.get("truncated"):
            raise Fault("State branch tree incomplete; refusing update")
        if tree["sha"] != self.tree:
            raise Fault("State branch tree identity changed; refusing update")
        self.entries = {entry["path"]: entry for entry in tree["tree"]}
        self.verify_guards()
        state = self.read_json(FILE)
        if (not isinstance(state, dict) or state.get("repository") != observer.REPO
                or state.get("startedAt") != observer.STARTED_AT
                or not isinstance(state.get("processedAttempts"), dict)
                or not isinstance(state.get("notifiedFailures"), dict)
                or not isinstance(state.get("telegramDeliveries", {}), dict)):
            raise Fault("Durable state invalid; do not reset notification fingerprints")
        return state

    def save(self, state):
        self.verify_guards()
        # Change exactly the state file in the verified tree. Both immutable
        # guard blobs and every other entry are retained, never reconstructed.
        tree = gh("/git/trees", "POST", {"base_tree": self.tree, "tree": [{
            "path": FILE, "mode": "100644", "type": "blob",
            "content": json.dumps(state, indent=2) + "\n",
        }]})
        commit = gh("/git/commits", "POST", {
            "message": "chore(ops): save production notification state",
            "tree": tree["sha"], "parents": [self.head],
        })
        # Non-fast-forward updates reject any competing branch commit, including
        # a guard-only change with an unchanged JSON blob. Never force the ref.
        gh("/git/refs/heads/" + BRANCH, "PATCH", {"sha": commit["sha"], "force": False})
        self.head, self.tree = commit["sha"], tree["sha"]


def telegram(text):
    token, chat = os.environ["TELEGRAM_BOT_TOKEN"], os.environ["TELEGRAM_CHAT_ID"]
    if not chat.isdecimal() or not token:
        raise Fault("Telegram private recipient configuration invalid")
    request = urllib.request.Request("https://api.telegram.org/bot" + token + "/sendMessage",
        data=urllib.parse.urlencode({"chat_id": chat, "text": text,
            "link_preview_options": json.dumps({"is_disabled": True})}).encode())
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.load(response)
        result = data.get("result", {})
        if not data.get("ok") or str(result.get("chat", {}).get("id")) != chat:
            raise Fault("Telegram delivery unconfirmed; manual reconciliation required")
        return result["message_id"]
    except (OSError, ValueError, KeyError):
        # A timeout can happen after Telegram accepted the message. Never resend
        # an ambiguous reservation automatically: that could produce duplicates.
        raise Fault("Telegram delivery unconfirmed; manual reconciliation required") from None


def notice_text(notice):
    categories = {"interrupted": "Проверка прервана", "timeout": "Лимит времени",
                  "scenario-results": "Сценарии сайта или демо"}
    stage = categories.get(notice["category"], "Подготовка или готовность production")
    return ("SnowUI: сбой проверки после релиза\nCommit: " + notice["sha"][:12]
            + "\nЭтап: " + stage + " (" + observer.safe_text(notice["category"]) + ")"
            + "\nПричина: " + observer.safe_text(notice["reason"])
            + "\nДействие: проверить указанный этап и очищенные отчёты запуска; "
              "уточнить причину, если отчёта нет.\n" + notice["url"])


def stable_run(run, jobs):
    # These are authoritative REST fields, not untrusted event/artifact strings.
    return (run.get("path") == ".github/workflows/release.yml"
            and run.get("head_repository", {}).get("full_name") == observer.REPO
            and run.get("head_branch") == "main" and run.get("event") == "workflow_dispatch"
            and run.get("display_title") == "Release (release) on main"
            and run.get("status") == "completed"
            and all(any(j["name"] == name and j.get("conclusion") == "success" for j in jobs)
                    for name in ("released", "promote")))


def collect(run_id, state, production_finished=False, pinned_attempt=None):
    path = "/actions/runs/" + str(run_id)
    if pinned_attempt is not None:
        if type(pinned_attempt) is not int or pinned_attempt <= 0:
            raise Fault("Invalid pinned Release attempt")
        path += "/attempts/" + str(pinned_attempt)
    run = gh(path)
    if pinned_attempt is not None and run.get("run_attempt") != pinned_attempt:
        raise Fault("Pinned Release attempt differs from GitHub response")
    if run.get("status") != "completed" and not production_finished:
        return []
    attempt = run["run_attempt"]
    if str(run_id) + ":" + str(attempt) in state["processedAttempts"]:
        return []
    jobs = [job for page in observer.api("/actions/runs/" + str(run_id)
            + "/attempts/" + str(attempt) + "/jobs?per_page=100") for job in page["jobs"]]
    if run.get("status") != "completed":
        production = [j for j in jobs if j["name"] == "production" or j["name"].startswith("production /")]
        if not production or any(j.get("status") != "completed" for j in production):
            return []
        # A reusable call is still part of its parent Release, which cannot be
        # completed until this observer returns. Production itself is final.
        run = {**run, "status": "completed"}
    if not stable_run(run, jobs):
        return []
    return observer.events_from_github(state, [run])[0]


def process(store, events, send=telegram):
    state = store.load()
    unresolved = [key for key, value in state.get("telegramDeliveries", {}).items()
                  if value.get("status") == "reserved"]
    if unresolved:
        raise Fault("Unconfirmed Telegram delivery exists; reconcile before retrying")
    next_state, notices = observer.evaluate(state, events)
    next_state["observerError"] = None
    next_state.pop("observerDiagnostic", None)
    deliveries = next_state.setdefault("telegramDeliveries", {})
    for notice in notices:
        # Reuse the original fingerprint exactly. Old sent fingerprints survive
        # import; no reclassification or reset on transport migration.
        key = hashlib.sha256((notice["sha"] + "|" + notice["category"] + "|" + notice["reason"]).encode()).hexdigest()
        deliveries[key] = {"status": "reserved", "runId": notice["runId"], "attempt": notice["attempt"]}
    if next_state != state:
        store.save(next_state)
    for notice in notices:
        key = hashlib.sha256((notice["sha"] + "|" + notice["category"] + "|" + notice["reason"]).encode()).hexdigest()
        message_id = send(notice_text(notice))
        deliveries[key].update(status="sent", messageId=message_id)
        store.save(next_state)
    return len(notices)



def arm_acceptance(store, state, release_id, events):
    """Pin the first real direct Release call, before notification state changes."""
    marker = state.get("telegramReleaseAcceptance")
    if not release_id or (marker and (marker.get("status") == "completed"
            or str(marker["runId"]) != release_id)):
        return
    selected = [e for e in events if str(e["runId"]) == release_id]
    if not selected:
        return
    event = selected[0]
    if marker and marker["attempt"] >= event["attempt"]:
        return
    state["telegramReleaseAcceptance"] = {
        "status": "pending", "runId": event["runId"], "attempt": event["attempt"],
        "sha": event["sha"],
        "baseline": {name: copy.deepcopy(state.get(name, {})) for name in
                     ("processedAttempts", "notifiedFailures", "telegramDeliveries")},
    }
    store.save(state)


def main():
    event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    kind = os.environ["GITHUB_EVENT_NAME"]
    if os.environ.get("GITHUB_REPOSITORY") != observer.REPO or os.environ.get("GITHUB_REF") != "refs/heads/main":
        raise Fault("Notifier requires the trusted main repository")
    operation = event.get("inputs", {}).get("operation") if kind == "workflow_dispatch" else None
    if operation in ("delivery-test", "cancellation-test"):
        # Explicit operator test, separate from production fingerprints and errors.
        telegram("SnowUI: тест доставки из GitHub Actions. Это проверка связи, не сообщение о сбое production.")
        print("Delivery test accepted by Telegram")
        return
    if os.environ.get("NOTIFICATIONS_ENABLED") != "true":
        print("Notifications inactive; no event processed")
        return
    release_id = os.environ.get("RELEASE_RUN_ID", "")
    if release_id and (not release_id.isdecimal() or release_id != os.environ.get("GITHUB_RUN_ID")
                       or event.get("inputs", {}).get("mode") != "release"):
        raise Fault("Invalid reusable Release identity")
    store = Store()
    state = store.load()
    if os.environ.get("GITHUB_OUTPUT"):
        done = state.get("telegramReleaseAcceptance", {}).get("status") == "completed"
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            output.write("acceptance-required=" + ("false" if done else "true") + "\n")
    try:
        if kind == "workflow_run":
            run_id = event["workflow_run"]["id"]
            if type(run_id) is not int or run_id <= 0:
                raise Fault("Invalid Release identity")
        elif operation != "reconcile" and not release_id:
            raise Fault("Unsupported notifier event")
        # GitHub concurrency can replace an older queued run. On each event,
        # reconcile every unfinished/new attempt since cutover; this is event
        # driven, never scheduled polling. Completed attempts are not inspected.
        cutoff = state["telegramStartedAt"]
        runs = [r for page in observer.api("/actions/workflows/release.yml/runs?branch=main&per_page=100") for r in page["workflow_runs"]]
        events = []
        completed = dict(state.get("telegramCompletedRuns", {}))
        for run in runs:
            key = str(run["id"]) + ":" + str(run["run_attempt"])
            if (run.get("updated_at", "") < cutoff and run["id"] not in state.get("telegramPendingRuns", [])) or key in completed:
                continue
            events.extend(collect(run["id"], state, production_finished=str(run["id"]) == release_id))
            if run["status"] == "completed":
                completed[key] = True
    except (RuntimeError, OSError, ValueError, KeyError, TypeError):
        # An observation problem is not an application failure. Reserve before
        # delivery and persist the observer error independently of production.
        if state.get("telegramObserverError") == "observation-unavailable":
            raise Fault("Observation still unavailable; duplicate notice suppressed") from None
        state["telegramObserverError"] = "observation-unavailable"
        store.save(state)
        telegram("SnowUI: ошибка наблюдения GitHub. Production-сбой не установлен. Проверьте доступ и отчёт workflow Production Notifications.")
        raise Fault("GitHub observation failed; observer notice sent") from None
    arm_acceptance(store, state, release_id, events)
    count = process(store, events)
    state = store.load()
    state.pop("telegramObserverError", None)
    state["telegramCompletedRuns"] = completed
    store.save(state)
    print(json.dumps({"noticesSent": count, "quiet": count == 0}))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        # Never print exception repr/traceback: request URLs contain the bot token.
        print("::error::Production notification observer or delivery failed. No application failure inferred; inspect durable reservations and access. Sensitive diagnostics suppressed.")
        sys.exit(1)
