# -*- coding: utf-8 -*-
import concurrent.futures
import copy
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'production-notifier.py'
spec = importlib.util.spec_from_file_location('production_notifier', SCRIPT)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
FIXTURE = Path(__file__).parent / 'fixtures' / 'production-notifier-failure.json'
FAILURE = json.loads(FIXTURE.read_text())[0]


def baseline():
    return {'schemaVersion': 1, 'startedAt': m.STARTED_AT, 'processedAttempts': {}, 'notifiedFailures': {}, 'observerError': None}


def event(**changes):
    result = copy.deepcopy(FAILURE)
    result.update(changes)
    return result


class Decisions(unittest.TestCase):
    def test_failure_explains_scenario_once(self):
        state, notices = m.evaluate(baseline(), [event()])
        self.assertEqual(len(notices), 1)
        self.assertIn('sign-in: empty form validation', notices[0]['reason'])
        self.assertIn('it was hidden', notices[0]['reason'])
        _, notices = m.evaluate(state, [event()])
        self.assertEqual(notices, [])

    def test_same_release_retry_deduplicates(self):
        state, _ = m.evaluate(baseline(), [event()])
        state, notices = m.evaluate(state, [event(attempt=2)])
        self.assertEqual(notices, [])
        self.assertIn('TEST-PRODUCTION-001:2', state['processedAttempts'])

    def test_new_cause_notifies_same_release(self):
        state, _ = m.evaluate(baseline(), [event()])
        _, notices = m.evaluate(state, [event(attempt=2, failures={'demo': [{'title':'settings', 'message':'Missing heading'}]})])
        self.assertEqual(len(notices), 1)

    def test_new_release_notifies_same_cause(self):
        state, _ = m.evaluate(baseline(), [event()])
        _, notices = m.evaluate(state, [event(runId='TEST-NEW', sha='1'*40)])
        self.assertEqual(len(notices), 1)

    def test_green_recovery_and_fresh_green_silent(self):
        state, _ = m.evaluate(baseline(), [event()])
        green = event(attempt=2, conclusion='success', reports={}, failures={})
        for source in [state, baseline()]:
            _, notices = m.evaluate(source, [green])
            self.assertEqual(notices, [])

    def test_skipped_pending_running_silent(self):
        for value in [event(conclusion='skipped'), event(status='queued'), event(status='in_progress')]:
            _, notices = m.evaluate(baseline(), [value])
            self.assertEqual(notices, [])

    def test_pre_monitoring_result_is_baseline(self):
        _, notices = m.evaluate(baseline(), [event(startedAt='2026-10-13T12:00:00Z')])
        self.assertEqual(notices, [])

    def test_cancelled_running_is_interruption_even_with_partial_failure(self):
        _, notices = m.evaluate(baseline(), [event(conclusion='cancelled')])
        self.assertEqual(notices[0]['category'], 'interrupted')
        self.assertIn('correctness was not established', notices[0]['reason'])

    def test_cancelled_before_start_silent(self):
        _, notices = m.evaluate(baseline(), [event(conclusion='cancelled', steps=[])])
        self.assertEqual(notices, [])

    def test_preparation_is_not_application_failure(self):
        _, notices = m.evaluate(baseline(), [event(reports={}, failures={}, steps=[{'name':'Setup locked Bun','conclusion':'failure'}])])
        self.assertEqual(notices[0]['category'], 'preparation:Setup locked Bun')

    def test_unknown_readiness_cause_is_explicitly_uncertain(self):
        _, notices = m.evaluate(baseline(), [event(reports={}, failures={})])
        self.assertIn('precise cause is unavailable', notices[0]['reason'])

    def test_timeout_and_startup_failure(self):
        for conclusion in ['timed_out', 'startup_failure', 'action_required']:
            _, notices = m.evaluate(baseline(), [event(conclusion=conclusion, reports={}, failures={})])
            self.assertEqual(len(notices), 1)
        self.assertEqual(m.diagnose(event(conclusion='timed_out', reports={})) [0], 'timeout')

    def test_flaky_and_skips_in_failed_report_are_visible(self):
        for key in ['skipped', 'flaky']:
            _, notices = m.evaluate(baseline(), [event(reports={'demo':{key:1}})])
            self.assertIn(key+'=1', notices[0]['reason'])

    def test_existing_fingerprints_preserved(self):
        state = baseline()
        state['notifiedFailures']['existing-fingerprint'] = {'sha':'old','category':'old'}
        original = copy.deepcopy(state)
        result, _ = m.evaluate(state, [event()])
        self.assertEqual(state, original)
        self.assertEqual(result['notifiedFailures']['existing-fingerprint'], original['notifiedFailures']['existing-fingerprint'])

    def test_redaction_before_truncation_and_sensitive_headers(self):
        secret = 'sensitive-' * 40
        with patch.dict(os.environ, {'GH_TOKEN':secret, 'SNOWUI_DEMO_AUTOMATION_SECRET':secret}):
            self.assertEqual(m.safe_text(secret), '[redacted]')
        for value in ['Authorization: Bearer hidden', 'cookie=hidden', 'x-vercel-protection-bypass: hidden']:
            self.assertEqual(m.safe_text(value), 'Sensitive diagnostic omitted')
        self.assertNotIn('a'*40, m.safe_text('hash '+ 'a'*40))

    def test_report_extraction_limits_and_sanitizes(self):
        data={'specs':[{'title':'form','tests':[{'status':'unexpected','results':[{'errors':[{'message':'cookie=secret'}]}]}]}]*5}
        result=m.report_failures(data)
        self.assertEqual(len(result), 3)
        self.assertEqual(result[0]['message'], 'Sensitive diagnostic omitted')

    def test_api_is_read_only_paginated(self):
        def command(args, **kwargs):
            self.assertEqual(args[:2], ['gh','api'])
            self.assertIn('--paginate',args)
            self.assertIn('--slurp',args)
            self.assertFalse(any(x in args for x in ['-X','--method','-f','-F']))
            return subprocess.CompletedProcess(args,0,'[[], []]','')
        with patch.object(m.subprocess,'run',side_effect=command):
            self.assertEqual(m.api('/test'),[[],[]])

    def test_latest_attempt_all_pages_excludes_nonproduction_jobs(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':3}
        calls=[]
        def api(path):
            calls.append(path)
            if '/workflows/' in path:
                self.assertIn('release.yml/runs?branch=main',path)
                return [{'workflow_runs':[]},{'workflow_runs':[run]}]
            self.assertIn('/attempts/3/jobs',path)
            return [{'jobs':[{'name':'npm publish','status':'completed','conclusion':'failure'}]}, {'jobs':[{'name':'production / production','status':'completed','conclusion':'success','steps':[]}]}]
        with patch.object(m,'api',side_effect=api):
            events,count=m.events_from_github(baseline())
        self.assertEqual((len(events),count),(1,1))
        self.assertEqual(events[0]['attempt'],3)
        self.assertEqual(len(calls),2)

    def test_old_attempt_artifact_not_downloaded(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':2}
        def api(path):
            if '/workflows/' in path:return [{'workflow_runs':[run]}]
            if '/artifacts' in path:return [{'artifacts':[{'name':'production-results','expired':False,'created_at':'2026-10-14T00:00:00Z'}]}]
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z'}]}]
        with patch.object(m,'api',side_effect=api),patch.object(m.subprocess,'run') as download:
            events,_=m.events_from_github(baseline())
            download.assert_not_called()
        self.assertEqual(events[0]['reports'],{})

    def test_current_artifact_parsed_as_data(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':2}
        def api(path):
            if '/workflows/' in path:return [{'workflow_runs':[run]}]
            if '/artifacts' in path:return [{'artifacts':[{'name':'production-results','expired':False,'created_at':'2026-10-15T00:01:00Z'}]}]
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z'}]}]
        def download(args,**kwargs):
            self.assertEqual(args[:3],['gh','run','download'])
            target=Path(args[args.index('--dir')+1]);(target/'demo.json').write_text(json.dumps({'stats':{'unexpected':1},'specs':[]}))
            return subprocess.CompletedProcess(args,0,b'',b'')
        with patch.object(m,'api',side_effect=api),patch.object(m.subprocess,'run',side_effect=download):
            events,_=m.events_from_github(baseline())
        self.assertEqual(events[0]['reports']['demo']['unexpected'],1)

    def test_malformed_artifact_is_deduplicated_observer_error(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':2}
        def api(path):
            if '/workflows/' in path:return [{'workflow_runs':[run]}]
            if '/artifacts' in path:return [{'artifacts':[{'name':'production-results','expired':False,'created_at':'2026-10-15T00:01:00Z'}]}]
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z'}]}]
        for malformed in [[], {'stats': []}, {'stats': {'unexpected': 'secret'}}, {'stats': {'unexpected': -1}}, {'stats': {}, 'specs': [None]}]:
            with self.subTest(data=malformed), tempfile.TemporaryDirectory() as directory:
                target=Path(directory)/'state.json'
                def download(args, **kwargs):
                    destination=Path(args[args.index('--dir')+1])
                    (destination/'demo.json').write_text(json.dumps(malformed))
                    return subprocess.CompletedProcess(args,0,b'',b'')
                decisions=[]
                for _ in range(2):
                    output=io.StringIO()
                    with patch.object(m,'STATE',target),patch.object(m,'api',side_effect=api),patch.object(m.subprocess,'run',side_effect=download),patch.object(sys,'argv',[str(SCRIPT)]),patch.object(sys,'stdout',output):
                        m.main()
                    result=json.loads(output.getvalue())
                    self.assertIn('observerError',result)
                    self.assertNotIn('secret',output.getvalue())
                    decisions.append(result['decision'])
                self.assertEqual(decisions,['NOTIFY','DONT_NOTIFY'])

    def test_fixture_cannot_target_real_state_from_other_cwd(self):
        for suffix in [[],['--state',str(m.STATE)]]:
            result=subprocess.run([sys.executable,str(SCRIPT),'--fixture',str(FIXTURE)]+suffix,capture_output=True,cwd='/tmp')
            self.assertNotEqual(result.returncode,0)
            self.assertIn(b'isolated state',result.stderr)

    def test_concurrent_cli_notifies_once(self):
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'state.json';target.write_text(json.dumps(baseline()))
            args=[sys.executable,str(SCRIPT),'--fixture',str(FIXTURE),'--state',str(target)]
            with concurrent.futures.ThreadPoolExecutor(2) as pool:
                results=list(pool.map(lambda _:json.loads(subprocess.run(args,capture_output=True,text=True,check=True).stdout),range(2)))
            self.assertEqual(sorted(r['decision'] for r in results),['DONT_NOTIFY','NOTIFY'])

    def test_cli_corrupt_state_preserved_and_reports_once(self):
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'state.json';target.write_text('{broken')
            args=[sys.executable,str(SCRIPT),'--fixture',str(FIXTURE),'--state',str(target)]
            results=[json.loads(subprocess.run(args,capture_output=True,text=True,check=True).stdout) for _ in range(2)]
            self.assertEqual([r['decision'] for r in results],['NOTIFY','DONT_NOTIFY'])
            self.assertEqual(target.read_text(),'{broken')

    def test_observer_error_dedup_and_recovery(self):
        with tempfile.TemporaryDirectory() as directory:
            state=Path(directory)/'state.json';state.write_text(json.dumps(baseline()))
            fixture=Path(directory)/'fixture.json';fixture.write_text('[{}]')
            args=[sys.executable,str(SCRIPT),'--fixture',str(fixture),'--state',str(state)]
            results=[json.loads(subprocess.run(args,capture_output=True,text=True,check=True).stdout) for _ in range(2)]
            self.assertEqual([r['decision'] for r in results],['NOTIFY','DONT_NOTIFY'])
            self.assertIn('observerError',results[0])
            fixture.write_text('[]')
            self.assertEqual(json.loads(subprocess.run(args,capture_output=True,text=True,check=True).stdout)['decision'],'DONT_NOTIFY')
            self.assertIsNone(json.loads(state.read_text())['observerError'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
