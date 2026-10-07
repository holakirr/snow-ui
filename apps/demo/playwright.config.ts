import { defineConfig, devices } from '@playwright/test'

// Smoke tests of the demo against the production build (`next start`).
// Build first: `bun run build` at the repository root (the packages), then
// `bun run --filter @holakirr/snow-ui-demo build`. Chromium only.

const PORT = Number(process.env.DEMO_PORT ?? 3100)
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The machine running `next start` is also running the browsers.
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
      ]
    : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    // A fixed viewport wide enough for the right sidebar (xl).
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    locale: 'en-US',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-axis',
      testMatch: 'pages.spec.ts',
      grep: /overview axis labels/,
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'bun run start',
    url: `${baseURL}/sign-in`,
    env: { PORT: String(PORT), HOSTNAME: '127.0.0.1' },
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
