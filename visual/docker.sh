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
  echo "pin mcr.microsoft.com/playwright:v${version}-noble by digest there (see the file)." >&2
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

# One visual run per machine. The lock is a directory holding the owner's pid;
# a lock whose owner is gone is taken over.
label=org.snow-ui.visual
lock="${TMPDIR:-/tmp}/snow-ui-visual.lock"
container=
waiting=
until mkdir "$lock" 2>/dev/null; do
  owner=$(cat "$lock/pid" 2>/dev/null || true)
  if [[ -n "$owner" ]] && ! kill -0 "$owner" 2>/dev/null; then
    rm -rf "$lock"
    continue
  fi
  if [[ -z "$waiting" ]]; then
    echo "Another visual run is in progress (pid ${owner:-?}); waiting for it to finish..."
    waiting=1
  fi
  sleep 5
done
echo $$ >"$lock/pid"

cleanup() {
  if [[ -n "$container" ]]; then
    docker stop --time 5 "$container" >/dev/null 2>&1 || true
  fi
  rm -rf "$lock"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# Holding the lock, any container still labelled as a visual run is left over
# from a run that was killed (its CLI died, the container kept going).
stale=$(docker ps -q --filter "label=$label")
if [[ -n "$stale" ]]; then
  echo "Stopping visual test containers left over from a killed run..."
  # shellcheck disable=SC2086
  docker stop --time 5 $stale >/dev/null
fi

container="snow-ui-visual-$$"
echo "Running visual tests in ${image} (${platform}, ${cpus} CPUs, ${memory})"
# --init/--ipc=host: recommended for Chromium in Docker. The host user's
# uid/gid keep written files (snapshots, reports) owned by you on Linux hosts.
# Started in the background and awaited, so a TERM/INT to this script runs the
# cleanup (stopping the container) right away instead of after the run.
docker run --rm --init --ipc=host \
  --name "$container" \
  --label "$label" \
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
