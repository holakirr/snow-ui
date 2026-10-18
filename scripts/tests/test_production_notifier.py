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
import zipfile
from unittest.mock import patch

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'production-notifier.py'
spec = importlib.util.spec_from_file_location('production_notifier', SCRIPT)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
FIXTURE = Path(__file__).parent / 'fixtures' / 'production-notifier-failure.json'
FAILURE = json.loads(FIXTURE.read_text())[0]


def archive_bytes(data, filename='demo.json'):
    output=io.BytesIO()
    with zipfile.ZipFile(output,'w') as archive:
        archive.writestr(filename,json.dumps(data))
    return output.getvalue()


def baseline():
    return {'schemaVersion': 1, 'startedAt': m.STARTED_AT, 'processedAttempts': {}, 'notifiedFailures': {}, 'observerError': None}


def event(**changes):
    result = copy.deepcopy(FAILURE)
    result.update(changes)
    return result


class Decisions(unittest.TestCase):
    def test_github_diagnostics_are_fixed_labels_without_stderr(self):
        for stderr, category in [
            ('HTTP 503 private diagnostic', 'github-unavailable'),
            ('HTTP 403 rate limit exceeded private diagnostic', 'rate-limited'),
            ('HTTP 401 private diagnostic', 'access-denied'),
            ('error connecting: TLS handshake timeout private diagnostic', 'network-error'),
            ('private diagnostic', 'request-failed'),
        ]:
            with patch.object(m.subprocess, 'run', return_value=subprocess.CompletedProcess([], 1, '', stderr)):
                with self.assertRaises(m.ObservationError) as caught:
                    m.api('/actions/workflows/release.yml/runs')
            self.assertEqual(caught.exception.diagnostic, {'stage': 'release-list', 'category': category})
            self.assertNotIn('private diagnostic', str(caught.exception))
        with patch.object(m.subprocess, 'run', side_effect=subprocess.TimeoutExpired(['gh', 'private'], 90)):
            with self.assertRaises(m.ObservationError) as caught:
                m.api('/actions/runs/42/jobs')
        self.assertEqual(caught.exception.diagnostic, {'stage': 'job-list', 'category': 'timeout'})

    def test_diagnostic_preserves_existing_dedup_and_clears_on_silent_recovery(self):
        original, _ = m.evaluate(baseline(), [event()])
        original['observerError'] = 'GitHub observation could not be completed; production failure is not established.'
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'state.json'
            target.write_text(json.dumps(original))
            for failure in [True, False]:
                output = io.StringIO()
                adapter = patch.object(m, 'events_from_github', side_effect=m.ObservationError('release-list', 'network-error')) if failure else patch.object(m, 'events_from_github', return_value=([], 139))
                with patch.object(m, 'STATE', target), adapter, patch.object(sys, 'argv', [str(SCRIPT)]), patch.object(sys, 'stdout', output):
                    m.main()
                result = json.loads(output.getvalue())
                self.assertEqual(result['decision'], 'DONT_NOTIFY')
                saved = json.loads(target.read_text())
                for key in ['processedAttempts', 'notifiedFailures', 'startedAt']:
                    self.assertEqual(saved[key], original[key])
                if failure:
                    self.assertEqual(saved['observerDiagnostic'], {'stage': 'release-list', 'category': 'network-error'})
                else:
                    self.assertNotIn('observerDiagnostic', saved)
                    self.assertIsNone(saved['observerError'])

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
            if '/artifacts' in path:return [{'artifacts':[{'id':2,'name':'production-results','expired':False,'created_at':'2026-10-14T00:00:00Z'}]}]
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z'}]}]
        with patch.object(m,'api',side_effect=api),patch.object(m.subprocess,'run') as download:
            events,_=m.events_from_github(baseline())
            download.assert_not_called()
        self.assertEqual(events[0]['reports'],{})

    def test_current_artifact_parsed_as_data(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':2}
        def api(path):
            if '/workflows/' in path:return [{'workflow_runs':[run]}]
            if '/artifacts' in path:return [{'artifacts':[{'id':1,'name':'production-results','expired':False,'created_at':'2026-10-14T00:00:00Z'}, {'id':2,'name':'production-results','expired':False,'created_at':'2026-10-15T00:01:00Z'}, {'id':3,'name':'production-results','expired':False,'created_at':'2026-10-16T00:01:00Z'}]}]
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z','completed_at':'2026-10-15T00:02:00Z'}]}]
        def download(args,**kwargs):
            self.assertEqual(args,['gh','api','repos/holakirr/snow-ui/actions/artifacts/2/zip'])
            return subprocess.CompletedProcess(args,0,archive_bytes({'stats':{'unexpected':1},'specs':[]}),b'')
        with patch.object(m,'api',side_effect=api),patch.object(m.subprocess,'run',side_effect=download):
            events,_=m.events_from_github(baseline())
        self.assertEqual(events[0]['reports']['demo']['unexpected'],1)

    def test_malformed_artifact_is_deduplicated_observer_error(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':2}
        def api(path):
            if '/workflows/' in path:return [{'workflow_runs':[run]}]
            if '/artifacts' in path:return [{'artifacts':[{'id':1,'name':'production-results','expired':False,'created_at':'2026-10-14T00:00:00Z'}, {'id':2,'name':'production-results','expired':False,'created_at':'2026-10-15T00:01:00Z'}]}]
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z'}]}]
        for malformed in [[], {'stats': []}, {'stats': {'unexpected': 'secret'}}, {'stats': {'unexpected': -1}}, {'stats': {}, 'specs': [None]}]:
            with self.subTest(data=malformed), tempfile.TemporaryDirectory() as directory:
                target=Path(directory)/'state.json'
                def download(args, **kwargs):
                    return subprocess.CompletedProcess(args,0,archive_bytes(malformed),b'')
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

    def test_archive_limits_and_no_extraction(self):
        for payload in [b'not a zip', archive_bytes({}, '../demo.json'), archive_bytes({}, '/demo.json')]:
            with self.subTest(payload=payload[:10]), self.assertRaises(RuntimeError):
                m.reports_from_zip(payload)
        output=io.BytesIO()
        with zipfile.ZipFile(output,'w') as archive:
            archive.writestr('demo.json','{}')
            archive.writestr('nested/demo.json','{}')
        with self.assertRaises(RuntimeError): m.reports_from_zip(output.getvalue())
        with self.assertRaises(RuntimeError): m.reports_from_zip(archive_bytes('x'*(2*1024*1024)))
        # Unrelated artifact members are ignored, including logs and executable text.
        self.assertEqual(m.reports_from_zip(archive_bytes('do not execute', 'raw.log')), {})

    def test_artifact_api_error_is_observer_error(self):
        run={'id':42,'head_sha':'1'*40,'html_url':'https://example.invalid/run','status':'completed','updated_at':'2026-10-15T00:00:00Z','run_started_at':'2026-10-15T00:00:00Z','run_attempt':2}
        def api(path):
            if '/workflows/' in path:return [{'workflow_runs':[run]}]
            if '/artifacts' in path:raise RuntimeError('sensitive source message')
            return [{'jobs':[{'name':'production','status':'completed','conclusion':'failure','steps':[],'started_at':'2026-10-15T00:00:00Z'}]}]
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'state.json'
            results=[]
            for _ in range(2):
                output=io.StringIO()
                with patch.object(m,'STATE',target),patch.object(m,'api',side_effect=api),patch.object(sys,'argv',[str(SCRIPT)]),patch.object(sys,'stdout',output):
                    m.main()
                results.append(json.loads(output.getvalue()))
            self.assertEqual([r['decision'] for r in results],['NOTIFY','DONT_NOTIFY'])
            self.assertTrue(all('observerError' in r and 'notifications' not in r for r in results))
            self.assertEqual(json.loads(target.read_text())['processedAttempts'],{})

    def test_storage_failures_still_emit_safe_json(self):
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'state.json'
            for failure in ['write','lock']:
                output=io.StringIO()
                extra=patch.object(m,'write_state',side_effect=OSError('sensitive disk text')) if failure=='write' else patch('builtins.open',side_effect=OSError('sensitive lock text'))
                with patch.object(m,'STATE',target),patch.object(m,'events_from_github',return_value=([],0)),patch.object(sys,'argv',[str(SCRIPT)]),patch.object(sys,'stdout',output),extra:
                    m.cli()
                result=json.loads(output.getvalue())
                self.assertEqual(result['decision'],'NOTIFY')
                self.assertIn('observerError',result)
                self.assertIn('deduplication unavailable',result['observerError'])
                self.assertNotIn('sensitive',output.getvalue())

    def test_utf8_fixture_state_roundtrip(self):
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'state.json'
            state=baseline();state['note']='Проверка'
            target.write_text(json.dumps(state,ensure_ascii=False),encoding='utf-8')
            fixture=Path(directory)/'fixture.json';fixture.write_text('[]',encoding='utf-8')
            result=subprocess.run([sys.executable,str(SCRIPT),'--fixture',str(fixture),'--state',str(target)],capture_output=True,text=True,check=True)
            self.assertEqual(json.loads(result.stdout)['decision'],'DONT_NOTIFY')
            self.assertEqual(json.loads(target.read_text(encoding='utf-8'))['note'],'Проверка')

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
