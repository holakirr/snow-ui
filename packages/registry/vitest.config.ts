import { defineConfig } from 'vitest/config'

// Unit tests of the registry generator and checks of its output, generated
// in memory from packages/ui/src (`bun run test`).
export default defineConfig({
  test: {
    name: '@holakirr/snow-ui-registry',
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Loading packages/ui/src into ts-morph takes a few seconds.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
