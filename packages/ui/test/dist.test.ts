import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { THEME_SOURCE } from '../scripts/build-css'

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
    ['@holakirr/snow-ui/theme-core.css', 'theme-core.css'],
    ['@holakirr/snow-ui/fonts.css', 'fonts.css'],
    ['@holakirr/snow-ui/fonts-italic.css', 'fonts-italic.css'],
    [
      '@holakirr/snow-ui/fonts/inter-latin-normal.woff2',
      'fonts/inter-latin-normal.woff2',
    ],
  ])('%s → dist/%s', (specifier, file) => {
    expect(require.resolve(specifier)).toBe(join(dist, file))
  })

  it("keeps the fields' shared invalid classes internal", async () => {
    const entry = await import(join(dist, 'index.js'))

    // Never released: the fields share it, apps use the utilities.
    expect(entry).not.toHaveProperty('invalidInputClasses')
    expect(entry).toHaveProperty('staticInputClasses')
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

  it('has the theme utilities no component uses, for your own markup', () => {
    // `scrollbar-snow`: outside forced-colors mode, the resting thumb colour
    // (`control-border` with more contrast), the 4px WebKit thumb in its 8px
    // gutter, 8px in `control-border` under the pointer and dragged, and the
    // standard thin scrollbar, `control-border` on a container hover.
    expect(read('index.css')).toMatch(
      /@media not all and \(forced-colors:\s*active\)\{\.scrollbar-snow\{--scrollbar-snow-more:var\(--contrast-more\) var\(--color-control-border\);--scrollbar-snow-thumb:var\(--scrollbar-snow-more,var\(--color-black-10\)\)\}@supports selector\(::-webkit-scrollbar\)\{\.scrollbar-snow::-webkit-scrollbar\{background:0 0;width:8px;height:8px\}\.scrollbar-snow::-webkit-scrollbar-thumb\{background:var\(--scrollbar-snow-thumb\) padding-box;border:2px solid #0000;/,
    )
    for (const state of ['hover', 'active']) {
      expect(read('index.css')).toContain(
        `.scrollbar-snow::-webkit-scrollbar-thumb:${state}{background-color:var(--color-control-border);border-width:0}`,
      )
    }
    expect(read('index.css')).toMatch(
      /@supports not selector\(::-webkit-scrollbar\)\{\.scrollbar-snow\{scrollbar-width:thin;scrollbar-color:var\(--scrollbar-snow-thumb\) transparent\}\.scrollbar-snow:hover\{scrollbar-color:var\(--color-control-border\) transparent\}\}/,
    )
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
    expect(theme()).toMatch(/\[data-theme="dark"\],\s*\.dark \{/)
    expect(theme()).toMatch(/@custom-variant dark \{/)
    expect(theme()).toMatch(/@utility focus-ring \{/)
    expect(theme()).toMatch(/@utility glass \{/)
    expect(theme()).toMatch(/@utility scrollbar-snow \{/)
    expect(theme()).toMatch(/@layer base \{/)
  })

  it("wraps react-day-picker's stylesheet in the components layer", () => {
    expect(theme()).toMatch(
      /\/\* react-day-picker\/style\.css \*\/\n@layer components \{\n {2}\/\* Variables declaration \*\/\n {2}\.rdp-root \{/,
    )
  })
})

/** Compiles a fixture stylesheet with the Tailwind CLI, as a consumer app. */
const compileFixture = (fixture: string) => {
  const out = join(mkdtempSync(join(tmpdir(), 'snow-ui-')), 'app.css')
  const cli = join(
    dirname(require.resolve('@tailwindcss/cli/package.json')),
    'dist/index.mjs',
  )
  execFileSync(
    process.execPath,
    [cli, '-i', join(import.meta.dirname, 'fixtures', fixture), '-o', out],
    { cwd: join(import.meta.dirname, 'fixtures'), stdio: 'pipe' },
  )
  return readFileSync(out, 'utf8')
}

/** The utilities of the precompiled index.css used by the built components. */
const componentUtilities = () => {
  // index.css also has the classes of stories and docs, which the package
  // doesn't ship.
  const js = files(dist)
    .filter((file) => file.endsWith('.js'))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
  return [...utilities(read('index.css'))].filter((name) =>
    new RegExp(
      `(^|[\\s"'\`])${name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}($|[\\s"'\`])`,
    ).test(js),
  )
}

describe.each([
  ['app.css', 'theme.css and an @source of dist'],
  ['app-no-source.css', 'only theme.css (its own @source)'],
])('a Tailwind v4 project using %s: %s', (fixture) => {
  let output: string

  beforeAll(() => {
    output = compileFixture(fixture)
  }, 60_000)

  it('generates every class the components use', () => {
    const inComponents = componentUtilities()
    const generated = utilities(output)

    expect(inComponents.length).toBeGreaterThan(300)
    expect(inComponents.filter((name) => !generated.has(name))).toEqual([])
    for (const name of ['focus-ring', 'glass-2', 'text-12', 'rounded-12']) {
      expect(generated).toContain(name)
    }
  })

  it('gets the tokens, the theme scopes and the layered calendar styles', () => {
    expect(output).toMatch(/--color-primary: #000;/)
    expect(output).toMatch(
      /\[data-theme="dark"\],\s*\.dark \{\s+color-scheme: dark;/,
    )
    expect(output).toMatch(/@layer components \{\s+\.rdp-root \{/)
  })
})

describe('theme.css', () => {
  it('adds the built components to the sources, relative to itself', () => {
    expect(read('theme.css')).toMatch(/^@source "\.\/\*\*\/\*\.js";$/m)
  })
})

describe('theme-core.css (the theme without the components)', () => {
  /** A theme stylesheet without its banner or `@source`. */
  const body = (file: string) =>
    read(file)
      .replace(/^\/\*![^\n]*\n/, '')
      .replace(`${THEME_SOURCE}\n`, '')

  it('is theme.css without its @source', () => {
    expect(read('theme.css')).toContain(THEME_SOURCE)
    expect(read('theme-core.css')).not.toMatch(/^@source /m)
    expect(body('theme-core.css')).toBe(body('theme.css'))
  })

  it("generates the project's classes only, with the whole theme", () => {
    const output = compileFixture('app-core.css')
    const full = compileFixture('app-no-source.css')
    const own = ['bg-black-4', 'focus-ring', 'rounded-12', 'text-14']
    // The theme scopes' selectors, not utilities.
    const scopes = ['dark', 'light']
    const generated = utilities(output)
    for (const name of own) expect(generated).toContain(name)
    expect(
      componentUtilities().filter(
        (name) =>
          /^-?[a-z]/.test(name) &&
          ![...own, ...scopes].includes(name) &&
          generated.has(name),
      ),
    ).toEqual([])
    expect(output).toMatch(/--color-primary: #000;/)
    expect(output).toMatch(
      /\[data-theme="dark"\],\s*\.dark \{\s+color-scheme: dark;/,
    )
    // A project that copies one component doesn't pay for all of them.
    expect(output.length).toBeLessThan(full.length / 2)
  }, 60_000)
})

describe('fonts.css and fonts-italic.css', () => {
  /** `[font-style, url, unicode-range]` of every @font-face. */
  const faces = (file: string) =>
    [...read(file).matchAll(/@font-face \{([^}]*)\}/g)].map(([, body]) => [
      body.match(/font-style: (\w+);/)?.[1] ?? '',
      body.match(/url\("([^"]+)"\)/)?.[1] ?? '',
      body.match(/unicode-range:\s*([^;]+);/)?.[1].replace(/\s+/g, ' ') ?? '',
    ])

  it.each([
    ['fonts.css', 'normal'],
    ['fonts-italic.css', 'italic'],
  ])('%s points at %s font files that exist', (file, style) => {
    expect(faces(file)).toHaveLength(9)
    for (const [fontStyle, url] of faces(file)) {
      expect(fontStyle).toBe(style)
      expect(existsSync(join(dist, url)), url).toBe(true)
    }
    expect(existsSync(join(dist, 'fonts/LICENSE.txt'))).toBe(true)
  })

  it('serves the arrows components render (↗ ↩) from the small ui-symbols subset', () => {
    const covering = (codepoint: number) =>
      faces('fonts.css')
        .filter(([, , ranges]) =>
          ranges.split(', ').some((range) => {
            const [start, end = start] = range.slice(2).split('-')
            return (
              codepoint >= Number.parseInt(start, 16) &&
              codepoint <= Number.parseInt(end, 16)
            )
          }),
        )
        .map(([, url]) => url)
    for (const codepoint of [0x2197, 0x21a9, 0x2318]) {
      expect(covering(codepoint)).toEqual([
        './fonts/inter-ui-symbols-normal.woff2',
      ])
    }
  })

  it('is not part of index.css', () => {
    expect(read('index.css')).not.toMatch(/@font-face/)
    expect(dirname(require.resolve('@holakirr/snow-ui/fonts.css'))).toBe(dist)
  })
})
