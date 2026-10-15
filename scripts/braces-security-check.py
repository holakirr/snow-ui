# -*- coding: utf-8 -*-
"""Read-only source/PR lookup and durable update planning; never mutates GitHub/deps."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / '.tmp' / 'braces-security-state.json'
ADVISORY = 'GHSA-vfj7-8cjw-p6xm'
REPO = 'holakirr/snow-ui'


def version(value):
    if not isinstance(value, str) or not re.fullmatch(r'\d+\.\d+\.\d+', value):
        raise ValueError('unsupported_version')
    return tuple(map(int, value.split('.')))


def github(path):
    result = subprocess.run(['gh', 'api', path, '--paginate', '--slurp'], capture_output=True, text=True, timeout=90)
    if result.returncode:
        raise RuntimeError('github_unavailable')
    return json.loads(result.stdout)


def live_data():
    try:
        with urllib.request.urlopen('https://registry.npmjs.org/braces', timeout=30) as response:
            npm = json.load(response)
    except Exception:
        raise RuntimeError('npm_unavailable') from None
    advisory = github('/advisories/' + ADVISORY)[0]
    vulnerabilities = [v for v in advisory['vulnerabilities'] if v['package'] == {'ecosystem': 'npm', 'name': 'braces'}]
    if len(vulnerabilities) != 1:
        raise ValueError('unsupported_advisory')
    v = vulnerabilities[0]
    patched = v.get('first_patched_version')
    prs = []
    if patched:
        prs = [pr for page in github('/repos/' + REPO + '/pulls?state=all&base=main&per_page=100') for pr in page]
        prs = [{'number': p['number'], 'state': 'MERGED' if p.get('merged_at') else p['state'].upper(), 'branch': p['head']['ref'], 'url': p['html_url'], 'title': p['title'], 'body': p.get('body') or ''} for p in prs if (p['head'].get('repo') or {}).get('full_name') == REPO]
    return {'patched': patched, 'affected': v['vulnerable_version_range'], 'versions': list(npm['versions']), 'prs': prs}


def decide(data, state):
    if data.get('observerError'):
        raise RuntimeError(data['observerError'])
    patched = data.get('patched')
    active = state.get('active')
    if not patched:
        if active:
            return {'decision': 'NOTIFY', 'action': 'BLOCKED', 'reason': 'patch_confirmation_withdrawn'}
        return {'decision': 'DONT_NOTIFY', 'action': 'WAIT_NO_PATCH'}
    fixed = version(patched)
    affected = re.fullmatch(r'\s*<=\s*(\d+\.\d+\.\d+)\s*', data['affected'])
    if not affected or fixed <= version(affected[1]):
        raise ValueError('unsupported_or_conflicting_advisory')
    if patched not in data['versions']:
        return {'decision': 'DONT_NOTIFY', 'action': 'WAIT_PUBLICATION'}
    if active and active['version'] != patched and any(
        p['state'] == 'MERGED' and p['branch'] == active['branch']
        for p in data['prs']
    ):
        # A completed older patch must not capture the next remediation.
        active = None
        state.pop('active', None)
    if active:
        # Keep the reserved branch, but never resume an obsolete vulnerable target.
        active['version'] = patched
    related = [p for p in data['prs'] if re.fullmatch(r'codex/braces-security-\d+-\d+-\d+', p['branch']) or '[braces-security-remediation]' in p.get('body', '')]
    opened = [p for p in related if p['state'] == 'OPEN']
    if len(opened) > 1:
        return {'decision': 'NOTIFY', 'action': 'BLOCKED', 'reason': 'multiple_existing_prs'}
    if opened:
        pr = opened[0]
        state['active'] = {'version': patched, 'branch': pr['branch'], 'pr': pr['number']}
        return {'decision': 'DONT_NOTIFY', 'action': 'RESUME_PR', 'version': patched, 'branch': pr['branch'], 'pr': pr['number'], 'url': pr['url']}
    branch = active['branch'] if active else 'codex/braces-security-' + patched.replace('.', '-')
    previous = [p for p in related if p['branch'] == branch]
    if previous:
        pr = previous[0]
        if pr['state'] == 'MERGED':
            return {'decision': 'DONT_NOTIFY', 'action': 'VERIFY_MERGED', 'version': patched, 'branch': branch, 'pr': pr['number'], 'url': pr['url']}
        return {'decision': 'NOTIFY', 'action': 'BLOCKED', 'reason': 'existing_pr_closed_without_merge', 'pr': pr['number']}
    if active:
        return {'decision': 'DONT_NOTIFY', 'action': 'RESUME_BRANCH', 'version': active['version'], 'branch': branch}
    state['active'] = {'version': patched, 'branch': branch}
    return {'decision': 'DONT_NOTIFY', 'action': 'START_UPDATE', 'version': patched, 'branch': branch}


def run(data, state):
    try:
        result = decide(data, state)
        state.pop('observerError', None)
    except Exception as error:
        # Only fixed diagnostic codes are exposed, never source messages/headers.
        code = str(error)
        if code not in {'npm_unavailable', 'github_unavailable', 'unsupported_version', 'unsupported_advisory', 'unsupported_or_conflicting_advisory'}:
            code = 'source_or_state_unavailable'
        result = {'decision': 'DONT_NOTIFY' if state.get('observerError') == code else 'NOTIFY', 'action': 'OBSERVER_ERROR', 'observerError': code}
        state['observerError'] = code
    if result['action'] == 'BLOCKED':
        if state.get('lastBlock') == result:
            result = dict(result, decision='DONT_NOTIFY')
        else:
            state['lastBlock'] = dict(result)
    else:
        state.pop('lastBlock', None)
    state['lastAction'] = result['action']
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixture', type=Path)
    parser.add_argument('--state', type=Path)
    args = parser.parse_args()
    target = (args.state or STATE).resolve()
    if args.fixture and (not args.state or target == STATE.resolve()):
        parser.error('fixture requires an isolated --state; production state is forbidden')
    if not args.fixture and args.state:
        parser.error('live mode must use the default state')
    target.parent.mkdir(parents=True, exist_ok=True)
    with open(str(target) + '.lock', 'a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        fault_marker = Path(str(target) + '.observer-error')
        try:
            state = json.loads(target.read_text()) if target.exists() else {'schema': 1}
            if not isinstance(state, dict):
                raise ValueError('invalid state')
            active = state.get('active')
            if active is not None and (
                not isinstance(active, dict)
                or not isinstance(active.get('branch'), str)
                or not isinstance(active.get('version'), str)
            ):
                raise ValueError('invalid active state')
        except (OSError, ValueError):
            result = {'decision': 'DONT_NOTIFY' if fault_marker.exists() else 'NOTIFY',
                      'action': 'OBSERVER_ERROR', 'observerError': 'source_or_state_unavailable'}
            fault_marker.write_text('source_or_state_unavailable\n')
            print(json.dumps(result))
            return
        if fault_marker.exists():
            fault_marker.unlink()
        if args.fixture:
            data = json.loads(args.fixture.read_text())
        else:
            try:
                data = live_data()
            except Exception as error:
                data = {'observerError': str(error)}
        result = run(data, state)
        fd, temp = tempfile.mkstemp(dir=target.parent)
        try:
            with os.fdopen(fd, 'w') as output:
                json.dump(state, output, ensure_ascii=False, indent=2)
                output.write('\n')
            os.replace(temp, target)
        finally:
            if os.path.exists(temp):
                os.unlink(temp)
        print(json.dumps(result))


if __name__ == '__main__':
    main()
