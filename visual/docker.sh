#!/usr/bin/env bash
# Runs the visual regression suite (visual/stories.spec.ts) inside the
# official Playwright Docker image pinned in visual/Dockerfile, in its
# linux/arm64 variant like CI, so screenshots match the committed baselines
# and CI byte for byte, whatever the host OS.
#
#   bun run visual                      # compare with visual/__screenshots__
#   bun run visual:update               # write/refresh baselines
#   bun run visual -g "Button"          # extra args go to `playwright test`
#
# Environment:
#   VISUAL_SKIP_BUILD=1       reuse the existing storybook-static/ build
#   VISUAL_SNAPSHOT_DIR=path  baselines directory (default visual/__screenshots__),
#                             relative to the repository root
#   VISUAL_DOCKER_PLATFORM    image platform (default linux/arm64, what CI runs
#                             and the baselines are taken on; native on Apple
#                             Silicon and arm64 Linux, emulated on x86-64 hosts,
#                             where linux/amd64 is faster but may differ from
#                             the baselines by a few pixels)
#   VISUAL_DOCKER_CPUS        CPUs the container may use (default: half the
#                             host's, at most 6); Playwright gets as many workers
#                             unless you pass --workers yourself
#   VISUAL_DOCKER_MEMORY      the container's memory limit (default 4g)
#
# One run at a time per machine: a second run (another terminal, another
# worktree, an agent) waits for the first. Containers of runs that were killed
# before they could clean up are stopped when the next run starts.
#
# Only the pure-JS @playwright/test package from the host's node_modules is
# used in the container (browsers ship with the image); Storybook is built on
# the host, where the native build dependencies are installed.
set -euo pipefail

cd "$(dirname "$0")/.."

mode=compare
if [[ "${1:-}" == "--update" ]]; then
  mode=update
  shift
fi

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  echo "Docker is not available: install/start Docker and retry." >&2
  exit 1
fi

pkg_json=node_modules/@playwright/test/package.json
if [[ ! -f "$pkg_json" ]]; then
  echo "@playwright/test is not installed: run \`bun install\` first." >&2
  exit 1
fi
version=$(sed -n 's/^  "version": "\(.*\)",$/\1/p' "$pkg_json")
# The image pinned by digest in visual/Dockerfile, as in CI.
image=$(sed -n 's/^FROM //p' visual/Dockerfile)
if [[ "$image" != "mcr.microsoft.com/playwright:v${version}-noble@sha256:"* ]]; then
  echo "visual/Dockerfile pins '${image}', but @playwright/test is ${version}:" >&2
  echo "pin mcr.microsoft.com/playwright:v${version}-noble by digest there and in" >&2
  echo ".github/workflows/build-check.yml (see visual/Dockerfile)." >&2
  exit 1
fi
platform="${VISUAL_DOCKER_PLATFORM:-linux/arm64}"
snapshot_dir="${VISUAL_SNAPSHOT_DIR:-visual/__screenshots__}"
if [[ "$snapshot_dir" == /* ]]; then
  echo "VISUAL_SNAPSHOT_DIR must be relative to the repository root (only the repository is mounted into the container)." >&2
  exit 1
fi

if [[ "$mode" == compare ]] && ! compgen -G "${snapshot_dir}/*.png" >/dev/null; then
  echo "No baselines in ${snapshot_dir}/ yet, nothing to compare."
  echo "Generate them with \`bun run visual:update\` and commit them."
  exit 0
fi

if [[ -z "${VISUAL_SKIP_BUILD:-}" ]]; then
  bun run build:storybook
fi

host_cpus=$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)
default_cpus=$((host_cpus / 2))
((default_cpus > 6)) && default_cpus=6
((default_cpus < 1)) && default_cpus=1
cpus="${VISUAL_DOCKER_CPUS:-$default_cpus}"
memory="${VISUAL_DOCKER_MEMORY:-4g}"

args=(test -c visual/playwright.config.ts)
if [[ "$mode" == update ]]; then
  args+=(--update-snapshots=changed)
fi
# Inside the container Node sees every CPU of the Docker VM, so Playwright's
# default (half of them) would oversubscribe the --cpus quota.
if [[ " $* " != *" --workers"* && " $* " != *" -j"* ]]; then
  args+=("--workers=${cpus%.*}")
fi
args+=("$@")

# One visual run at a time per user: every terminal and agent on a
# development machine runs as the same user, and they share one Docker. The
# lock is a symlink whose target is the owner's pid, created atomically with
# `ln -s` (no window in which a lock exists without an owner, and no flock,
# which macOS lacks). It lives in a directory only this user can write
# ($XDG_RUNTIME_DIR, else ~/.cache), not in /tmp, where another user could
# create it first and block every run.
label=org.snow-ui.visual
lock_dir="${XDG_RUNTIME_DIR:-$HOME/.cache}/snow-ui"
mkdir -p "$lock_dir"
chmod 700 "$lock_dir"
lock="$lock_dir/visual.lock"
container=
waiting=

alive() { [[ -n "$1" ]] && ps -p "$1" >/dev/null 2>&1; }

# A lock whose owner is gone (killed with -9, crashed) is removed under a
# second, short-lived lock, and only if it still names that owner: two runs
# that find it stale at once can't remove each other's new lock.
break_stale_lock() {
  local dead=$1 breaker
  if ln -s "$$" "$lock.break" 2>/dev/null; then
    if [[ "$(readlink "$lock" 2>/dev/null || true)" == "$dead" ]]; then
      rm -f "$lock"
    fi
    rm -f "$lock.break"
  else
    breaker=$(readlink "$lock.break" 2>/dev/null || true)
    if [[ -n "$breaker" ]] && ! alive "$breaker"; then
      rm -f "$lock.break"
    fi
  fi
}

until ln -s "$$" "$lock" 2>/dev/null; do
  owner=$(readlink "$lock" 2>/dev/null || true)
  if [[ -n "$owner" ]] && ! alive "$owner"; then
    break_stale_lock "$owner"
    continue
  fi
  if [[ -z "$waiting" ]]; then
    echo "Another visual run is in progress (pid ${owner:-?}); waiting for it to finish..."
    waiting=1
  fi
  sleep 2
done

cleanup() {
  if [[ -n "$container" ]]; then
    docker stop --time 5 "$container" >/dev/null 2>&1 || true
  fi
  # Only our own lock (a stale-lock breaker may already have replaced it).
  if [[ "$(readlink "$lock" 2>/dev/null || true)" == "$$" ]]; then
    rm -f "$lock"
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# Containers left over from a killed run (its CLI died, the container kept
# going) are stopped. Each container carries the pid of the script that
# started it: only those whose script is gone are stopped, never the one of a
# live run (of another user, or one that didn't see this lock). `ps -p`, not
# `kill -0`, which fails for another user's live process. A container without
# that label was started by an older copy of this script (another branch):
# its owner is unknown, so it is left alone.
while read -r id owner; do
  [[ -n "$id" && -n "$owner" ]] || continue
  if alive "$owner"; then
    continue
  fi
  echo "Stopping visual test container ${id}, left over from a killed run (pid ${owner})..."
  docker stop --time 5 "$id" >/dev/null || true
done < <(docker ps --filter "label=$label" --format "{{.ID}} {{.Label \"$label.pid\"}}")

container="snow-ui-visual-$$"
echo "Running visual tests in ${image} (${platform}, ${cpus} CPUs, ${memory})"
# --init/--ipc=host: recommended for Chromium in Docker. The host user's
# uid/gid keep written files (snapshots, reports) owned by you on Linux hosts.
# Started in the background and awaited, so a TERM/INT to this script runs the
# cleanup (stopping the container) right away instead of after the run.
docker run --rm --init --ipc=host \
  --name "$container" \
  --label "$label" \
  --label "$label.pid=$$" \
  --platform "$platform" \
  --cpus "$cpus" \
  --memory "$memory" \
  --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -e CI \
  -e VISUAL_SNAPSHOT_DIR \
  -v "$PWD":/work \
  -w /work \
  "$image" \
  node node_modules/@playwright/test/cli.js "${args[@]}" &
wait $!
