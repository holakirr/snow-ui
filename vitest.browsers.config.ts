import {
  defineConfig,
  type TestProjectInlineConfiguration,
} from 'vitest/config'
import { storybookProject } from './vitest.config'

// `bun run test:storybook:browsers`: every story in headless Firefox and
// WebKit (Safari's engine) through Playwright, in the light theme: render
// errors and failing play functions (keyboard, focus, pointer) fail the
// story. axe, the dark theme and coverage run in Chromium only (`bun run
// test:storybook`), so these projects stay out of the root config and of
// Storybook's test widget, which would otherwise need both browsers.
//
//   bunx playwright install firefox webkit
//   bun run test:storybook:browsers
//   bunx vitest run -c vitest.browsers.config.ts --project storybook-webkit
//
// In CI (the `storybook-browsers` job) a failing story is retried once:
// Firefox and WebKit are slower than Chromium on the 4-core runners, and the
// charts' play functions wait for their font with a fixed timeout. A story
// that only passes on the retry is reported as flaky in the log.
//
// WebKit runs at most two story files at a time: every file is an iframe in
// the one WebKit page, whose memory grows with each file, and with more files
// in parallel the page ran out of memory near the end of a full run (run
// 36617263390, "The webkit page crashed"). The CI job also splits WebKit in
// two shards, each in a fresh browser, and retries a shard whose page
// crashed; a retry doesn't help a crashed page, which fails the whole run.
const crossBrowser = (
  project: TestProjectInlineConfiguration,
  options: { maxWorkers?: number } = {},
): TestProjectInlineConfiguration => ({
  ...project,
  test: { ...project.test, ...options, retry: process.env.CI ? 1 : 0 },
})

export default defineConfig({
  test: {
    projects: [
      crossBrowser(storybookProject('storybook-firefox', 'light', 'firefox')),
      crossBrowser(storybookProject('storybook-webkit', 'light', 'webkit'), {
        maxWorkers: 2,
      }),
    ],
  },
})
