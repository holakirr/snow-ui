// The demo consumes the SnowUI packages like an installed dependency: through
// their `exports`, i.e. their built `dist/`. Fail early with a clear message
// when they haven't been built yet, instead of a "Module not found" deep in
// the Next.js output.
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packages = [
  '@holakirr/snow-ui',
  '@holakirr/snow-ui/theme.css',
  '@holakirr/snow-ui-icons',
  '@holakirr/snow-ui-charts',
  '@holakirr/snow-ui-charts/styles.css',
]

const missing = packages.filter((specifier) => {
  try {
    require.resolve(specifier)
    return false
  } catch {
    return true
  }
})

if (missing.length > 0) {
  console.error(
    `The demo needs the built SnowUI packages (missing: ${missing.join(', ')}).\n` +
      'Run `bun run build` at the repository root first.',
  )
  process.exit(1)
}
