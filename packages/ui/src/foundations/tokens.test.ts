import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { tokenScales } from '../utils/token-scales.generated'
import { twMerge } from '../utils/tw-merge'
import {
  blurs,
  colorGroups,
  colorTokens,
  deprecatedColors,
  focusRing,
  fontFeatureSettings,
  radii,
  shadows,
  textStyles,
} from './tokens'

// The DTCG tokens (packages/ui/tokens) are generated into
// src/styles/tokens.generated.css and ./tokens.generated.ts by
// `bun run tokens`; CI fails when the committed files are stale. These tests
// check the token files, and that the generated CSS and docs data agree.

const tokensDir = join(import.meta.dirname, '../../tokens')
const readJson = (file: string) =>
  JSON.parse(readFileSync(join(tokensDir, file), 'utf8'))

const css = readFileSync(
  join(import.meta.dirname, '../styles/tokens.generated.css'),
  'utf8',
)
const source = css.replace(/\/\*[\s\S]*?\*\//g, '')

const normalize = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
    .trim()
    .toLowerCase()

/** Body of the first `{ … }` block that follows `start` (braces matched). */
const blockAfter = (start: number) => {
  expect(start).toBeGreaterThanOrEqual(0)
  const open = source.indexOf('{', start)
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++
    if (source[i] === '}') depth--
    if (depth === 0) return source.slice(open + 1, i)
  }
  throw new Error('Unbalanced braces in tokens.generated.css')
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

const theme = declarations(blockAfter(source.indexOf('@theme static {')))
// The dark scope; `src/theme.test.ts` checks that the other scopes match it.
const dark = declarations(
  blockAfter(source.search(/\[data-theme="dark"\],\s*\.dark \{/)),
)

const themeNames = (prefix: string) =>
  [...theme.keys()].filter(
    (name) => name.startsWith(prefix) && !name.includes('--', 2),
  )

/** Flattens a DTCG group into `[id, token]` pairs. */
const flatten = (
  group: Record<string, unknown>,
  path: string[] = [],
): [string, Record<string, unknown>][] =>
  Object.entries(group).flatMap(([key, value]) => {
    if (key.startsWith('$') || typeof value !== 'object' || !value) return []
    const node = value as Record<string, unknown>
    return '$value' in node
      ? [[[...path, key].join('.'), node]]
      : flatten(node, [...path, key])
  })

describe('DTCG token files (packages/ui/tokens)', () => {
  const light = flatten(readJson('color.light.tokens.json'))
  const darkTokens = flatten(readJson('color.dark.tokens.json'))

  it('are listed by the resolver', () => {
    const resolver = readJson('snow-ui.resolver.json')
    const referenced = [
      ...Object.values(
        resolver.sets as Record<string, { sources: { $ref: string }[] }>,
      ).flatMap((set) => set.sources),
      ...Object.values(
        resolver.modifiers as Record<
          string,
          { contexts: Record<string, { $ref: string }[]> }
        >,
      ).flatMap((modifier) => Object.values(modifier.contexts).flat()),
    ].map(({ $ref }) => $ref)

    expect(referenced.sort()).toEqual(
      readdirSync(tokensDir)
        .filter((file) => file.endsWith('.tokens.json'))
        .sort(),
    )
  })

  it('declare the same colour tokens in the light and the dark mode', () => {
    expect(darkTokens.map(([id]) => id)).toEqual(light.map(([id]) => id))
  })

  it('give every Figma colour its Figma name', () => {
    for (const [id, token] of light) {
      const figma = (
        token.$extensions as Record<string, { figma?: string }> | undefined
      )?.['com.holakirr.snow-ui']?.figma
      // Library additions have no Figma name and say why in $description.
      if (!figma) expect(token.$description, id).toMatch(/addition|overlay/i)
    }
  })

  it('use sRGB colours and px dimensions', () => {
    const files = readdirSync(tokensDir).filter((file) =>
      file.endsWith('.tokens.json'),
    )
    const values = JSON.stringify(files.map(readJson))
    expect(values).not.toMatch(/"colorSpace":\s*"(?!srgb")/)
    expect(values).not.toMatch(/"unit":\s*"(?!px")/)
  })
})

describe('generated tokens (tokens.generated.css ↔ tokens.generated.ts)', () => {
  it.each(colorTokens)('--color-$name has its value in both modes', (token) => {
    const variable = `--color-${token.name}`
    const lightValue = theme.get(variable)

    expect(lightValue).toBe(normalize(token.light))
    expect(dark.get(variable) ?? lightValue).toBe(normalize(token.dark))
  })

  it('documents every colour token once', () => {
    const documented = [
      ...colorTokens.map(({ name }) => name),
      ...deprecatedColors.map(({ name }) => name),
    ].map((name) => `--color-${name}`)

    expect(themeNames('--color-').sort()).toEqual(documented.sort())
    for (const name of dark.keys()) {
      if (name.startsWith('--color-')) expect(documented).toContain(name)
    }
    expect(
      colorGroups
        .flatMap((group) => group.tokens.map(({ name }) => name))
        .sort(),
    ).toEqual(colorTokens.map(({ name }) => name).sort())
  })

  it.each(deprecatedColors)(
    '--color-$name is a deprecated alias of $use',
    ({ name, use }) => {
      expect(colorTokens.map((token) => token.name)).toContain(use)
      expect(theme.get(`--color-${name}`)).toBe(`var(--color-${use})`)
      expect(css).toMatch(
        new RegExp(
          `/\\* @deprecated Use ${use}; removed in the next major\\. \\*/\\s*--color-${name}:`,
        ),
      )
    },
  )

  it('resolves the color-mix() tokens to their $value in each mode', () => {
    const rgb = (hex: string) => {
      const long =
        hex.length === 4
          ? `#${[...hex.slice(1)].map((c) => c + c).join('')}`
          : hex
      return [1, 3, 5].map((i) => Number.parseInt(long.slice(i, i + 2), 16))
    }
    const resolved = (name: string, mode: 'light' | 'dark') => {
      const token = colorTokens.find((candidate) => candidate.name === name)
      return token?.resolved?.[mode] ?? token?.[mode] ?? ''
    }
    const formulas = colorTokens.filter(({ light }) =>
      light.startsWith('color-mix('),
    )

    expect(formulas.map(({ name }) => name)).toEqual([
      'primary-hover',
      'primary-hover-strong',
    ])
    for (const token of formulas) {
      const [, a, b, percent] =
        token.light.match(
          /^color-mix\(in srgb, var\(--color-([\w-]+)\), var\(--color-([\w-]+)\) (\d+)%\)$/,
        ) ?? []
      for (const mode of ['light', 'dark'] as const) {
        const p = Number(percent) / 100
        const mixed = rgb(resolved(a, mode)).map((c, i) =>
          Math.round(c * (1 - p) + rgb(resolved(b, mode))[i] * p),
        )
        expect(
          rgb(token.resolved?.[mode] ?? ''),
          `${token.name} ${mode}`,
        ).toEqual(mixed)
      }
    }
  })

  it('has the Figma text styles', () => {
    expect(themeNames('--text-').sort()).toEqual(
      textStyles.map(({ size }) => `--text-${size}`).sort(),
    )
    for (const { size, lineHeight, weights } of textStyles) {
      expect(theme.get(`--text-${size}`)).toBe(`${size / 16}rem`)
      expect(theme.get(`--text-${size}--line-height`)).toBe(
        `${lineHeight / 16}rem`,
      )
      expect(weights).toEqual([400, 600])
    }
    expect(theme.get('--font-sans')).toBe('inter, sans-serif')
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

  it('gives tailwind-merge every token scale', () => {
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

  it.each(colorTokens)(
    'tailwind-merge reads text-$name / bg-$name as colours',
    ({ name }) => {
      // A colour replaces another colour, never a text size.
      expect(twMerge(`text-14 text-black text-${name}`)).toBe(
        `text-14 text-${name}`,
      )
      expect(twMerge(`bg-white bg-${name}`)).toBe(`bg-${name}`)
    },
  )
})
