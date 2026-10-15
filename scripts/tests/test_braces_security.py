# -*- coding: utf-8 -*-
import concurrent.futures
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'braces-security-check.py'
spec = importlib.util.spec_from_file_location('braces_check', SCRIPT)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
# 3.0.4 is a fictional test release, not a claim about npm.
BASE = {'patched': None, 'affected': '<= 3.0.3', 'versions': ['3.0.3'], 'prs': []}
PATCHED = dict(BASE, patched='3.0.4', versions=['3.0.3', '3.0.4'])


def pr(state='OPEN'):
    return {'number': 999999, 'state': state, 'branch': 'codex/braces-security-3-0-4', 'url': 'https://example.invalid/pr/999999', 'title': 'fix: braces', 'body': '[braces-security-remediation] ' + m.ADVISORY}


class Decisions(unittest.TestCase):
    def test_no_patch_is_silent_repeatedly(self):
        state = {}
        for _ in range(3):
            self.assertEqual(m.run(BASE, state), {'decision': 'DONT_NOTIFY', 'action': 'WAIT_NO_PATCH'})
        self.assertNotIn('active', state)

    def test_new_version_without_advisory_fix_is_not_update(self):
        self.assertEqual(m.run(dict(BASE, versions=['3.0.3', '3.0.4']), {})['action'], 'WAIT_NO_PATCH')

    def test_unpublished_patch_is_not_update(self):
        self.assertEqual(m.run(dict(PATCHED, versions=['3.0.3']), {})['action'], 'WAIT_PUBLICATION')

    def test_first_trigger_starts_once_then_resumes(self):
        state = {}
        actions = [m.run(PATCHED, state)['action'] for _ in range(3)]
        self.assertEqual(actions, ['START_UPDATE', 'RESUME_BRANCH', 'RESUME_BRANCH'])

    def test_changed_advisory_refreshes_active_target(self):
        state = {}
        first = m.run(PATCHED, state)
        newer = dict(PATCHED, patched='3.0.5', affected='<= 3.0.4', versions=['3.0.3', '3.0.4', '3.0.5'])
        result = m.run(newer, state)
        self.assertEqual(result['action'], 'RESUME_BRANCH')
        self.assertEqual(result['version'], '3.0.5')
        self.assertEqual(state['active']['version'], '3.0.5')
        self.assertEqual(result['branch'], first['branch'])

    def test_new_patch_after_old_merge_starts_new_branch(self):
        state = {}
        m.run(PATCHED, state)
        merged = dict(PATCHED, prs=[pr('MERGED')])
        self.assertEqual(m.run(merged, state)['action'], 'VERIFY_MERGED')
        newer = dict(merged, patched='3.0.5', affected='<= 3.0.4', versions=['3.0.4', '3.0.5'])
        result = m.run(newer, state)
        self.assertEqual(result['action'], 'START_UPDATE')
        self.assertEqual(result['version'], '3.0.5')
        self.assertEqual(result['branch'], 'codex/braces-security-3-0-5')

    def test_open_pr_resumes_without_new_pr(self):
        state = {}
        data = dict(PATCHED, prs=[pr()])
        for _ in range(3):
            r = m.run(data, state)
            self.assertEqual((r['action'], r['pr']), ('RESUME_PR', 999999))

    def test_simulated_full_flow_does_not_duplicate_pr(self):
        state, prs, starts, creates = {}, [], 0, 0
        for _ in range(4):
            r = m.run(dict(PATCHED, prs=prs), state)
            if r['action'] == 'START_UPDATE':
                starts += 1
                prs.append(pr())
                creates += 1
            else:
                self.assertEqual(r['action'], 'RESUME_PR')
        self.assertEqual((starts, creates), (1, 1))
        r = m.run(dict(PATCHED, prs=[pr('MERGED')]), state)
        self.assertEqual(r['action'], 'VERIFY_MERGED')
        self.assertEqual(r['decision'], 'DONT_NOTIFY')

    def test_closed_pr_blocks_once(self):
        state = {}
        data = dict(PATCHED, prs=[pr('CLOSED')])
        self.assertEqual(m.run(data, state)['decision'], 'NOTIFY')
        self.assertEqual(m.run(data, state)['decision'], 'DONT_NOTIFY')
        self.assertNotIn('active', state)

    def test_existing_different_version_pr_is_reused(self):
        p = pr(); p['branch'] = 'codex/old-braces-update'
        self.assertEqual(m.run(dict(PATCHED, prs=[p]), {})['action'], 'RESUME_PR')

    def test_unrelated_braces_documentation_pr_is_ignored(self):
        p = pr(); p.update(branch='codex/braces-automation-ci', body='Tests for ' + m.ADVISORY)
        self.assertEqual(m.run(dict(PATCHED, prs=[p]), {})['action'], 'START_UPDATE')

    def test_two_open_prs_block(self):
        self.assertEqual(m.run(dict(PATCHED, prs=[pr(), dict(pr(), number=999998)]), {})['action'], 'BLOCKED')

    def test_source_error_dedup(self):
        state = {}
        data = {'observerError': 'github_unavailable'}
        self.assertEqual(m.run(data, state)['decision'], 'NOTIFY')
        self.assertEqual(m.run(data, state)['decision'], 'DONT_NOTIFY')
        m.run(BASE, state)
        self.assertEqual(m.run(data, state)['decision'], 'NOTIFY')

    def test_conflicting_advisory_blocks(self):
        r = m.run(dict(PATCHED, affected='<= 3.0.4'), {})
        self.assertEqual(r['action'], 'OBSERVER_ERROR')

    def test_live_adapter_read_only_and_pagination(self):
        class Response:
            def __enter__(self):
                import io
                return io.StringIO(json.dumps({'versions': {'3.0.3': {}, '3.0.4': {}}}))
            def __exit__(self, *args): pass
        advisory = {'vulnerabilities': [{'package': {'ecosystem': 'npm', 'name': 'braces'}, 'first_patched_version': '3.0.4', 'vulnerable_version_range': '<= 3.0.3'}]}
        raw = {'number':999999,'state':'open','merged_at':None,'head':{'ref':pr()['branch'],'repo':{'full_name':m.REPO}},'html_url':pr()['url'],'title':'fix braces','body':m.ADVISORY}
        def call(args, **kwargs):
            self.assertEqual(args[:2], ['gh', 'api'])
            self.assertIn('--paginate', args)
            self.assertFalse(any(x in args for x in ['--method', '-X', '-f', '-F']))
            deleted_fork = dict(raw, number=999998, head={'ref': 'old-fork', 'repo': None})
            other_fork = dict(raw, number=999997, head={'ref': pr()['branch'], 'repo': {'full_name': 'someone/snow-ui'}})
            out = [advisory] if '/advisories/' in args[2] else [[deleted_fork, other_fork], [raw]]
            return subprocess.CompletedProcess(args, 0, json.dumps(out), '')
        with patch.object(m.urllib.request, 'urlopen', return_value=Response()), patch.object(m.subprocess, 'run', side_effect=call):
            self.assertEqual(m.run(m.live_data(), {})['action'], 'RESUME_PR')

    def test_fixture_cannot_write_default_state(self):
        r = subprocess.run([sys.executable, str(SCRIPT), '--fixture', '/tmp/not-used.json', '--state', str(m.STATE)], capture_output=True)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn(b'production state is forbidden', r.stderr)

    def test_corrupt_state_reports_once_without_overwrite(self):
        for broken in ['{broken', '[]', '{"active": {}}']:
            with self.subTest(broken=broken), tempfile.TemporaryDirectory() as temp:
                f, state = Path(temp)/'patch.json', Path(temp)/'state.json'
                f.write_text(json.dumps(BASE))
                state.write_text(broken)
                args = [sys.executable, str(SCRIPT), '--fixture', str(f), '--state', str(state)]
                results = [json.loads(subprocess.run(args, capture_output=True, text=True, check=True).stdout) for _ in range(2)]
                self.assertEqual([r['decision'] for r in results], ['NOTIFY', 'DONT_NOTIFY'])
                self.assertEqual(state.read_text(), broken)
                self.assertTrue(all(r['action']=='OBSERVER_ERROR' for r in results))
                state.write_text('{}')
                self.assertEqual(json.loads(subprocess.run(args, capture_output=True, text=True, check=True).stdout)['action'], 'WAIT_NO_PATCH')
                state.write_text(broken)
                self.assertEqual(json.loads(subprocess.run(args, capture_output=True, text=True, check=True).stdout)['decision'], 'NOTIFY')

    def test_concurrent_cli_only_starts_once(self):
        with tempfile.TemporaryDirectory() as temp:
            f, s = Path(temp)/'patch.json', Path(temp)/'state.json'
            f.write_text(json.dumps(PATCHED))
            args = [sys.executable, str(SCRIPT), '--fixture', str(f), '--state', str(s)]
            with concurrent.futures.ThreadPoolExecutor(2) as pool:
                results = list(pool.map(lambda _: subprocess.run(args, capture_output=True, text=True, check=True), range(2)))
            actions = sorted(json.loads(r.stdout)['action'] for r in results)
            self.assertEqual(actions, ['RESUME_BRANCH', 'START_UPDATE'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
