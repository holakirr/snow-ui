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
// `bun run test:storybook` runs both Storybook projects; `bun run
// test:coverage` runs the ui and charts unit tests and both Storybook
// projects with coverage (thresholds below).

const configDir = fileURLToPath(new URL('.storybook', import.meta.url))

/**
 * A Storybook test project: every story rendered in `browser`, in `theme`.
 * Also used by vitest.browsers.config.ts (Firefox and WebKit).
 */
export const storybookProject = (
  name: string,
  theme: 'light' | 'dark',
  browser: 'chromium' | 'firefox' | 'webkit' = 'chromium',
): TestProjectInlineConfiguration => ({
  plugins: [
    // Loads .storybook/main.ts (stories globs, addons, `viteFinal`) and the
    // project annotations from .storybook/preview.tsx.
    storybookTest({
      configDir,
      initialGlobals: {
        // The theme toolbar global (see .storybook/withTheme.tsx).
        theme,
        // axe is the Chromium projects' job (the gate); in the other
        // browsers the stories and their play functions run without it.
        ...(browser !== 'chromium' && { a11y: { manual: true } }),
      },
      ...(theme === 'light' &&
        browser === 'chromium' && {
          storybookScript: 'bun run storybook --ci',
        }),
    }),
  ],
  test: {
    name,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser }],
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
    // `bun run test:coverage`: the ui and charts unit tests (jsdom) and the
    // Storybook tests (Chromium) merged into one V8 report of the libraries'
    // source.
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'text', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
      // The ui and charts source. Vitest matches these globs against a
      // file's path relative to the first project root that contains it:
      // with `--project` filters (`test:coverage`) the roots are packages/ui
      // and packages/charts (the unit tests, listed first) and the
      // repository root, so their files are `src/…`; without a filter the
      // only root is the repository root and they are `packages/*/src/…`.
      // Each pattern alone reports 0 files in the other case.
      include: [
        'src/**/*.{ts,tsx}',
        'packages/ui/src/**/*.{ts,tsx}',
        'packages/charts/src/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.stories.{ts,tsx}',
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        '**/src/test/**',
        // Storybook-only pages, not part of the published package.
        '**/src/foundations/docs.tsx',
        '**/src/recipes/**',
        // Figma Code Connect templates and their helpers (not in the package).
        '**/*.figma.ts',
        '**/src/code-connect/**',
      ],
      // Measured with this config (Sept 2026, ui and charts): statements
      // 96.2%, branches 91.6%, functions 94.0%, lines 97.0%. The thresholds
      // sit about 2 points below, so a PR that drops coverage fails; raise
      // them as coverage grows, never lower them to make a PR pass.
      thresholds: {
        statements: 94,
        branches: 89,
        functions: 92,
        lines: 95,
      },
    },
  },
})
