import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The stylesheets published next to `dist/index.css` (which the Tailwind CLI
 * builds from `src/index.css`, see the `build:css` script):
 *
 * - `dist/theme.css`: `src/theme.css` for projects that run Tailwind v4, as
 *   one file: its `@import`s are inlined (react-day-picker's stylesheet in
 *   its `layer()`), so it doesn't depend on how the consumer resolves them.
 *   Its Tailwind directives (`@theme`, `@utility`, `@apply`…) stay as they
 *   are, for the consumer's Tailwind to compile.
 * - `dist/fonts.css` and `dist/fonts/`: the self-hosted Inter.
 */

const require = createRequire(import.meta.url)
const IMPORT =
  /^@import\s+(["'])([^"']+)\1\s*(?:layer\(([\w.-]+)\))?\s*;[^\S\n]*\n?/gm

/** `file` with its `@import`s inlined, recursively. */
export function bundleCss(file: string): string {
  const css = readFileSync(file, 'utf8')
  return css.replace(IMPORT, (_, _quote, specifier: string, layer?: string) => {
    if (specifier === 'tailwindcss' || specifier.startsWith('tailwindcss/')) {
      throw new Error(
        `${file}: theme.css must not import Tailwind (the consumer does)`,
      )
    }
    const path = specifier.startsWith('.')
      ? join(dirname(file), specifier)
      : require.resolve(specifier, { paths: [dirname(file)] })
    const content = bundleCss(path).trim()
    const from = specifier.startsWith('.')
      ? relative(join(dirname(file), '..'), path)
      : specifier
    const body = layer
      ? `@layer ${layer} {\n${content.replace(/^(?=.)/gm, '  ')}\n}`
      : content
    return `/* ${from} */\n${body}\n`
  })
}

export function buildCss(packageDir: string) {
  const src = join(packageDir, 'src')
  const dist = join(packageDir, 'dist')
  mkdirSync(dist, { recursive: true })

  writeFileSync(
    join(dist, 'theme.css'),
    `/*! @holakirr/snow-ui theme.css | MIT License | react-day-picker/style.css: MIT License */\n${bundleCss(join(src, 'theme.css'))}`,
  )
  cpSync(join(src, 'fonts.css'), join(dist, 'fonts.css'))
  cpSync(join(src, 'fonts'), join(dist, 'fonts'), { recursive: true })
}

if (import.meta.main) {
  buildCss(fileURLToPath(new URL('..', import.meta.url)))
}
