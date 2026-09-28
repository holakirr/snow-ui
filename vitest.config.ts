import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// Root Vitest config, split into projects:
//   - the packages' own unit-test configs (jsdom), unchanged: every package
//     still runs its tests on its own with `bun run test`;
//   - `storybook`: every story in the shared Storybook is a test, rendered in
//     headless Chromium (Vitest browser mode + Playwright). A story passes when
//     it renders without errors and its `play` function (if any) passes; axe
//     checks run too and follow `parameters.a11y.test` (see .storybook/preview).
//
// `bun run test:storybook` runs only the `storybook` project.
export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      {
        plugins: [
          // Loads .storybook/main.ts (stories globs, addons, `viteFinal`) and
          // the project annotations from .storybook/preview.tsx.
          storybookTest({
            configDir: fileURLToPath(new URL('.storybook', import.meta.url)),
            storybookScript: 'bun run storybook --ci',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
