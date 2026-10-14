import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: '../docs-render',
  testMatch: 'pages.spec.ts',
  fullyParallel: true,
  forbidOnly: true,
  workers: 2,
  retries: 0,
  timeout: 90000,
  reporter: [
    ['list'],
    [
      'json',
      { outputFile: `${process.cwd()}/test-results/production/docs.raw.json` },
    ],
  ],
  outputDir: '../test-results/production/docs-output',
  use: {
    baseURL: 'https://snow-ui.holakirr.com',
    browserName: 'chromium',
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
    colorScheme: 'light',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
})
