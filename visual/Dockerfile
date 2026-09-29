# The image the visual regression tests run in: locally through
# visual/docker.sh and in CI in the `visual` job of
# .github/workflows/build-check.yml, which both read the FROM line below
# (nothing builds this file). It is the official Playwright image of the
# @playwright/test version in bun.lock, pinned by the digest of its
# multi-platform index, so a re-pushed tag can't change the browser the
# baselines were taken with.
#
# When @playwright/test is bumped, update the tag and the digest together
# (the build job fails while they disagree) and regenerate the baselines:
#   docker buildx imagetools inspect mcr.microsoft.com/playwright:v<version>-noble
FROM mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27
