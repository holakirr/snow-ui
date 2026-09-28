import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { tokenScales } from '../utils/tw-merge'
import {
  blurs,
  colorTokens,
  deprecatedColors,
  focusRing,
  fontFeatureSettings,
  radii,
  shadows,
  textStyles,
} from './tokens'

const css = readFileSync(join(import.meta.dirname, '../index.css'), 'utf8')
const source = css.replace(/\/\*[\s\S]*?\*\//g, '')

const normalize = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
    .trim()
    .toLowerCase()

/** Body of the first `{ … }` block that follows `start` (braces matched). */
const blockAfter = (source: string, start: number) => {
  const open = source.indexOf('{', start)
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++
    if (source[i] === '}') depth--
    if (depth === 0) return source.slice(open + 1, i)
  }
  throw new Error('Unbalanced braces in index.css')
}

/** `--name: value;` declarations of a block without nested blocks. */
const declarations = (block: string) => {
  const map = new Map<string, string>()
  for (const statement of block.split(';')) {
    const match = statement.match(/^\s*(--[\w-]+)\s*:([\s\S]*)$/)
    if (match) map.set(match[1], normalize(match[2]))
  }
  return map
}

const theme = declarations(
  blockAfter(source, source.indexOf('@theme static {')),
)

// The dark scope; `src/theme.test.ts` checks that the other scopes match it.
const dark = declarations(
  blockAfter(source, source.indexOf('[data-theme="dark"] {')),
)

const themeNames = (prefix: string) =>
  [...theme.keys()].filter(
    (name) => name.startsWith(prefix) && !name.includes('--', 2),
  )

describe('design tokens (index.css ↔ foundations/tokens.ts)', () => {
  it.each(colorTokens)('--color-$name matches Figma in both modes', (token) => {
    const variable = `--color-${token.name}`
    const light = theme.get(variable)

    expect(light).toBe(normalize(token.light))
    expect(dark.get(variable) ?? light).toBe(normalize(token.dark))
  })

  it('documents every colour token', () => {
    const documented = [
      ...colorTokens.map(({ name }) => name),
      ...deprecatedColors.map(({ name }) => name),
    ].map((name) => `--color-${name}`)

    expect(themeNames('--color-').sort()).toEqual(documented.sort())
    for (const name of dark.keys()) {
      if (name.startsWith('--color-')) expect(documented).toContain(name)
    }
  })

  it.each(deprecatedColors)(
    '--color-$name is a deprecated alias of $use',
    ({ name, use }) => {
      expect(colorTokens.map((token) => token.name)).toContain(use)
      expect(theme.get(`--color-${name}`)).toBe(`var(--color-${use})`)
      expect(css).toMatch(
        new RegExp(
          `/\\* @deprecated → use ${use}, removed in next major \\*/\\s*--color-${name}:`,
        ),
      )
    },
  )

  it('has the Figma text styles', () => {
    expect(themeNames('--text-').sort()).toEqual(
      textStyles.map(({ size }) => `--text-${size}`).sort(),
    )
    for (const { size, lineHeight } of textStyles) {
      expect(theme.get(`--text-${size}`)).toBe(`${size / 16}rem`)
      expect(theme.get(`--text-${size}--line-height`)).toBe(
        `${lineHeight / 16}rem`,
      )
    }
    expect(theme.get('--font-sans--font-feature-settings')).toBe(
      normalize(fontFeatureSettings),
    )
  })

  it('has the Figma corner radius scale', () => {
    expect(themeNames('--radius-')).toEqual(
      radii.map(({ px }) => `--radius-${px}`),
    )
    for (const { px } of radii) {
      expect(theme.get(`--radius-${px}`)).toBe(`${px / 16}rem`)
    }
  })

  it('has the Figma effect styles', () => {
    const effects = [...shadows, focusRing, ...blurs]

    expect(
      [
        ...themeNames('--shadow-'),
        ...themeNames('--inset-shadow-'),
        ...themeNames('--ring-color-'),
        ...themeNames('--blur-'),
      ].sort(),
    ).toEqual(effects.map(({ variable }) => variable).sort())
    for (const { variable, value } of effects) {
      expect(theme.get(variable)).toBe(normalize(value))
    }
  })

  it('keeps the tailwind-merge scales in sync', () => {
    const suffix = (utility: string, prefix: string) =>
      utility.slice(prefix.length)

    expect(tokenScales.text).toEqual(
      textStyles.map(({ size }) => String(size)).sort((a, b) => +a - +b),
    )
    expect(tokenScales.radius).toEqual(radii.map(({ px }) => String(px)))
    expect(tokenScales.shadow).toEqual(
      themeNames('--shadow-').map((name) => suffix(name, '--shadow-')),
    )
    expect(tokenScales['inset-shadow']).toEqual(
      themeNames('--inset-shadow-').map((name) =>
        suffix(name, '--inset-shadow-'),
      ),
    )
    expect(tokenScales.blur).toEqual(
      themeNames('--blur-').map((name) => suffix(name, '--blur-')),
    )
  })
})
