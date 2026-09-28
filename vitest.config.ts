import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import {
  defineConfig,
  type TestProjectInlineConfiguration,
} from 'vitest/config'

// Root Vitest config, split into projects:
//   - the packages' own unit-test configs (jsdom), unchanged: every package
//     still runs its tests on its own with `bun run test`;
//   - `storybook` and `storybook-dark`: every story in the shared Storybook is
//     a test, rendered in headless Chromium (Vitest browser mode + Playwright),
//     once in the light theme and once in the dark one. A story passes when it
//     renders without errors, its `play` function (if any) passes and axe finds
//     no violations (`parameters.a11y.test: 'error'`, see .storybook/preview).
//     Stories that pin a theme (`globals: { theme: 'dark' }`) keep it in both.
//
// `bun run test:storybook` runs both Storybook projects.

const configDir = fileURLToPath(new URL('.storybook', import.meta.url))

const storybookProject = (
  name: string,
  theme: 'light' | 'dark',
): TestProjectInlineConfiguration => ({
  plugins: [
    // Loads .storybook/main.ts (stories globs, addons, `viteFinal`) and the
    // project annotations from .storybook/preview.tsx.
    storybookTest({
      configDir,
      // The theme toolbar global (see .storybook/withTheme.tsx).
      initialGlobals: { theme },
      ...(theme === 'light' && { storybookScript: 'bun run storybook --ci' }),
    }),
  ],
  test: {
    name,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      // Storybook's default story viewport. addon-vitest tries to set it per
      // story but imports `@vitest/browser/context`, which Vitest 5 no longer
      // has, so without this every story rendered at Vitest's 414×896 and
      // desktop layouts (Recipes/Dashboard) overlapped.
      viewport: { width: 1200, height: 900 },
    },
  },
})

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      storybookProject('storybook', 'light'),
      storybookProject('storybook-dark', 'dark'),
    ],
  },
})
