import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

// The monorepo root: Bun hoists every dependency (and the workspace links to
// packages/*) into its node_modules, so Turbopack and output tracing must be
// allowed to read files there.
const monorepoRoot = fileURLToPath(new URL('../..', import.meta.url))

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
}

export default nextConfig
