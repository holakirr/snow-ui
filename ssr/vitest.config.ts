import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
// The ui and icons packages from source, as in Storybook.
import { workspaceAliases } from '../packages/charts/workspace-aliases.ts'

// `bun run test:ssr`: every ui story rendered on the server, then hydrated
// in the browser. Two projects, run one after the other by the script:
//   - `ssr-render` (Node, no DOM): renderToString of each story, written to
//     .tmp/ssr/stories.json;
//   - `ssr-hydrate` (headless Chromium): hydrateRoot of each story on its
//     server HTML; hydration mismatches and React errors fail the story.
// See CONTRIBUTING.md#server-rendering-and-hydration.
export default defineConfig({
  // The repository root: the paths below and in the tests are relative to it.
  root: fileURLToPath(new URL('..', import.meta.url)),
  resolve: { alias: { ...workspaceAliases } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'ssr-render',
          environment: 'node',
          include: ['ssr/render.test.tsx'],
        },
      },
      {
        extends: true,
        test: {
          name: 'ssr-hydrate',
          include: ['ssr/hydrate.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            viewport: { width: 1200, height: 900 },
          },
        },
      },
    ],
  },
})
