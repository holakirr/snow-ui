import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

// Checks the built package in dist/ (run `bun run build` first; CI runs this
// after the build with `bun run test:dist`).

const packageDir = join(import.meta.dirname, '..')
const dist = join(packageDir, 'dist')
const require = createRequire(join(packageDir, 'package.json'))
const read = (file: string) => readFileSync(join(dist, file), 'utf8')

beforeAll(() => {
  if (!existsSync(join(dist, 'index.js'))) {
    throw new Error('dist/ is missing: run `bun run build` first')
  }
})

describe('package exports', () => {
  it.each([
    ['@holakirr/snow-ui-charts', 'index.cjs'],
    ['@holakirr/snow-ui-charts/recharts', 'recharts.cjs'],
    ['@holakirr/snow-ui-charts/styles.css', 'styles.css'],
  ])('%s → dist/%s', (specifier, file) => {
    expect(require.resolve(specifier)).toBe(join(dist, file))
  })

  it('works with require() and import()', async () => {
    const cjs = require('@holakirr/snow-ui-charts')
    const esm = await import('@holakirr/snow-ui-charts')
    for (const name of [
      'ChartContainer',
      'ChartTooltip',
      'ChartTooltipContent',
      'ChartLegend',
      'ChartLegendContent',
      'LineChart',
      'AreaChart',
      'BarChart',
      'DonutChart',
      'Sparkline',
    ]) {
      // Components (functions, or memo objects like Recharts' Legend).
      expect(['function', 'object'], name).toContain(typeof cjs[name])
      expect(['function', 'object'], name).toContain(
        typeof (esm as Record<string, unknown>)[name],
      )
    }
  })

  it('re-exports the Recharts it depends on as ./recharts', async () => {
    const recharts = await import('recharts')
    const esm = await import('@holakirr/snow-ui-charts/recharts')
    const cjs = require('@holakirr/snow-ui-charts/recharts')
    for (const name of [
      'ResponsiveContainer',
      'BarChart',
      'XAxis',
      'Tooltip',
    ]) {
      // The same objects: one Recharts, one context and tooltip store.
      expect((esm as Record<string, unknown>)[name], name).toBe(
        (recharts as Record<string, unknown>)[name],
      )
      expect(cjs[name], name).toBe(require('recharts')[name])
    }
    expect(Object.keys(esm).length).toBeGreaterThan(50)
  })

  it('ships no stories, tests or fixtures', () => {
    expect(
      readdirSync(dist, { recursive: true }).filter((file) =>
        /stories|\.test\.|test[\\/]|fixtures/.test(String(file)),
      ),
    ).toEqual([])
  })
})

describe("'use client'", () => {
  it('marks every module that uses React hooks or renders', () => {
    // recharts.js only re-exports Recharts (a client boundary can't
    // `export *`), like importing Recharts itself.
    const modules = readdirSync(dist).filter(
      (file) => /\.(c?js)$/.test(file) && !/^recharts\./.test(file),
    )
    const clientModules = modules.filter((file) =>
      /from "react"|require\("react"\)|from "recharts"|require\("recharts"\)/.test(
        read(file),
      ),
    )
    expect(clientModules.length).toBeGreaterThan(10)
    for (const file of clientModules) {
      expect(read(file).startsWith('"use client";'), file).toBe(true)
    }
  })
})

describe('styles.css', () => {
  const css = () => read('styles.css')

  it('has every rule in the components cascade layer', () => {
    const code = css()
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
    expect(code.startsWith('@layer components {')).toBe(true)
    expect(code.endsWith('}')).toBe(true)
    // One top-level block.
    let depth = 0
    let blocks = 0
    for (const char of code) {
      if (char === '{' && depth++ === 0) blocks++
      if (char === '}') depth--
    }
    expect(blocks).toBe(1)
  })

  it('only reads tokens that @holakirr/snow-ui defines', () => {
    const uiCss = readFileSync(
      require.resolve('@holakirr/snow-ui/index.css'),
      'utf8',
    )
    const used = new Set(
      [
        ...css()
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .matchAll(/var\((--[\w-]+)/g),
      ]
        .map(([, name]) => name as string)
        // The charts' own properties.
        .filter((name) => !/^--(chart|snow-chart)-/.test(name)),
    )
    expect(used.size).toBeGreaterThan(10)
    for (const name of used) {
      expect(uiCss, name).toContain(`${name}:`)
    }
  })
})
