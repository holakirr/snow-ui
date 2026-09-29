/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config'
import { workspaceAliases } from './workspace-aliases.ts'

export default defineConfig({
  resolve: {
    alias: { ...workspaceAliases },
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
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.tsx', '**/*.stories.tsx', 'src/test/**'],
    },
  },
})
