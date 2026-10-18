"""One-shot acceptance of the actual Release hook; no Telegram credentials or polling."""
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys

spec = importlib.util.spec_from_file_location("delivery", Path(__file__).with_name("production-telegram.py"))
delivery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(delivery)


def fingerprint(notice):
    return hashlib.sha256((notice["sha"] + "|" + notice["category"] + "|" + notice["reason"]).encode()).hexdigest()


def verify(store):
    state = store.load()
    marker = state.get("telegramReleaseAcceptance")
    if marker and marker.get("status") == "completed":
        return  # Permanent event monitor continues; this acceptance is retired.
    if not marker or marker.get("status") != "pending":
        raise delivery.Fault("Release acceptance was not armed by the direct observer")
    run_id, attempt, sha = marker["runId"], marker["attempt"], marker["sha"]
    run = delivery.gh("/actions/runs/" + str(run_id))
    jobs = [j for page in delivery.observer.api("/actions/runs/" + str(run_id)
            + "/attempts/" + str(attempt) + "/jobs?per_page=100") for j in page["jobs"]]
    production = [j for j in jobs if j["name"] == "production" or j["name"].startswith("production /")]
    notifier = [j for j in jobs if j["name"] == "notify-production / notify"]
    if (run["run_attempt"] != attempt or run["head_sha"] != sha
            or not delivery.stable_run({**run, "status": "completed"}, jobs)
            or not production or any(j.get("status") != "completed" or j.get("conclusion") == "skipped" for j in production)
            or len(notifier) != 1 or notifier[0].get("conclusion") != "success"):
        raise delivery.Fault("Automatic stable Release notification hook is not verified")
    if state.get("telegramObserverError") or any(v.get("status") == "reserved"
            for v in state.get("telegramDeliveries", {}).values()):
        raise delivery.Fault("Observer error or ambiguous delivery prevents acceptance")
    baseline = marker["baseline"]
    for name in ("processedAttempts", "notifiedFailures", "telegramDeliveries"):
        if any(state.get(name, {}).get(k) != v for k, v in baseline[name].items()):
            raise delivery.Fault("Previous production notification history changed")
    before = {"repository": state["repository"], "startedAt": state["startedAt"], **copy.deepcopy(baseline)}
    events = delivery.collect(run_id, before, production_finished=True)
    if not events or any(e["sha"] != sha or e["attempt"] != attempt for e in events):
        raise delivery.Fault("Selected production attempt could not be reconstructed")
    expected, notices = delivery.observer.evaluate(before, events)
    for name in ("processedAttempts", "notifiedFailures"):
        if any(state[name].get(k) != v for k, v in expected[name].items()):
            raise delivery.Fault("Durable evaluation differs from the production attempt")
    expected_keys = {fingerprint(n) for n in notices}
    receipts = state.get("telegramDeliveries", {})
    actual_keys = {k for k, v in receipts.items() if v.get("runId") == run_id and v.get("attempt") == attempt}
    old_keys = {k for k, v in baseline["telegramDeliveries"].items()
                if v.get("runId") == run_id and v.get("attempt") == attempt}
    if actual_keys - old_keys != expected_keys:
        raise delivery.Fault("Unexpected or missing production delivery receipts")
    if any(receipts[k].get("status") != "sent" or type(receipts[k].get("messageId")) is not int
            or receipts[k]["messageId"] <= 0 for k in expected_keys):
        raise delivery.Fault("Telegram acceptance receipt is missing")
    # Replays use the real sanitized production result, purely in memory. A
    # hypothetical next attempt proves cause deduplication without rerunning CI.
    replay, duplicate = delivery.observer.evaluate(state, events)
    retry = [{**e, "attempt": attempt + 1} for e in events]
    _, duplicate_retry = delivery.observer.evaluate(state, retry)
    if duplicate or duplicate_retry or replay != state:
        raise delivery.Fault("Production result is not idempotent")
    result = {"status": "completed", "runId": run_id, "attempt": attempt, "sha": sha,
              "noticesVerified": len(expected_keys), "duplicateReplayNotices": 0,
              "sameCauseRetryNotices": 0, "baseline": copy.deepcopy(baseline)}
    state["telegramReleaseAcceptance"] = result
    store.save(state)  # Same state branch CAS; no fingerprints or receipts altered.


def main():
    event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    if (os.environ.get("GITHUB_REPOSITORY") != delivery.observer.REPO
            or os.environ.get("GITHUB_REF") != "refs/heads/main"
            or os.environ.get("GITHUB_EVENT_NAME") != "workflow_dispatch"
            or event.get("inputs", {}).get("mode") != "release"):
        raise delivery.Fault("Acceptance requires an automatic stable Release caller")
    verify(delivery.Store())


if __name__ == "__main__":
    try:
        main()
    except Exception:
        print("::error::Production notification acceptance failed; inspect the selected Release and durable state. Sensitive diagnostics suppressed.")
        sys.exit(1)
