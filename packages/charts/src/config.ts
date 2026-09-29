import type { ComponentType, CSSProperties, ReactNode } from 'react'
import { type ChartColor, paletteColor, resolveChartColor } from './colors'

/** How one series (or, for a donut, one category) looks and is named. */
export interface ChartSeriesConfig {
  /** The name in the legend, the tooltip and the data table. Defaults to the key. */
  label?: ReactNode
  /**
   * A SnowUI colour token (`'primary'`, `'indigo'`, `'black-40'`…) or any CSS
   * colour. Defaults to the palette colour of the series' position
   * (`chartPalette`).
   */
  color?: ChartColor
  /** An icon shown instead of the colour dot in the legend and the tooltip. */
  icon?: ComponentType<{ className?: string }>
  /** Lines and areas: a dashed stroke, e.g. for the previous period. */
  dashed?: boolean
  /**
   * Fill opacity (0–1): bars and donut slices (default 1), areas (the top of
   * the gradient, default 0.1). `0` draws an area as a line only.
   */
  opacity?: number
}

/**
 * The series of a chart, by data key: `{ desktop: { label: 'Desktop', color:
 * 'indigo' } }`. `ChartContainer` turns every colour into a CSS custom
 * property (`--chart-desktop`), so the chart, the tooltip and the legend use
 * one value that follows the theme.
 */
export type ChartConfig = Record<string, ChartSeriesConfig>

/**
 * A config key as a CSS identifier: every character other than a letter, a
 * digit or `-` (`_` included) becomes `_<hex code>_` (`'United States'` →
 * `United_20_States`). Since `_` only appears in escapes, different keys
 * never share a property (`'a b'` → `a_20_b`, `'a_20b'` → `a_5f_20b`).
 */
export const cssIdent = (key: string): string =>
  key.replace(
    /[^A-Za-z0-9-]/gu,
    (char) => `_${char.codePointAt(0)?.toString(16)}_`,
  )

/** The custom property that holds the colour of a series: `--chart-<key>`. */
export const chartColorProperty = (key: string): `--chart-${string}` =>
  `--chart-${cssIdent(key)}`

/** The colour of a series as a CSS value: `var(--chart-<key>)`. */
export const seriesColor = (key: string): string =>
  `var(${chartColorProperty(key)})`

/** The configured colour of every series, falling back to the palette. */
export const configColors = (config: ChartConfig): Record<string, string> =>
  Object.fromEntries(
    Object.entries(config).map(([key, series], index) => [
      key,
      resolveChartColor(series.color ?? paletteColor(index)),
    ]),
  )

/**
 * The custom properties `ChartContainer` sets: one `--chart-<key>` per
 * series, e.g. `{ '--chart-desktop': 'var(--color-indigo)' }`.
 */
export const chartConfigStyle = (config: ChartConfig): CSSProperties =>
  Object.fromEntries(
    Object.entries(configColors(config)).map(([key, color]) => [
      chartColorProperty(key),
      color,
    ]),
  ) as CSSProperties

/** The label of a series: its config label, else the key itself. */
export const seriesLabel = (config: ChartConfig, key: string): ReactNode =>
  config[key]?.label ?? key
