import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

// Docs pages check: every docs page of the built Storybook (storybook-static/)
// is opened in headless Chromium and fails on an uncaught exception, a
// console error, Storybook's error display or a story (inline or in an
// iframe) whose render or play function fails. No screenshots, so it runs on
// the host (no Docker): `bun run test:docs` after `bun run build:storybook`.
// See CONTRIBUTING.md#docs-pages-in-the-browser.

const PORT = Number(process.env.DOCS_PORT ?? 6008)
const repoRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  testDir: '.',
  testMatch: 'pages.spec.ts',
  outputDir: '../test-results/docs-render',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry in CI, where a page can miss a timeout because the runner is
  // busy, so that such a hiccup doesn't hold up the release. But an error
  // that only shows up on some loads (stories racing each other on the page)
  // is one readers get too: a page that only passes on the retry is flaky,
  // and the CI job lists it (JSON report → warning and job summary) so it
  // gets fixed. Locally, no retries.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ['github'],
        ['list'],
        ['json', { outputFile: '../test-results/docs-render/results.json' }],
      ]
    : [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 720 },
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'UTC',
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    // The visual tests' dependency-free static server.
    command: `node visual/serve.mjs storybook-static ${PORT}`,
    cwd: repoRoot,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
