#!/usr/bin/env bash
# Runs the visual regression suite (visual/stories.spec.ts) inside the
# official Playwright Docker image pinned in visual/Dockerfile, so
# screenshots match the committed Linux baselines and CI byte for byte,
# whatever the host OS.
#
#   bun run visual                      # compare with visual/__screenshots__
#   bun run visual:update               # write/refresh baselines
#   bun run visual -g "Button"          # extra args go to `playwright test`
#
# Environment:
#   VISUAL_SKIP_BUILD=1       reuse the existing storybook-static/ build
#   VISUAL_SNAPSHOT_DIR=path  baselines directory (default visual/__screenshots__),
#                             relative to the repository root
#   VISUAL_DOCKER_PLATFORM    image platform (default linux/amd64, what CI runs;
#                             Apple Silicon runs it through Rosetta/QEMU)
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
platform="${VISUAL_DOCKER_PLATFORM:-linux/amd64}"
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

args=(test -c visual/playwright.config.ts)
if [[ "$mode" == update ]]; then
  args+=(--update-snapshots=changed)
fi
args+=("$@")

echo "Running visual tests in ${image} (${platform})"
# --init/--ipc=host: recommended for Chromium in Docker. The host user's
# uid/gid keep written files (snapshots, reports) owned by you on Linux hosts.
exec docker run --rm --init --ipc=host \
  --platform "$platform" \
  --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -e CI \
  -e VISUAL_SNAPSHOT_DIR \
  -v "$PWD":/work \
  -w /work \
  "$image" \
  node node_modules/@playwright/test/cli.js "${args[@]}"
