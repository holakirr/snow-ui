/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'
import { workspaceAliases } from './workspace-aliases.ts'

export default defineConfig({
  resolve: {
    alias: {
      ...workspaceAliases,
      // `figma`, the runtime module of the Code Connect templates, only
      // exists inside Figma: the template tests mock it (vi.doMock).
      figma: fileURLToPath(
        new URL('./src/code-connect/figma-runtime.ts', import.meta.url),
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // test/: checks of the built package (`test:dist`, vitest.dist.config.ts).
    exclude: [...configDefaults.exclude, 'test/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**/*.tsx'],
      exclude: ['**/*.test.tsx', '**/*.stories.tsx', '**/*.spec.tsx'],
    },
  },
})
