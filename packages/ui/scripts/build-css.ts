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
 *   are, for the consumer's Tailwind to compile. It starts with an `@source`
 *   of the built components, relative to itself, so the consumer's Tailwind
 *   generates their classes wherever the package is installed (a hoisted
 *   node_modules, a monorepo, pnpm's store) without an `@source` of its own.
 * - `dist/theme-core.css`: the same theme without that `@source`, for
 *   projects that don't render the package's components: they copy them
 *   (the @snow-ui shadcn registry) or only use the tokens. Tailwind then
 *   generates the classes of their own code only; `@import … source(none)`
 *   can't switch off an `@source` inside an imported stylesheet.
 * - `dist/fonts.css`, `dist/fonts-italic.css` and `dist/fonts/`: the self-hosted
 *   Inter.
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

/** The package's own `@source` in `dist/theme.css` (see above). */
export const THEME_SOURCE = `/* The components' classes: the built modules next to this file. */
@source "./**/*.js";
`

/** What `dist/theme-core.css` is (its body is theme.css's, comments included). */
export const THEME_CORE_NOTE = `/*
 * theme-core.css: theme.css without the @source of the package's components,
 * for projects that copy them (the @snow-ui registry) or only use the tokens.
 */
`

/** The licence banner of a published theme stylesheet. */
const banner = (file: string) =>
  `/*! @holakirr/snow-ui ${file} | MIT License | react-day-picker/style.css: MIT License */\n`

export function buildCss(packageDir: string) {
  const src = join(packageDir, 'src')
  const dist = join(packageDir, 'dist')
  mkdirSync(dist, { recursive: true })

  const theme = bundleCss(join(src, 'theme.css'))
  writeFileSync(
    join(dist, 'theme.css'),
    `${banner('theme.css')}${THEME_SOURCE}\n${theme}`,
  )
  writeFileSync(
    join(dist, 'theme-core.css'),
    `${banner('theme-core.css')}${THEME_CORE_NOTE}\n${theme}`,
  )
  for (const file of ['fonts.css', 'fonts-italic.css']) {
    cpSync(join(src, file), join(dist, file))
  }
  cpSync(join(src, 'fonts'), join(dist, 'fonts'), { recursive: true })
}

if (import.meta.main) {
  buildCss(fileURLToPath(new URL('..', import.meta.url)))
}
