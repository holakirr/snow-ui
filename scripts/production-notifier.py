# -*- coding: utf-8 -*-
"""Read-only release production observer; durable notification deduplication."""
import argparse, copy, fcntl, hashlib, io, json, os, re, subprocess, tempfile, zipfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / '.tmp' / 'production-notifications-state.json'
STARTED_AT = '2026-10-14T11:11:46Z'
REPO = 'holakirr/snow-ui'
FAILURES = {'failure', 'timed_out', 'startup_failure', 'action_required'}

class ObservationError(RuntimeError):
    def __init__(self, stage, category):
        super().__init__('GitHub data unavailable')
        self.diagnostic = {'stage': stage, 'category': category}


def github_request(arguments, stage, **options):
    try:
        result = subprocess.run(arguments, capture_output=True, timeout=90, **options)
    except subprocess.TimeoutExpired:
        raise ObservationError(stage, 'timeout') from None
    except FileNotFoundError:
        raise ObservationError(stage, 'cli-unavailable') from None
    if result.returncode:
        # Inspect locally, but return only fixed labels: stderr may contain secrets.
        stderr = result.stderr or ''
        if isinstance(stderr, bytes):
            stderr = stderr.decode('utf-8', errors='replace')
        stderr = stderr.lower()
        category = 'request-failed'
        if 'rate limit' in stderr:
            category = 'rate-limited'
        elif 'http 401' in stderr or 'http 403' in stderr or 'gh auth login' in stderr:
            category = 'access-denied'
        elif any(value in stderr for value in ('http 500', 'http 502', 'http 503', 'http 504')):
            category = 'github-unavailable'
        elif any(value in stderr for value in ('timeout', 'timed out', 'could not resolve', 'no such host', 'connection', 'tls handshake', 'error connecting')):
            category = 'network-error'
        raise ObservationError(stage, category)
    return result


def api(path):
    stage = 'release-list' if '/workflows/' in path else 'artifact-list' if '/artifacts?' in path else 'job-list'
    result = github_request(['gh', 'api', 'repos/'+REPO+path, '--paginate', '--slurp'], stage, text=True)
    try:
        return json.loads(result.stdout)
    except ValueError:
        raise ObservationError(stage, 'invalid-json') from None

def safe_text(text):
    text = str(text).split('\n')[0]
    for name in ('GH_TOKEN', 'GITHUB_TOKEN', 'SNOWUI_SITE_AUTOMATION_SECRET', 'SNOWUI_DEMO_AUTOMATION_SECRET'):
        if os.environ.get(name):
            text = text.replace(os.environ[name], '[redacted]')
    if re.search(r'(?i)(bearer|cookie|x-vercel-protection-bypass|authorization)\s*[:= ]', text):
        return 'Sensitive diagnostic omitted'
    text = re.sub(r'(?<![a-fA-F0-9])[a-fA-F0-9]{32,}(?![a-fA-F0-9])', '[redacted]', text)
    return text[:250]

def report_failures(data):
    found = []
    def visit(node):
        for spec in node.get('specs', []):
            for test in spec.get('tests', []):
                if test.get('status') == 'unexpected':
                    errors = [error.get('message', '') for result in test.get('results', []) for error in result.get('errors', [])]
                    found.append({'title': safe_text(spec.get('title', 'Unknown scenario')), 'message': safe_text(errors[0]) if errors else 'Failure details unavailable'})
        for suite in node.get('suites', []):
            visit(suite)
    visit(data)
    return found[:3]

def reports_from_zip(payload):
    # Read only bounded JSON members; never extract files or execute artifact data.
    if len(payload) > 20 * 1024 * 1024:
        raise RuntimeError('Production artifact too large')
    reports = {}
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            members = archive.infolist()
            if len(members) > 128:
                raise RuntimeError('Too many artifact members')
            for member in members:
                path = Path(member.filename)
                if path.name not in ('docs.json', 'demo.json') or member.is_dir():
                    continue
                if path.is_absolute() or '..' in path.parts or '\\' in member.filename:
                    raise RuntimeError('Unsafe report member')
                if (member.external_attr >> 16) & 0o170000 == 0o120000:
                    raise RuntimeError('Report symlink forbidden')
                name = path.stem
                if name in reports or member.file_size > 2 * 1024 * 1024:
                    raise RuntimeError('Duplicate or oversized report')
                with archive.open(member) as source:
                    data = source.read(2 * 1024 * 1024 + 1)
                if len(data) > 2 * 1024 * 1024:
                    raise RuntimeError('Oversized report')
                reports[name] = json.loads(data)
    except (zipfile.BadZipFile, ValueError, OSError) as error:
        raise RuntimeError('Unreadable production artifact') from error
    return reports


def events_from_github(state):
    runs = [run for page in api('/actions/workflows/release.yml/runs?branch=main&per_page=100') for run in page['workflow_runs']]
    events = []
    for run in runs:
        if max(run.get('updated_at', ''), run.get('run_started_at', '')) < state['startedAt']:
            continue
        attempt = run.get('run_attempt', 1)
        key = str(run['id'])+':'+str(attempt)
        if key in state.get('processedAttempts', {}) and run['status'] == 'completed':
            continue
        jobs = [job for page in api('/actions/runs/'+str(run['id'])+'/attempts/'+str(attempt)+'/jobs?per_page=100') for job in page['jobs']]
        prod = [job for job in jobs if job['name'] == 'production' or job['name'].startswith('production /')]
        for job in prod:
            event = dict(runId=run['id'], attempt=attempt, sha=run['head_sha'], url=run['html_url'], status=job['status'], conclusion=job['conclusion'], startedAt=job.get('started_at') or run.get('run_started_at'), steps=job.get('steps', []), reports={})
            if job['conclusion'] in FAILURES or job['conclusion'] == 'cancelled':
                # Reports are data only, never executable; no raw logs returned.
                artifacts = [artifact for page in api('/actions/runs/'+str(run['id'])+'/artifacts?per_page=100') for artifact in page['artifacts']]
                current_artifact = max(
                    (artifact for artifact in artifacts if artifact['name'] == 'production-results'
                     and not artifact.get('expired') and job.get('started_at')
                     and artifact.get('created_at', '') >= job['started_at']),
                    key=lambda artifact: artifact['created_at'], default=None,
                )
                if current_artifact:
                    artifact_id = current_artifact['id']
                    if type(artifact_id) is not int or artifact_id <= 0:
                        raise RuntimeError('Invalid artifact identity')
                    downloaded = github_request(
                        ['gh', 'api', 'repos/'+REPO+'/actions/artifacts/'+str(artifact_id)+'/zip'],
                        'artifact-download',
                    )
                    if downloaded.returncode != 0:
                        raise RuntimeError('Production artifact unavailable')
                    if downloaded.returncode == 0:
                        for name, data in reports_from_zip(downloaded.stdout).items():
                            if not isinstance(data, dict) or not isinstance(data.get('stats', {}), dict):
                                raise RuntimeError('Invalid production report structure')
                            for counter in ('expected', 'unexpected', 'skipped', 'flaky'):
                                value = data.get('stats', {}).get(counter, 0)
                                if type(value) is not int or value < 0:
                                    raise RuntimeError('Invalid production report counter')
                            event['reports'][name] = data.get('stats', {})
                            event.setdefault('failures', {})[name] = report_failures(data)
            events.append(event)
    return events, len(runs)

def diagnose(event):
    if event.get('conclusion') == 'cancelled':
        return 'interrupted', 'The running production check was cancelled; application correctness was not established.', 'Determine why the check was cancelled.'
    parts = []
    for name, stats in sorted(event.get('reports', {}).items()):
        failures = stats.get('unexpected', 0)
        skips = stats.get('skipped', 0)
        flaky = stats.get('flaky', 0)
        if failures or skips or flaky:
            parts.append(name+': failed='+str(failures)+', skipped='+str(skips)+', flaky='+str(flaky))
            for failure in event.get('failures', {}).get(name, [])[:3]:
                parts.append(safe_text(failure['title'])+': '+safe_text(failure['message']))
    if parts:
        return 'scenario-results', '; '.join(parts), 'Inspect the sanitized scenario reports and fix the failing checks.'
    steps = event.get('steps', [])
    failed = [safe_text(step['name']) for step in steps if step.get('conclusion') in FAILURES]
    if event.get('conclusion') == 'timed_out':
        return 'timeout', 'The production check exceeded its time limit.', 'Check deployment readiness and scenario duration.'
    step = failed[0] if failed else 'Unknown step'
    if step in ('Resolve expected production commits', 'Setup locked Bun', 'Run bun install --frozen-lockfile --ignore-scripts', 'Set up job', 'Initialize containers') or step.startswith('Run actions/'):
        return 'preparation:'+step, 'CI preparation failed at '+step+'.', 'Inspect the failed step; scenarios did not complete.'
    return 'readiness-or-scenarios:'+step, 'Production check failed at '+step+'; a precise cause is unavailable from the reports.', 'Inspect deployment SHA, Vercel access and sanitized scenario reports.'

def evaluate(state, events):
    state = copy.deepcopy(state)
    state.setdefault('processedAttempts', {})
    state.setdefault('notifiedFailures', {})
    notifications = []
    for event in events:
        if event.get('startedAt') and event['startedAt'] < state['startedAt']:
            continue
        if event['status'] != 'completed':
            continue
        key = str(event['runId'])+':'+str(event.get('attempt', 1))
        if key in state['processedAttempts']:
            continue
        state['processedAttempts'][key] = {'sha': event['sha'], 'conclusion': event['conclusion']}
        conclusion = event['conclusion']
        if conclusion not in FAILURES and conclusion != 'cancelled':
            continue
        if conclusion == 'cancelled' and not any(step.get('started_at') for step in event.get('steps', []) if step.get('conclusion') != 'skipped'):
            continue
        category, reason, action = diagnose(event)
        fingerprint = hashlib.sha256((event['sha']+'|'+category+'|'+reason).encode()).hexdigest()
        if fingerprint in state['notifiedFailures']:
            continue
        notice = {'runId': event['runId'], 'attempt': event.get('attempt', 1), 'sha': event['sha'], 'url': event['url'], 'category': category, 'reason': reason, 'action': action, 'test': bool(event.get('test'))}
        notifications.append(notice)
        state['notifiedFailures'][fingerprint] = {'runId': event['runId'], 'attempt': event.get('attempt', 1), 'sha': event['sha'], 'category': category}
    return state, notifications

def write_state(path, state):
    fd, temporary = tempfile.mkstemp(dir=path.parent)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as output:
            json.dump(state, output, indent=2)
            output.write('\n')
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--state', type=Path)
    parser.add_argument('--fixture', type=Path)
    args = parser.parse_args()
    state_path = (args.state or STATE).resolve()
    if args.fixture and (not args.state or state_path == STATE.resolve()):
        parser.error('Fixture mode requires isolated state')
    if not args.fixture and args.state:
        parser.error('Live mode requires the default state')
    state_path.parent.mkdir(parents=True, exist_ok=True)
    with open(str(state_path) + '.lock', 'a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        marker = Path(str(state_path) + '.observer-error')
        try:
            state = json.loads(state_path.read_text(encoding='utf-8')) if state_path.exists() else {
                'schemaVersion': 1, 'repository': REPO, 'startedAt': STARTED_AT,
                'processedAttempts': {}, 'notifiedFailures': {}, 'observerError': None,
            }
            if (not isinstance(state, dict) or not isinstance(state.get('startedAt'), str)
                or not isinstance(state.get('processedAttempts', {}), dict)
                or not isinstance(state.get('notifiedFailures', {}), dict)):
                raise ValueError('Invalid observer state')
        except (ValueError, OSError):
            result = {'decision': 'DONT_NOTIFY' if marker.exists() else 'NOTIFY',
                      'observerError': 'Observer state unavailable; production failure is not established.'}
            marker.write_text('state_unavailable\n')
            print(json.dumps(result))
            return
        if marker.exists():
            marker.unlink()
        try:
            if args.fixture:
                events = json.loads(args.fixture.read_text(encoding='utf-8'))
                if not all(event.get('test') is True for event in events):
                    raise ValueError('Test events must be explicitly labelled')
                count = None
            else:
                events, count = events_from_github(state)
            next_state, notifications = evaluate(state, events)
            next_state['observerError'] = None
            next_state.pop('observerDiagnostic', None)
            next_state['lastCheckedAt'] = datetime.now(timezone.utc).isoformat()
            next_state['lastAudit'] = {'releaseRunsRead': count, 'newOrUpdatedRuns': len(events), 'newProductionFailures': len(notifications)}
            write_state(state_path, next_state)
            print(json.dumps({'decision': 'NOTIFY' if notifications else 'DONT_NOTIFY', 'notifications': notifications, 'audit': next_state['lastAudit']}))
        except (RuntimeError, OSError, ValueError, KeyError, TypeError, AttributeError, subprocess.TimeoutExpired) as error:
            message = 'GitHub observation could not be completed; production failure is not established.'
            new = state.get('observerError') != message
            state['observerError'] = message
            diagnostic = error.diagnostic if isinstance(error, ObservationError) else {'stage': 'observation', 'category': 'invalid-data-or-storage'}
            state['observerDiagnostic'] = diagnostic
            try:
                write_state(state_path, state)
            except OSError:
                message = 'Observer state could not be saved; deduplication unavailable; production failure is not established.'
                new = True
            print(json.dumps({'decision': 'NOTIFY' if new else 'DONT_NOTIFY', 'observerError': message, 'observerDiagnostic': diagnostic}))


def cli():
    try:
        main()
    except OSError:
        # A read-only directory/full disk may also prevent creating the lock/marker.
        print(json.dumps({'decision': 'NOTIFY', 'observerError':
            'Observer storage unavailable; deduplication unavailable; production failure is not established.'}))


if __name__ == '__main__':
    cli()
