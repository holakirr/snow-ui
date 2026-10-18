"""No network or real state: event filtering and crash/dedup delivery contracts."""
import copy
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
