/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config'
import { workspaceAliases } from './workspace-aliases.ts'

export default defineConfig({
  resolve: { alias: workspaceAliases },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**/*.tsx'],
      exclude: ['**/*.test.tsx', '**/*.stories.tsx', '**/*.spec.tsx'],
    },
  },
})
