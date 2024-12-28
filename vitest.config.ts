/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**/*.tsx'],
      exclude: ['**/*.test.tsx', '**/*.stories.tsx', '**/*.spec.tsx'],
    },
  },
})
