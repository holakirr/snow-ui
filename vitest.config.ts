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
// test:coverage` runs the ui unit tests and both Storybook projects with
// coverage (thresholds below).

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
    // `bun run test:coverage`: the ui unit tests (jsdom) and the Storybook
    // tests (Chromium) merged into one V8 report of the library source.
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'text', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
      // The ui source. Vitest matches these globs against a file's path
      // relative to the first project root that contains it: with `--project`
      // filters (`test:coverage`) the roots are packages/ui (the ui unit
      // tests, listed first) and the repository root, so ui files are
      // `src/…`; without a filter the only root is the repository root and
      // they are `packages/ui/src/…`. Each pattern alone reports 0 files in
      // the other case.
      include: ['src/**/*.{ts,tsx}', 'packages/ui/src/**/*.{ts,tsx}'],
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
      // Measured with this config (Sept 2026): statements 93.4%, branches
      // 87.9%, functions 88.0%, lines 94.3%. The thresholds sit about 2 points
      // below, so a PR that drops coverage fails; raise them as coverage
      // grows, never lower them to make a PR pass.
      thresholds: {
        statements: 91,
        branches: 85,
        functions: 86,
        lines: 92,
      },
    },
  },
})
