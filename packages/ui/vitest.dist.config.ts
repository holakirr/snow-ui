import { defineConfig } from 'vitest/config'

// `bun run test:dist`: checks of the built package (dist/), run after
// `bun run build`. Not part of the unit tests, which run before the build.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
})
