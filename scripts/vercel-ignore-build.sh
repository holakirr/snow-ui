#!/usr/bin/env bash
# Vercel's "Ignored Build Step" for the site project (vercel.json
# `ignoreCommand`): exit 1 builds the commit, exit 0 skips it.
#
#   release              production: snow-ui.holakirr.com, the release
#                        workflow fast-forwards this branch to each published
#                        commit, so the Storybook, the /r registry and
#                        llms.txt always match npm `latest`
#   main                 preview, served at next.snow-ui.holakirr.com: what
#                        the next release will ship
#   changeset-release/*  skipped: the version PR only changes versions and
#                        changelogs, and its previews used up the deploy quota
#   dependabot/*         skipped: dependency bumps are merged in batches
#   anything else        preview (pull requests)
set -euo pipefail

ref="${VERCEL_GIT_COMMIT_REF:-}"
case "$ref" in
  changeset-release/* | dependabot/*)
    echo "Skipping the build of ${ref}."
    exit 0
    ;;
  *)
    echo "Building ${ref:-an unknown ref} (${VERCEL_ENV:-unknown environment})."
    exit 1
    ;;
esac
