# Braces security automation

The daily Codex heartbeat uses `python3 scripts/braces-security-check.py` from the
repository root. Python 3 with the standard library, `gh` authentication and network
access to npm/GitHub are required. File locking uses `fcntl` (macOS/Linux).
The handler only reads remote data and writes ignored local state; the heartbeat
agent performs the separately authorized dependency/PR workflow.

State is `.tmp/braces-security-state.json` regardless of the caller's working
directory. Updates are protected by an exclusive lock and atomic replacement.
Do not delete active state or run fixtures against it. The former temporary
handler used this same state path, so switching paths preserves in-flight work.

## Decisions

| Action | Heartbeat behavior |
|---|---|
| `WAIT_NO_PATCH`, `WAIT_PUBLICATION` | Stay quiet. Do not install anything. |
| `START_UPDATE` | Start the authorized update in the returned branch. |
| `RESUME_BRANCH` | Continue the reserved branch; do not start another. |
| `RESUME_PR` | Continue the returned PR; do not create a duplicate. |
| `VERIFY_MERGED` | Verify actual fixed versions, review and green CI before declaring completion. |
| `BLOCKED`, `OBSERVER_ERROR` | Notify only when `decision` is `NOTIFY`. |

`decision` controls user notification, not whether work should proceed:
`START_UPDATE` and resume actions deliberately use `DONT_NOTIFY`.
Before creating a PR, query the handler and GitHub again. The lock serializes
planning, not the whole update workflow. Never start concurrent updater agents.
If the advisory changes during an active update, the target version is refreshed
while keeping the reserved branch. Recheck manifests and every locked copy before
continuing checks or merging. A newer patch after the old branch has merged
reserves a new branch rather than verifying the older merge again.
Existing PRs use branches `codex/braces-security-X-Y-Z` or the explicit body marker
`[braces-security-remediation]`. PRs from forks and unrelated braces documentation
or automation PRs are excluded. Closed PRs block automatic replacement.

An update requires both a stable version published in npm and a compatible
`first_patched_version` from the official advisory. The current conservative
range parser supports `<= X.Y.Z`; changed or conflicting advisory formats cause
an observation error rather than an assumed fix. Source messages and credentials
are never printed. Repeated observation errors/blocks are deduplicated in state.
Malformed state is preserved and reported once using a separate `.observer-error`
marker; repairing state clears this marker. A missing handler must also be
reported as an observation fault;
they are not evidence that no patch exists.

## Tests

Run `bun run test:braces-security` (also part of `test:scripts` and Build Check).
The suite uses the Python standard library and simulated npm/GitHub responses,
including paginated PR data. CLI concurrency tests use temporary files; no real
network, dependency installation, PR creation or merge occurs.

Manual fixture mode requires both `--fixture PATH --state ISOLATED_PATH`.
The real default state is forbidden in fixture mode, and live mode disallows a
state override. Fictional versions/PRs in tests are not release evidence.
