import { describe, expect, it } from 'vitest'
import {
  chartColorTokens,
  chartPalette,
  paletteColor,
  resolveChartColor,
} from './colors'
import {
  chartColorProperty,
  chartConfigStyle,
  configColors,
  cssIdent,
  seriesColor,
  seriesLabel,
} from './config'
import {
  formatCompact,
  formatNumber,
  formatPercent,
  numberFormat,
  toNumber,
} from './format'

describe('colours', () => {
  it('resolves SnowUI token names to their CSS variables', () => {
    expect(resolveChartColor('primary')).toBe('var(--color-primary)')
    expect(resolveChartColor('indigo')).toBe('var(--color-indigo)')
    expect(resolveChartColor('black-40')).toBe('var(--color-black-40)')
    for (const token of chartColorTokens) {
      expect(resolveChartColor(token)).toBe(`var(--color-${token})`)
    }
  })

  it('passes any other CSS colour through', () => {
    expect(resolveChartColor('#7dbbff')).toBe('#7dbbff')
    expect(resolveChartColor('var(--brand)')).toBe('var(--brand)')
    expect(resolveChartColor('rgb(0 0 0 / 0.4)')).toBe('rgb(0 0 0 / 0.4)')
  })

  it('cycles through the palette', () => {
    expect(paletteColor(0)).toBe('primary')
    expect(paletteColor(1)).toBe('blue')
    expect(paletteColor(chartPalette.length)).toBe('primary')
    expect(paletteColor(-1)).toBe(chartPalette.at(-1))
  })
})

describe('config → CSS custom properties', () => {
  it('names a property per series, escaping characters CSS identifiers lack', () => {
    expect(chartColorProperty('desktop')).toBe('--chart-desktop')
    expect(chartColorProperty('United States')).toBe('--chart-United_20_States')
    expect(cssIdent('a.b/c')).toBe('a_2e_b_2f_c')
    expect(cssIdent('kebab-case')).toBe('kebab-case')
    expect(cssIdent('ümlaut 🙂')).toBe('_fc_mlaut_20__1f642_')
    expect(seriesColor('United States')).toBe('var(--chart-United_20_States)')
  })

  it('never gives two keys the same property', () => {
    const keys = ['a b', 'a_20b', 'a_20_b', 'a_b', 'a-b', 'a.b', 'a__b']
    const idents = keys.map(cssIdent)
    expect(new Set(idents).size).toBe(keys.length)
    expect(cssIdent('a b')).toBe('a_20_b')
    expect(cssIdent('a_20b')).toBe('a_5f_20b')
  })

  it('sets every series colour, falling back to the palette by position', () => {
    expect(
      chartConfigStyle({
        desktop: { label: 'Desktop', color: 'indigo' },
        mobile: { label: 'Mobile' },
        tablet: { color: '#ff0000' },
      }),
    ).toEqual({
      '--chart-desktop': 'var(--color-indigo)',
      '--chart-mobile': 'var(--color-blue)',
      '--chart-tablet': '#ff0000',
    })
    expect(configColors({ a: {} })).toEqual({ a: 'var(--color-primary)' })
  })

  it('labels a series with its config label, else its key', () => {
    expect(seriesLabel({ a: { label: 'Alpha' } }, 'a')).toBe('Alpha')
    expect(seriesLabel({}, 'b')).toBe('b')
  })
})

describe('number formats', () => {
  it('formats values in the locale', () => {
    expect(formatNumber(12345.678, 'en-US')).toBe('12,345.68')
    expect(formatNumber(12345.678, 'de-DE')).toBe('12.345,68')
  })

  it('formats axis values compactly', () => {
    expect(formatCompact(0, 'en-US')).toBe('0')
    expect(formatCompact(30000, 'en-US')).toBe('30K')
    expect(formatCompact(1500000, 'en-US')).toBe('1.5M')
  })

  it('formats shares as percentages', () => {
    expect(formatPercent(0.521, 'en-US')).toBe('52.1%')
  })

  it('falls back to English for an invalid locale and caches formats', () => {
    expect(numberFormat('not a locale!').format(1000)).toBe('1,000')
    expect(numberFormat('en-US')).toBe(numberFormat('en-US'))
  })

  it('reads numbers from data values', () => {
    expect(toNumber(5)).toBe(5)
    expect(toNumber('12.5')).toBe(12.5)
    expect(toNumber('')).toBeUndefined()
    expect(toNumber('abc')).toBeUndefined()
    expect(toNumber(Number.NaN)).toBeUndefined()
    expect(toNumber(null)).toBeUndefined()
  })
})
