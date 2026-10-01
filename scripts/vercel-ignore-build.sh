#!/usr/bin/env bash
# Vercel's "Ignored Build Step" (vercel.json `ignoreCommand`): exit 1 builds
# the commit, exit 0 skips it. The plan's daily deployment quota is shared by
# both projects, and pull-request previews used it up on busy days, so the
# production deploy of a release was rate-limited (5.2.0, 2026-10-01). Only
# the branches below build; open a `preview/<name>` branch for a preview.
#
# Site project (no argument):
#   release              production: snow-ui.holakirr.com, the release
#                        workflow fast-forwards this branch to each published
#                        commit, so the Storybook, the /r registry and
#                        llms.txt always match npm `latest`
#   main                 preview, served at next.snow-ui.holakirr.com: what
#                        the next release will ship
#   preview/*            preview, on request
#   anything else        skipped (pull requests, the version PR, Dependabot)
#
# Demo project (`demo` argument; apps/demo/vercel.json):
#   main                 production: demo.snow-ui.holakirr.com
#   preview/*            preview, on request
#   anything else        skipped
set -euo pipefail

project="${1:-site}"
ref="${VERCEL_GIT_COMMIT_REF:-}"
case "$project:$ref" in
  site:release | site:main | demo:main | *:preview/*)
    echo "Building ${ref} (${project}, ${VERCEL_ENV:-unknown environment})."
    exit 1
    ;;
  *)
    echo "Skipping the build of ${ref:-an unknown ref} (${project}): only release, main and preview/* build."
    exit 0
    ;;
esac
