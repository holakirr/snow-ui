import { defineConfig } from '@playwright/test'
import config from '../apps/demo/playwright.config'
export default defineConfig({
  ...config,
  webServer: undefined,
  testDir: '../apps/demo/e2e',
  workers: 2,
  retries: 0,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [
    ['list'],
    [
      'json',
      { outputFile: `${process.cwd()}/test-results/production/demo.raw.json` },
    ],
  ],
  outputDir: '../test-results/production/demo-output',
  use: {
    ...config.use,
    baseURL: 'https://demo.snow-ui.holakirr.com',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
})
