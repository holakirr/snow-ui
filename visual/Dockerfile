# The image the visual regression tests run in: locally through
# visual/docker.sh, which reads the FROM line below (nothing builds this
# file), and in CI, where .github/workflows/build-check.yml names the same
# image for every job that runs a browser, the `visual` job among them. It
# is the official Playwright image of the Playwright version in bun.lock,
# pinned by the digest of its multi-platform index, so a re-pushed tag can't
# change the browser the baselines were taken with. The visual tests run
# the index's linux/arm64 variant (CI on an arm64 runner, docker.sh natively
# on Apple Silicon): the baselines are arm64 screenshots.
#
# When @playwright/test is bumped, update the tag and the digest together,
# here and in build-check.yml (scripts/workflows.test.ts, and so the build
# job, fails while they disagree), and regenerate the baselines:
#   docker buildx imagetools inspect mcr.microsoft.com/playwright:v<version>-noble
FROM mcr.microsoft.com/playwright:v1.65.1-noble@sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579
