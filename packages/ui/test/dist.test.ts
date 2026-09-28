import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

// Checks the published stylesheets in dist/ (run `bun run build` first; CI
// runs this after the build with `bun run test:dist`).

const packageDir = join(import.meta.dirname, '..')
const dist = join(packageDir, 'dist')
const require = createRequire(join(import.meta.dirname, 'fixtures/app.css'))
const read = (file: string) => readFileSync(join(dist, file), 'utf8')

/** Files under `dir`, recursively. */
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(dir, entry.name))
      : [join(dir, entry.name)],
  )

/** Class names of the utilities in a compiled stylesheet. */
const utilities = (css: string) => {
  const layer = css.slice(css.indexOf('@layer utilities'))
  return new Set(
    [...layer.matchAll(/\.((?:\\.|[\w-])+)/g)].map(([, name]) =>
      name.replace(/\\(.)/g, '$1'),
    ),
  )
}

beforeAll(() => {
  if (!existsSync(join(dist, 'index.js'))) {
    throw new Error('dist/ is missing: run `bun run build` first')
  }
})

describe('package exports', () => {
  it.each([
    ['@holakirr/snow-ui/index.css', 'index.css'],
    ['@holakirr/snow-ui/theme.css', 'theme.css'],
    ['@holakirr/snow-ui/fonts.css', 'fonts.css'],
    [
      '@holakirr/snow-ui/fonts/inter-latin-normal.woff2',
      'fonts/inter-latin-normal.woff2',
    ],
  ])('%s → dist/%s', (specifier, file) => {
    expect(require.resolve(specifier)).toBe(join(dist, file))
  })
})

/** Preludes of the top-level rules and at-rules of a stylesheet. */
const topLevel = (css: string) => {
  const preludes: string[] = []
  let depth = 0
  let prelude = ''
  let quote = ''
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (quote) {
      if (char === quote) quote = ''
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === '{') {
      if (depth++ === 0) preludes.push(prelude.trim())
    } else if (char === '}') {
      depth--
      prelude = ''
    } else if (char === ';' && depth === 0) {
      prelude = ''
    } else if (depth === 0) {
      prelude += char
    }
  }
  return preludes
}

describe('index.css (precompiled)', () => {
  it('has every rule in a cascade layer, so unlayered consumer CSS wins', () => {
    const preludes = topLevel(read('index.css'))
    // @property can't be layered; Tailwind emits the keyframes of its own
    // animations (spin, pulse) at the top level.
    expect(
      preludes.filter(
        (prelude) =>
          !/^@layer (properties|theme|base|components|utilities)$/.test(
            prelude,
          ) && !/^@(property|keyframes) /.test(prelude),
      ),
    ).toEqual([])
    for (const prelude of preludes) {
      if (prelude.startsWith('@keyframes')) {
        expect(prelude).toMatch(/^@keyframes (spin|ping|pulse|bounce)$/)
      }
    }
  })

  it("has react-day-picker's stylesheet in the components layer", () => {
    expect(read('index.css')).toMatch(/@layer components\{\.rdp-root\{/)
  })
})

describe('theme.css (for projects on Tailwind v4)', () => {
  const theme = () => read('theme.css')

  it('is one file without Tailwind or its preflight', () => {
    const code = theme().replace(/\/\*[\s\S]*?\*\//g, '')
    expect(code).not.toMatch(/@import/)
    expect(code).not.toMatch(/tailwindcss/i)
    // Preflight's box-sizing reset and Tailwind's internal variables.
    expect(code).not.toMatch(/--tw-|::after,\s*::before\s*\{\s*box-sizing/)
  })

  it('has the tokens, the dark variant, the utilities and the base rules', () => {
    expect(theme()).toMatch(/@theme static \{[\s\S]*--color-primary: #000;/)
    expect(theme()).toMatch(/\[data-theme="dark"\] \{/)
    expect(theme()).toMatch(/@custom-variant dark \{/)
    expect(theme()).toMatch(/@utility focus-ring \{/)
    expect(theme()).toMatch(/@utility glass \{/)
    expect(theme()).toMatch(/@layer base \{/)
  })

  it("wraps react-day-picker's stylesheet in the components layer", () => {
    expect(theme()).toMatch(
      /\/\* react-day-picker\/style\.css \*\/\n@layer components \{\n {2}\/\* Variables declaration \*\/\n {2}\.rdp-root \{/,
    )
  })
})

describe('a Tailwind v4 project using theme.css and @source dist', () => {
  let output: string

  beforeAll(() => {
    const out = join(mkdtempSync(join(tmpdir(), 'snow-ui-')), 'app.css')
    const cli = join(
      dirname(require.resolve('@tailwindcss/cli/package.json')),
      'dist/index.mjs',
    )
    execFileSync(
      process.execPath,
      [cli, '-i', join(import.meta.dirname, 'fixtures/app.css'), '-o', out],
      { cwd: join(import.meta.dirname, 'fixtures'), stdio: 'pipe' },
    )
    output = readFileSync(out, 'utf8')
  }, 60_000)

  it('generates every class the components use', () => {
    // The utilities of the precompiled index.css whose class names appear in
    // the built components (index.css also has the classes of stories and
    // docs, which the package doesn't ship).
    const js = files(dist)
      .filter((file) => file.endsWith('.js'))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n')
    const inComponents = [...utilities(read('index.css'))].filter((name) =>
      new RegExp(
        `(^|[\\s"'\`])${name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}($|[\\s"'\`])`,
      ).test(js),
    )
    const generated = utilities(output)

    expect(inComponents.length).toBeGreaterThan(300)
    expect(inComponents.filter((name) => !generated.has(name))).toEqual([])
    for (const name of ['focus-ring', 'glass-2', 'text-12', 'rounded-12']) {
      expect(generated).toContain(name)
    }
  })

  it('gets the tokens, the theme scopes and the layered calendar styles', () => {
    expect(output).toMatch(/--color-primary: #000;/)
    expect(output).toMatch(/\[data-theme="dark"\] \{\s+color-scheme: dark;/)
    expect(output).toMatch(/@layer components \{\s+\.rdp-root \{/)
  })
})

describe('fonts.css', () => {
  it('points at font files that exist', () => {
    const urls = [...read('fonts.css').matchAll(/url\("([^"]+)"\)/g)].map(
      ([, url]) => url,
    )
    expect(urls.length).toBe(16)
    for (const url of urls) {
      expect(existsSync(join(dist, url)), url).toBe(true)
    }
    expect(existsSync(join(dist, 'fonts/LICENSE.txt'))).toBe(true)
  })

  it('is not part of index.css', () => {
    expect(read('index.css')).not.toMatch(/@font-face/)
    expect(dirname(require.resolve('@holakirr/snow-ui/fonts.css'))).toBe(dist)
  })
})
