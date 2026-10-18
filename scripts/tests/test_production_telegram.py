"""No network or real state: event filtering and crash/dedup delivery contracts."""
import base64
import copy
import json
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("telegram", Path(__file__).parents[1] / "production-telegram.py")
t = importlib.util.module_from_spec(spec)
spec.loader.exec_module(t)


class MemoryStore:
    def __init__(self, state):
        self.state = copy.deepcopy(state)
        self.writes = []

    def load(self):
        return copy.deepcopy(self.state)

    def save(self, state):
        self.state = copy.deepcopy(state)
        self.writes.append(copy.deepcopy(state))


def baseline():
    return {"repository": t.observer.REPO, "startedAt": t.observer.STARTED_AT,
            "processedAttempts": {}, "notifiedFailures": {"old-fingerprint": {"sha": "old"}}}


def event(conclusion="failure", attempt=1, sha="a" * 40):
    return dict(runId=123, attempt=attempt, sha=sha, url="https://github.com/holakirr/snow-ui/actions/runs/123",
                status="completed", conclusion=conclusion, startedAt="2026-10-18T10:00:00Z", reports={},
                steps=[{"name": "Check production", "conclusion": conclusion, "started_at": "2026-10-18T10:00:00Z"}])


class GitState:
    """Git objects are immutable; only the ref exposes a committed update."""
    def __init__(self):
        self.blobs, self.trees, self.commits, self.calls = {}, {}, {}, []
        self.head = "initial"
        self.counter = 0
        self.race_on_write = False
        entries = {}
        for path, value in [(t.FILE, baseline()), *[(p, {"git": {"deploymentEnabled": False}}) for p in t.GUARD_FILES]]:
            sha = self.blob(json.dumps(value))
            entries[path] = {"path": path, "mode": "100644", "type": "blob", "sha": sha}
        self.trees["initial-tree"] = entries
        self.commits[self.head] = {"tree": "initial-tree", "parents": []}

    def blob(self, text):
        self.counter += 1
        sha = "blob-" + str(self.counter)
        self.blobs[sha] = {"encoding": "base64", "content": base64.b64encode(text.encode()).decode()}
        return sha

    def entries(self):
        return self.trees[self.commits[self.head]["tree"]]

    def external_remove(self, path):
        entries = copy.deepcopy(self.entries())
        entries.pop(path)
        self.trees["external-tree"] = entries
        self.commits["external"] = {"tree": "external-tree", "parents": [self.head]}
        self.head = "external"

    def gh(self, path, method="GET", body=None):
        self.calls.append((path, method, copy.deepcopy(body)))
        if path == "/git/ref/heads/" + t.BRANCH:
            return {"object": {"sha": self.head}}
        if path.startswith("/git/commits/"):
            commit = path.split("/")[-1]
            return {"tree": {"sha": self.commits[commit]["tree"]}}
        if path.startswith("/git/trees/"):
            tree = path.split("/")[-1].split("?")[0]
            return {"sha": tree, "truncated": False, "tree": copy.deepcopy(list(self.trees[tree].values()))}
        if path.startswith("/git/blobs/"):
            return copy.deepcopy(self.blobs[path.split("/")[-1]])
        if path == "/git/trees" and method == "POST":
            entries = copy.deepcopy(self.trees[body["base_tree"]])
            for item in body["tree"]:
                self.counter += 1
                entries[item["path"]] = {"path": item["path"], "mode": item["mode"],
                    "type": item["type"], "sha": self.blob(item["content"])}
            tree = "tree-" + str(self.counter)
            self.trees[tree] = entries
            if self.race_on_write:
                self.race_on_write = False
                self.external_remove(t.GUARD_FILES[1])
            return {"sha": tree}
        if path == "/git/commits" and method == "POST":
            commit = "commit-" + str(len(self.commits))
            self.commits[commit] = copy.deepcopy(body)
            return {"sha": commit}
        if path == "/git/refs/heads/" + t.BRANCH and method == "PATCH":
            if body.get("force") is not False or self.commits[body["sha"]]["parents"] != [self.head]:
                raise t.Fault("non-fast-forward rejected")
            self.head = body["sha"]
            return {"object": {"sha": self.head}}
        raise AssertionError((path, method))


class StateGuardTests(unittest.TestCase):
    def test_two_writes_preserve_both_guard_blobs_and_existing_history(self):
        git, store = GitState(), t.Store()
        guards = {p: copy.deepcopy(git.entries()[p]) for p in t.GUARD_FILES}
        with patch.object(t, "gh", side_effect=git.gh):
            state = store.load()
            state["processedAttempts"]["123:1"] = {"sha": "a" * 40, "conclusion": "success"}
            store.save(state)
            store.save(state)
            self.assertEqual(store.load(), state)
        for path, entry in guards.items(): self.assertEqual(git.entries()[path], entry)
        writes = [b for p, m, b in git.calls if p == "/git/trees" and m == "POST"]
        self.assertTrue(all([i["path"] for i in b["tree"]] == [t.FILE] for b in writes))
        self.assertEqual(state["notifiedFailures"]["old-fingerprint"], {"sha": "old"})

    def test_missing_either_guard_refuses_all_mutations(self):
        for path in t.GUARD_FILES:
            with self.subTest(path=path):
                git = GitState()
                git.entries().pop(path)
                with patch.object(t, "gh", side_effect=git.gh), self.assertRaises(t.Fault):
                    t.Store().load()
                self.assertTrue(all(method == "GET" for _, method, _ in git.calls))

    def test_guard_requires_exact_boolean_false_in_regular_json_for_each_project(self):
        invalid = ["broken-json", "[]", "null", '{}', '{"git":null}',
                   *[json.dumps({"git": {"deploymentEnabled": v}}) for v in (True, 0, "false", None, {"main": False})]]
        for path in t.GUARD_FILES:
            for value in invalid:
                with self.subTest(path=path, value=value):
                    git = GitState()
                    git.entries()[path]["sha"] = git.blob(value)
                    with patch.object(t, "gh", side_effect=git.gh), self.assertRaises(t.Fault):
                        t.Store().load()
                    self.assertTrue(all(method == "GET" for _, method, _ in git.calls))
            git = GitState()
            git.entries()[path]["mode"] = "120000"
            with patch.object(t, "gh", side_effect=git.gh), self.assertRaises(t.Fault):
                t.Store().load()

    def test_save_rechecks_guards_before_creating_git_objects(self):
        git, store = GitState(), t.Store()
        with patch.object(t, "gh", side_effect=git.gh):
            state = store.load()
            store.entries.pop(t.GUARD_FILES[0])
            with self.assertRaises(t.Fault): store.save(state)
        self.assertTrue(all(method == "GET" for _, method, _ in git.calls))

    def test_guard_only_concurrent_change_cannot_be_overwritten(self):
        git, store = GitState(), t.Store()
        original_state_blob = git.entries()[t.FILE]["sha"]
        with patch.object(t, "gh", side_effect=git.gh):
            state = store.load()
            git.external_remove(t.GUARD_FILES[1])
            with self.assertRaises(t.Fault): store.save(state)
        self.assertEqual(git.head, "external")
        self.assertEqual(git.entries()[t.FILE]["sha"], original_state_blob)
        self.assertNotIn(t.GUARD_FILES[1], git.entries())
        self.assertTrue(all(body["force"] is False for _, method, body in git.calls if method == "PATCH"))

    def test_race_during_reservation_write_prevents_telegram_send(self):
        git, store = GitState(), t.Store()
        git.race_on_write = True
        with patch.object(t, "gh", side_effect=git.gh), self.assertRaises(t.Fault):
            t.process(store, [event()], lambda text: self.fail("must not send before committed reservation"))
        self.assertEqual(git.head, "external")

    def test_truncated_tree_is_not_a_valid_snapshot(self):
        git = GitState()
        def gh(path, method="GET", body=None):
            value = git.gh(path, method, body)
            if path.startswith("/git/trees/"): value["truncated"] = True
            return value
        with patch.object(t, "gh", side_effect=gh), self.assertRaises(t.Fault):
            t.Store().load()
        self.assertTrue(all(method == "GET" for _, method, _ in git.calls))


class DeliveryTests(unittest.TestCase):
    def test_failure_delivers_once_and_preserves_old_fingerprints(self):
        store, sent = MemoryStore(baseline()), []
        send = lambda text: sent.append(text) or 7
        self.assertEqual(t.process(store, [event()], send), 1)
        self.assertEqual(t.process(store, [event(), event(attempt=2)], send), 0)
        self.assertEqual(len(sent), 1)
        self.assertEqual(store.state["notifiedFailures"]["old-fingerprint"], {"sha": "old"})
        self.assertEqual(next(iter(store.writes[0]["telegramDeliveries"].values()))["status"], "reserved")
        self.assertTrue(all(v["status"] == "sent" for v in store.state["telegramDeliveries"].values()))
        self.assertEqual(t.process(store, [event(attempt=3, sha="b" * 40)], send), 1)

    def test_success_skip_pending_and_recovery_are_quiet(self):
        store, sent = MemoryStore(baseline()), []
        send = lambda text: sent.append(text) or 7
        for conclusion in ("success", "skipped", None):
            e = event(conclusion)
            e["runId"] = len(store.writes) + 1000
            if conclusion is None:
                e["status"] = "in_progress"
            self.assertEqual(t.process(store, [e], send), 0)
        self.assertEqual(sent, [])

    def test_ambiguous_send_is_reserved_and_never_resent(self):
        store = MemoryStore(baseline())
        def fail(text):
            raise t.Fault("timeout")
        with self.assertRaises(t.Fault):
            t.process(store, [event()], fail)
        with self.assertRaises(t.Fault):
            t.process(store, [event()], lambda text: self.fail("must not resend"))

    def test_persist_failure_prevents_send(self):
        store = MemoryStore(baseline())
        with patch.object(store, "save", side_effect=t.Fault("conflict")):
            with self.assertRaises(t.Fault):
                t.process(store, [event()], lambda text: self.fail("must not send"))

    def test_new_reason_notifies_and_no_started_cancel_is_quiet(self):
        store, sent = MemoryStore(baseline()), []
        send = lambda text: sent.append(text) or 7
        t.process(store, [event()], send)
        changed = event(attempt=2)
        changed["steps"][0]["name"] = "Resolve expected production commits"
        self.assertEqual(t.process(store, [changed], send), 1)
        cancelled = event("cancelled", attempt=3)
        cancelled["steps"] = []
        self.assertEqual(t.process(store, [cancelled], send), 0)

    def test_untrusted_diagnostic_secret_is_redacted(self):
        with patch.dict(t.os.environ, {"TELEGRAM_BOT_TOKEN": "secret-test-value"}):
            n = dict(sha="a" * 40, category="scenario-results", reason="secret-test-value", url="https://example.invalid")
            self.assertNotIn("secret-test-value", t.notice_text(n))


class ScopeTests(unittest.TestCase):
    def test_only_completed_normal_main_release_after_promote(self):
        run = {"path": ".github/workflows/release.yml", "head_repository": {"full_name": t.observer.REPO},
               "head_branch": "main", "event": "workflow_dispatch", "display_title": "Release (release) on main", "status": "completed"}
        jobs = [{"name": n, "conclusion": "success"} for n in ("released", "promote")]
        self.assertTrue(t.stable_run(run, jobs))
        for field, value in (("path", ".github/workflows/production.yml"), ("head_branch", "next"),
                             ("event", "workflow_run"), ("display_title", "Release (production) on main"),
                             ("display_title", "Release (canary) on main"), ("status", "in_progress"),
                             ("head_repository", {"full_name": "attacker/snow-ui"})):
            with self.subTest(field=field, value=value):
                self.assertFalse(t.stable_run({**run, field: value}, jobs))
        self.assertFalse(t.stable_run(run, [{"name": "promote", "conclusion": "skipped"}]))

    def test_reusable_call_reads_final_production_before_parent_completes(self):
        run = {"id": 123, "run_attempt": 1, "path": ".github/workflows/release.yml",
               "head_repository": {"full_name": t.observer.REPO}, "head_branch": "main",
               "event": "workflow_dispatch", "display_title": "Release (release) on main",
               "status": "in_progress", "head_sha": "a" * 40, "html_url": "https://example.invalid",
               "updated_at": "2026-10-18T10:00:00Z"}
        prod = {"name": "production / production", "status": "completed", "conclusion": "failure",
                "started_at": "2026-10-18T10:00:00Z", "steps": []}
        jobs = [{"name": name, "conclusion": "success"} for name in ("released", "promote")] + [prod]
        def api(path):
            return [{"artifacts": []}] if "/artifacts?" in path else [{"jobs": jobs}]
        with patch.object(t, "gh", return_value=run), patch.object(t.observer, "api", side_effect=api):
            self.assertEqual(t.collect(123, baseline()), [])
            self.assertEqual(len(t.collect(123, baseline(), production_finished=True)), 1)
            prod["status"] = "in_progress"
            self.assertEqual(t.collect(123, baseline(), production_finished=True), [])
            prod["status"] = "completed"
            run["display_title"] = "Release (production) on main"
            self.assertEqual(t.collect(123, baseline(), production_finished=True), [])

    def test_pinned_attempt_does_not_follow_latest_run(self):
        run = {"id": 123, "run_attempt": 1, "path": ".github/workflows/release.yml",
               "head_repository": {"full_name": t.observer.REPO}, "head_branch": "main",
               "event": "workflow_dispatch", "display_title": "Release (release) on main",
               "status": "completed", "head_sha": "a" * 40, "html_url": "https://example.invalid",
               "updated_at": "2026-10-18T10:00:00Z"}
        jobs = [{"name": name, "conclusion": "success"} for name in ("released", "promote")]
        jobs += [{"name": "production / production", "status": "completed", "conclusion": "success"}]
        def gh(path):
            self.assertEqual(path, "/actions/runs/123/attempts/1")
            return run
        with patch.object(t, "gh", side_effect=gh), patch.object(t.observer, "api", return_value=[{"jobs": jobs}]):
            result = t.collect(123, baseline(), pinned_attempt=1)
            self.assertEqual(result[0]["attempt"], 1)

    def test_processed_attempt_does_not_read_jobs(self):
        state = baseline()
        state["processedAttempts"]["123:2"] = {}
        with patch.object(t, "gh", return_value={"run_attempt": 2, "status": "completed"}), patch.object(t.observer, "api", side_effect=AssertionError("jobs must not be read")):
            self.assertEqual(t.collect(123, state), [])


accept_spec = importlib.util.spec_from_file_location("acceptance", Path(__file__).parents[1] / "production-release-acceptance.py")
a = importlib.util.module_from_spec(accept_spec)
accept_spec.loader.exec_module(a)
a.delivery = t


class AcceptanceTests(unittest.TestCase):
    def prepared(self, conclusion="success"):
        store = MemoryStore(baseline())
        e = event(conclusion)
        t.arm_acceptance(store, store.load(), "123", [e])
        t.process(store, [e], lambda text: 42)
        self.run = {"id": 123, "run_attempt": 1, "head_sha": e["sha"],
                    "path": ".github/workflows/release.yml", "head_repository": {"full_name": t.observer.REPO},
                    "head_branch": "main", "event": "workflow_dispatch",
                    "display_title": "Release (release) on main", "status": "in_progress"}
        self.jobs = [{"name": name, "conclusion": "success"} for name in ("released", "promote", "notify-production / notify")]
        self.jobs += [{"name": "production / production", "status": "completed", "conclusion": conclusion}]
        return store, e

    def verify(self, store, e):
        with patch.object(t, "gh", return_value=self.run), patch.object(t.observer, "api", return_value=[{"jobs": self.jobs}]), patch.object(t, "collect", return_value=[e]), patch.object(t, "telegram", side_effect=AssertionError("acceptance must never send")):
            a.verify(store)

    def test_green_marks_completed_silently_and_preserves_all_history(self):
        store, e = self.prepared()
        before = store.load()
        self.verify(store, e)
        marker = store.state["telegramReleaseAcceptance"]
        self.assertEqual(marker["status"], "completed")
        self.assertEqual(marker["noticesVerified"], 0)
        for name in ("processedAttempts", "notifiedFailures", "telegramDeliveries"):
            self.assertEqual(store.state[name], before[name])
        with patch.object(t, "gh", side_effect=AssertionError("retired check must not read jobs")):
            a.verify(store)
        self.assertEqual(len(store.writes), 3)

    def test_failure_verifies_receipt_and_same_cause_retry_without_sending(self):
        store, e = self.prepared("failure")
        self.verify(store, e)
        self.assertEqual(store.state["telegramReleaseAcceptance"]["noticesVerified"], 1)
        self.assertEqual(store.state["telegramReleaseAcceptance"]["sameCauseRetryNotices"], 0)

    def test_acceptance_only_rerun_reads_pinned_attempt(self):
        store, e = self.prepared()
        def gh(path):
            self.assertEqual(path, "/actions/runs/123/attempts/1")
            return self.run
        with patch.object(t, "gh", side_effect=gh), patch.object(t.observer, "api", return_value=[{"jobs": self.jobs}]), patch.object(t, "collect", return_value=[e]) as collect:
            a.verify(store)
            self.assertEqual(collect.call_args.kwargs["pinned_attempt"], 1)
        self.assertEqual(store.state["telegramReleaseAcceptance"]["status"], "completed")

    def test_missing_or_pending_notifier_cannot_pass(self):
        for conclusion in ("failure", "cancelled", "skipped", None):
            with self.subTest(conclusion=conclusion):
                store, e = self.prepared()
                self.jobs[2]["conclusion"] = conclusion
                with self.assertRaises(t.Fault):
                    self.verify(store, e)
                self.assertEqual(store.state["telegramReleaseAcceptance"]["status"], "pending")

    def test_green_with_unexpected_receipt_fails(self):
        store, e = self.prepared()
        store.state["telegramDeliveries"]["unexpected"] = {"runId": 123, "attempt": 1, "status": "sent", "messageId": 9}
        with self.assertRaises(t.Fault):
            self.verify(store, e)

    def test_missing_ambiguous_or_invalid_failure_receipt_fails(self):
        for change in ("missing", "reserved", "no-message"):
            with self.subTest(change=change):
                store, e = self.prepared("failure")
                key = next(iter(store.state["telegramDeliveries"]))
                if change == "missing":
                    store.state["telegramDeliveries"].pop(key)
                elif change == "reserved":
                    store.state["telegramDeliveries"][key]["status"] = "reserved"
                else:
                    store.state["telegramDeliveries"][key].pop("messageId")
                with self.assertRaises(t.Fault):
                    self.verify(store, e)

    def test_legacy_loss_and_wrong_processed_result_cannot_pass(self):
        for name, key in (("notifiedFailures", "old-fingerprint"), ("processedAttempts", "123:1")):
            with self.subTest(name=name):
                store, e = self.prepared()
                store.state[name].pop(key)
                with self.assertRaises(t.Fault):
                    self.verify(store, e)

    def test_wrong_sha_or_nonstable_or_incomplete_production_cannot_pass(self):
        for kind in ("sha", "canary", "production", "attempt", "observer-error"):
            with self.subTest(kind=kind):
                store, e = self.prepared()
                if kind == "sha": self.run["head_sha"] = "b" * 40
                if kind == "canary": self.run["display_title"] = "Release (canary) on main"
                if kind == "production": self.jobs[-1]["status"] = "in_progress"
                if kind == "attempt": self.run["run_attempt"] = 2
                if kind == "observer-error": store.state["telegramObserverError"] = "unavailable"
                with self.assertRaises(t.Fault):
                    self.verify(store, e)

    def test_no_arm_without_direct_real_event_and_never_replace_first_release(self):
        store = MemoryStore(baseline())
        t.arm_acceptance(store, store.load(), "", [event()])
        t.arm_acceptance(store, store.load(), "123", [])
        self.assertEqual(store.writes, [])
        t.arm_acceptance(store, store.load(), "123", [event()])
        other = {**event(), "runId": 456}
        t.arm_acceptance(store, store.load(), "456", [other])
        self.assertEqual(store.state["telegramReleaseAcceptance"]["runId"], 123)
        t.arm_acceptance(store, store.load(), "123", [event(attempt=2)])
        self.assertEqual(store.state["telegramReleaseAcceptance"]["attempt"], 2)

    def test_no_success_when_state_write_conflicts(self):
        store, e = self.prepared()
        with patch.object(store, "save", side_effect=t.Fault("conflict")):
            with self.assertRaises(t.Fault): self.verify(store, e)
        self.assertEqual(store.state["telegramReleaseAcceptance"]["status"], "pending")

    def test_completed_marker_never_rearms_on_future_release(self):
        store, e = self.prepared()
        self.verify(store, e)
        marker = copy.deepcopy(store.state["telegramReleaseAcceptance"])
        t.arm_acceptance(store, store.load(), "456", [{**event(), "runId": 456}])
        self.assertEqual(store.state["telegramReleaseAcceptance"], marker)


if __name__ == "__main__":
    unittest.main()
