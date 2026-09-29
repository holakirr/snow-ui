import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { compile } from 'tailwindcss'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { animations } from './foundations/tokens'

// Theme scopes and reduced motion, checked on the compiled CSS: which rules
// declare the tokens for `data-theme`, the `light` / `dark` classes and the
// OS preferences, and which elements `dark:` matches.

const require = createRequire(import.meta.url)

const loadStylesheet = async (id: string, base: string) => {
  const path = id.startsWith('.')
    ? join(base, id)
    : require.resolve(id === 'tailwindcss' ? 'tailwindcss/index.css' : id, {
        paths: [base],
      })
  return { path, base: dirname(path), content: await readFile(path, 'utf8') }
}

interface Rule {
  selector: string
  /** Enclosing at-rules, outermost first: `@layer base`, `@media (…)`. */
  context: string[]
  declarations: Map<string, string>
}

const normalize = (value: string) =>
  value.replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')').trim()

/**
 * A minimal parser for Tailwind's output: rules with their at-rule context.
 * Tailwind follows a `color-mix()` with `var()` by a static fallback and puts
 * the original in a nested `@supports (color: color-mix(…))`; declarations of
 * a nested `@supports` count for the rule, as in current browsers.
 */
const parse = (css: string) => {
  const rules: Rule[] = []
  const stack: Rule[] = [{ selector: '', context: [], declarations: new Map() }]
  let buffer = ''
  let quote = ''
  const declare = () => {
    const match = buffer.match(/^\s*([\w-]+)\s*:([\s\S]*)$/)
    if (match) {
      stack[stack.length - 1].declarations.set(match[1], normalize(match[2]))
    }
    buffer = ''
  }

  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (quote) {
      buffer += char
      if (char === quote) quote = ''
    } else if (char === '"' || char === "'") {
      quote = char
      buffer += char
    } else if (char === ';') {
      declare()
    } else if (char === '{') {
      const parent = stack[stack.length - 1]
      if (
        parent.selector &&
        !parent.selector.startsWith('@') &&
        buffer.trim().startsWith('@supports')
      ) {
        stack.push(parent)
        buffer = ''
        continue
      }
      const rule = {
        selector: normalize(buffer),
        context: parent.selector.startsWith('@')
          ? [...parent.context, parent.selector]
          : parent.context,
        declarations: new Map(),
      }
      rules.push(rule)
      stack.push(rule)
      buffer = ''
    } else if (char === '}') {
      declare()
      stack.pop()
    } else {
      buffer += char
    }
  }
  return rules
}

const DARK_QUERY = '@media (prefers-color-scheme: dark)'
const MOTION_QUERY = '@media (prefers-reduced-motion: reduce)'

let rules: Rule[]
let css: string

const rule = (selector: string, context: string[]) => {
  const found = rules.filter(
    (candidate) =>
      candidate.selector === selector &&
      candidate.context.join(' ') === context.join(' '),
  )
  expect(found, `${context.join(' ')} ${selector}`).toHaveLength(1)
  return found[0]
}

beforeAll(async () => {
  const base = import.meta.dirname
  const source = await readFile(join(base, 'index.css'), 'utf8')
  const compiler = await compile(source, { base, loadStylesheet })
  css = compiler.build(['dark:bg-black', 'bg-primary-hover', 'text-secondary'])
  rules = parse(css)
})

describe('cascade layers (compiled index.css)', () => {
  it('puts every rule in a layer, so unlayered consumer CSS wins', () => {
    const topLevel = rules.filter((r) => r.context.length === 0)
    const unlayered = topLevel.filter(
      (r) => !/^@(layer|property|keyframes) /.test(r.selector),
    )
    expect(unlayered.map((r) => r.selector)).toEqual([])
    // Tailwind's layers only (declared in this order by
    // `@layer theme, base, components, utilities`).
    const layers = new Set(
      topLevel
        .filter((r) => r.selector.startsWith('@layer '))
        .map((r) => r.selector.slice('@layer '.length)),
    )
    expect(
      [...layers].filter(
        (layer) =>
          !['properties', 'theme', 'base', 'components', 'utilities'].includes(
            layer,
          ),
      ),
    ).toEqual([])
    expect(css).toMatch(/@layer theme, base, components, utilities;/)
  })

  it("puts react-day-picker's stylesheet in the components layer", () => {
    const rdp = rules.filter((r) => r.selector.startsWith('.rdp-'))
    expect(rdp.length).toBeGreaterThan(10)
    for (const r of rdp)
      expect(r.context[0], r.selector).toBe('@layer components')
    expect(
      rules
        .filter((r) => r.selector.startsWith('@keyframes rdp-'))
        .map((r) => r.context),
    ).toEqual(Array(6).fill(['@layer components']))
  })
})

describe('theme scopes (compiled index.css)', () => {
  const light = () =>
    rule(':root, [data-theme="light"], .light', ['@layer base'])
  const dark = () => rule('[data-theme="dark"], .dark', ['@layer base'])
  const osDark = () =>
    rule(':root:not([data-theme], .light, .dark)', ['@layer base', DARK_QUERY])
  const theme = () => rule(':root, :host', ['@layer theme'])
  const tokens = (scope: Rule) =>
    new Map([...scope.declarations].filter(([name]) => name.startsWith('--')))

  it('declares light values on :root, data-theme="light" and .light', () => {
    expect(light().declarations.get('color-scheme')).toBe('light')
    const themeValues = theme().declarations
    for (const [name, value] of tokens(light())) {
      if (name.startsWith('--color-')) expect(value).toBe(themeValues.get(name))
    }
  })

  it('declares dark values on any data-theme="dark" or .dark element', () => {
    expect(dark().declarations.get('color-scheme')).toBe('dark')
    expect([...tokens(dark()).keys()]).toEqual([...tokens(light()).keys()])
    for (const [name, value] of tokens(dark())) {
      expect(value, name).not.toBe(tokens(light()).get(name))
    }
  })

  it('follows the OS preference when <html> sets no mode', () => {
    expect(osDark().declarations).toEqual(dark().declarations)
    const html = document.documentElement
    const matches = (attribute: string | null, className: string) => {
      if (attribute) html.setAttribute('data-theme', attribute)
      else html.removeAttribute('data-theme')
      html.className = className
      return html.matches(osDark().selector)
    }
    expect(matches(null, '')).toBe(true)
    expect(matches(null, 'antialiased')).toBe(true)
    // next-themes (attribute "class") sets `light` / `dark` on <html>.
    expect(matches(null, 'light')).toBe(false)
    expect(matches(null, 'dark')).toBe(false)
    expect(matches('light', '')).toBe(false)
    expect(matches('dark', '')).toBe(false)
    html.removeAttribute('data-theme')
    html.className = ''
  })

  it('reads text-secondary on the element, so it follows theme scopes', () => {
    // `@theme inline`: the utility uses the token itself, not a copy
    // computed on <html> (which would keep the light value in a dark scope).
    const utility = rules.find((r) => r.selector === '.text-secondary')
    expect(utility?.declarations.get('color')).toBe(
      'var(--color-text-secondary)',
    )
    expect(dark().declarations.get('--color-text-secondary')).toBe(
      'rgb(255 255 255 / 0.7)',
    )
  })

  it('orders the scopes so that data-theme wins over :root', () => {
    // `:root` and `[data-theme="dark"]` have the same specificity: the dark
    // scope must come later. The OS block wins with `:root:not(…)`.
    const base = rules.filter((r) => r.context[0] === '@layer base')
    expect(base.indexOf(dark())).toBeGreaterThan(base.indexOf(light()))
  })

  it('re-declares the tokens built on switching tokens in every scope', () => {
    const themeValues = theme().declarations
    const switching = new Set(tokens(dark()).keys())
    const derived = new Map<string, string>()
    // Tokens that reference a switching token, directly or through another.
    let grew = true
    while (grew) {
      grew = false
      for (const [name, value] of themeValues) {
        const refs = [...value.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1])
        if (
          !derived.has(name) &&
          refs.some((ref) => switching.has(ref) || derived.has(ref))
        ) {
          derived.set(name, value)
          grew = true
        }
      }
    }

    expect(derived.size).toBeGreaterThan(0)
    expect(
      rule('[data-theme], .light, .dark', ['@layer base']).declarations,
    ).toEqual(derived)
  })

  describe('dark: variant', () => {
    const variant = (context: string[]) =>
      rules.find(
        (r) =>
          r.selector.startsWith('.dark\\:bg-black') &&
          r.context.join(' ') === context.join(' '),
      )?.selector ?? ''

    const html = document.documentElement

    /** Sets a scope: `dark` → data-theme="dark", `.dark` → class="dark". */
    const setScope = (element: Element, value: string | null) => {
      element.removeAttribute('data-theme')
      element.className = ''
      if (value?.startsWith('.')) element.className = value.slice(1)
      else if (value) element.setAttribute('data-theme', value)
    }

    /** Builds nested scopes and returns the innermost element. */
    const nest = (root: string | null, ...themes: (string | null)[]) => {
      setScope(html, root)
      let parent: HTMLElement = document.body
      parent.replaceChildren()
      for (const value of [...themes, null]) {
        const child = document.createElement('div')
        setScope(child, value)
        parent.appendChild(child)
        parent = child
      }
      parent.className = 'dark:bg-black'
      return parent
    }

    const isDark = (element: Element, osDark: boolean) =>
      element.matches(variant(['@layer utilities'])) ||
      (osDark && element.matches(variant(['@layer utilities', DARK_QUERY])))

    it('keeps the specificity of a single class', () => {
      for (const selector of [
        variant(['@layer utilities']),
        variant(['@layer utilities', DARK_QUERY]),
      ]) {
        expect(selector.replace(/:(where|not)\(.*$/, '')).toBe(
          '.dark\\:bg-black',
        )
        expect(selector).toMatch(/:not\(:where\(.*\)\)$/)
      }
    })

    it.each([
      // [<html> data-theme, nested scopes, OS dark, expected]
      [null, [], false, false],
      [null, [], true, true],
      ['light', [], true, false],
      ['dark', [], false, true],
      [null, ['dark'], false, true],
      ['light', ['dark'], false, true],
      ['light', ['dark'], true, true],
      ['dark', ['light'], false, false],
      ['dark', ['light'], true, false],
      [null, ['light'], true, false],
      [null, ['light', 'dark'], true, true],
      [null, ['dark', 'light'], false, false],
      ['light', ['dark', 'light'], false, false],
      // The `light` / `dark` classes (next-themes, shadcn/ui) work the same.
      ['.dark', [], false, true],
      ['.dark', [], true, true],
      ['.light', [], true, false],
      [null, ['.dark'], false, true],
      ['.light', ['.dark'], true, true],
      ['.dark', ['.light'], false, false],
      ['.dark', ['light'], true, false],
      ['dark', ['.light'], false, false],
      [null, ['.dark', '.light'], true, false],
      [null, ['.light', 'dark'], true, true],
    ] as const)(
      '<html %s> > %j (OS dark: %s) → dark: %s',
      (root, themes, osDark, expected) => {
        expect(isDark(nest(root, ...themes), osDark)).toBe(expected)
      },
    )

    it('matches the dark scope element itself, not a light one inside it', () => {
      const lightScope = nest(null, 'dark', 'light').parentElement as Element
      const darkScope = lightScope.parentElement as Element
      darkScope.className = 'dark:bg-black'
      lightScope.className = 'dark:bg-black'

      expect(isDark(darkScope, false)).toBe(true)
      expect(isDark(lightScope, false)).toBe(false)
      expect(isDark(lightScope, true)).toBe(false)
    })

    afterAll(() => {
      setScope(html, null)
      document.body.replaceChildren()
    })
  })
})

describe('reduced motion (compiled index.css)', () => {
  it('fades instead of sliding or zooming, and stops the Accordion', async () => {
    const theme = await readFile(join(import.meta.dirname, 'theme.css'), 'utf8')
    const block = theme.slice(theme.indexOf('@theme {'))
    const tokens = new Map(
      [
        ...block
          .slice(0, block.indexOf('}'))
          .matchAll(/^\s*(--animate-[\w-]+): ([\w-]+) /gm),
      ].map(([, name, keyframes]) => [name, keyframes]),
    )
    const reduced = rule(':root, :host', [
      '@layer base',
      MOTION_QUERY,
    ]).declarations

    // The Foundations "Motion" page lists every animation token.
    expect(animations.map(({ utility }) => `--${utility}`).sort()).toEqual(
      [...tokens.keys()].sort(),
    )
    for (const { utility, keyframes, reduced: to } of animations) {
      const name = `--${utility}`
      expect(tokens.get(name), name).toBe(keyframes)
      // Fades stay; the rest fade (`var(--animate-in)`) or stop (`none`).
      expect(reduced.get(name), name).toBe(
        to === keyframes ? undefined : to === 'none' ? 'none' : `var(--${to})`,
      )
    }
    expect(reduced.size).toBe(
      animations.filter(({ keyframes, reduced: to }) => to !== keyframes)
        .length,
    )
  })
})
