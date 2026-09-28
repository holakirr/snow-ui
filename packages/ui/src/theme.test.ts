import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { compile } from 'tailwindcss'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Theme scopes, checked on the compiled CSS: which rules declare the tokens
// for `data-theme` / the OS preference, and which elements `dark:` matches.

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
  css = compiler.build(['dark:bg-black', 'bg-primary-hover'])
  rules = parse(css)
})

describe('theme scopes (compiled index.css)', () => {
  const light = () => rule(':root, [data-theme="light"]', ['@layer base'])
  const dark = () => rule('[data-theme="dark"]', ['@layer base'])
  const osDark = () =>
    rule(':root:not([data-theme="light"])', ['@layer base', DARK_QUERY])
  const theme = () => rule(':root, :host', ['@layer theme'])
  const tokens = (scope: Rule) =>
    new Map([...scope.declarations].filter(([name]) => name.startsWith('--')))

  it('declares light values on :root and on data-theme="light"', () => {
    expect(light().declarations.get('color-scheme')).toBe('light')
    const themeValues = theme().declarations
    for (const [name, value] of tokens(light())) {
      if (name.startsWith('--color-')) expect(value).toBe(themeValues.get(name))
    }
  })

  it('declares dark values on any data-theme="dark" element', () => {
    expect(dark().declarations.get('color-scheme')).toBe('dark')
    expect([...tokens(dark()).keys()]).toEqual([...tokens(light()).keys()])
    for (const [name, value] of tokens(dark())) {
      expect(value, name).not.toBe(tokens(light()).get(name))
    }
  })

  it('follows the OS preference unless <html data-theme="light">', () => {
    expect(osDark().declarations).toEqual(dark().declarations)
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
    expect(rule('[data-theme]', ['@layer base']).declarations).toEqual(derived)
  })

  describe('dark: variant', () => {
    const variant = (context: string[]) =>
      rules.find(
        (r) =>
          r.selector.startsWith('.dark\\:bg-black') &&
          r.context.join(' ') === context.join(' '),
      )?.selector ?? ''

    const html = document.documentElement

    /** Builds nested `data-theme` scopes and returns the innermost element. */
    const nest = (root: string | null, ...themes: (string | null)[]) => {
      if (root) html.setAttribute('data-theme', root)
      else html.removeAttribute('data-theme')
      let parent: HTMLElement = document.body
      parent.replaceChildren()
      for (const value of [...themes, null]) {
        const child = document.createElement('div')
        if (value) child.setAttribute('data-theme', value)
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
    ] as const)(
      '<html data-theme=%s> > %j (OS dark: %s) → dark: %s',
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
      html.removeAttribute('data-theme')
      document.body.replaceChildren()
    })
  })
})
