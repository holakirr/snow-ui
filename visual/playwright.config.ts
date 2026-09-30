import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

// Visual regression tests: every story of the built Storybook
// (storybook-static/) is screenshotted in the light and the dark theme and
// compared with the committed baselines in visual/__screenshots__.
//
// Baselines are linux/arm64 screenshots taken in the official Playwright
// Docker image (natively on Apple Silicon, on an arm64 runner in CI), so fonts
// and anti-aliasing are identical locally and in CI. Run the suite through
// Docker: `bun run visual` (compare) / `bun run visual:update` (write
// baselines). See CONTRIBUTING.md#visual-regression-tests.

if (process.platform !== 'linux' && !process.env.VISUAL_ALLOW_HOST) {
  throw new Error(
    'Visual tests only run in the Playwright Docker image (baselines are Linux screenshots). ' +
      'Use `bun run visual` / `bun run visual:update`, or set VISUAL_ALLOW_HOST=1 ' +
      'together with VISUAL_SNAPSHOT_DIR=<throwaway dir> to try the suite on the host.',
  )
}

const PORT = Number(process.env.VISUAL_PORT ?? 6007)
const repoRoot = fileURLToPath(new URL('..', import.meta.url))
// Optional override (relative to the working directory), e.g. a throwaway
// directory to try the suite without touching the committed baselines.
const snapshotDir = process.env.VISUAL_SNAPSHOT_DIR
  ? resolve(process.env.VISUAL_SNAPSHOT_DIR)
  : undefined

export default defineConfig({
  testDir: '.',
  testMatch: 'stories.spec.ts',
  outputDir: '../test-results/visual',
  // `{arg}` is `<story id>--<theme>`; baselines are only ever Linux
  // screenshots, so the path carries no platform/browser suffix.
  snapshotPathTemplate: snapshotDir
    ? `${snapshotDir}/{arg}{ext}`
    : '{testDir}/__screenshots__/{arg}{ext}',
  // Never write missing baselines as a side effect of a comparison run:
  // `bun run visual:update` passes --update-snapshots explicitly.
  updateSnapshots: 'none',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ['github'],
        ['list'],
        ['html', { outputFolder: '../playwright-report', open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: '../playwright-report', open: 'never' }],
      ],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      // Per-pixel colour tolerance (0..1, Playwright's default is 0.2) and
      // how many pixels may differ. Docker makes rendering deterministic, so
      // both stay small: anything bigger than anti-aliasing noise fails.
      threshold: 0.1,
      maxDiffPixels: 20,
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    // A dependency-free static server for the built Storybook.
    command: `node visual/serve.mjs storybook-static ${PORT}`,
    cwd: repoRoot,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
