import { defineConfig } from 'vitest/config'

// `bun run test:scripts`: unit tests of the repository scripts (the release
// step's decisions). Part of `bun run test`.
export default defineConfig({
  test: {
    name: 'scripts',
    root: import.meta.dirname,
    include: ['*.test.ts'],
    environment: 'node',
  },
})
