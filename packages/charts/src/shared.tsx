'use client'

import type { ReactNode, Ref } from 'react'
import { useId } from 'react'
import type { ChartContainerProps } from './ChartContainer'
import type { ChartConfig } from './config'
import type { ChartTickFormatter } from './format'

/** The `ChartContainer` props every ready-made chart takes. */
export type ChartFrameProps = Pick<
  ChartContainerProps,
  | 'title'
  | 'description'
  | 'height'
  | 'loading'
  | 'emptyMessage'
  | 'loadingLabel'
  | 'keyboardHint'
  | 'table'
  | 'categoryLabel'
  | 'valueFormatter'
  | 'categoryFormatter'
  | 'locale'
  | 'dir'
  | 'legendPosition'
  | 'className'
  | 'style'
  | 'id'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
> & {
  ref?: Ref<HTMLElement>
}

/** The accessible name and description `ChartContainer` gives the chart's `<svg>`. */
export interface SvgLabelProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

/** Props shared by the line, area and bar charts. */
export interface CartesianChartProps<TDatum extends object>
  extends ChartFrameProps {
  /** The rows: one per category (x value). */
  data: readonly TDatum[]
  /** The series: labels, colours, dashes. Their keys are fields of `data`. */
  config: ChartConfig
  /** The field of a row that is its category: the x axis (the y axis of horizontal bars). */
  xKey: keyof TDatum & string
  /** The series to draw, as config keys. Defaults to the config keys that are fields of `data`. */
  series?: readonly string[]
  /** Gridlines and the baseline (Figma: Black/4% lines, a Black/20% baseline). @default true */
  grid?: boolean
  /** The category axis labels. @default true */
  xAxis?: boolean
  /** The value axis labels. @default true */
  yAxis?: boolean
  /** Formats category axis labels. Defaults to `categoryFormatter`. */
  xTickFormatter?: ChartTickFormatter
  /** Formats value axis labels. Defaults to compact numbers (`10K`). */
  yTickFormatter?: ChartTickFormatter
  /** The number of value axis ticks. @default 4 */
  tickCount?: number
  /** The value axis domain, e.g. `[0, 100]`. @default [0, 'auto'] */
  domain?: [
    number | 'auto' | 'dataMin' | 'dataMax',
    number | 'auto' | 'dataMin' | 'dataMax',
  ]
  /** The tooltip on hover and keyboard focus, and its variant. `false` hides it. @default 'dark' */
  tooltip?: boolean | 'dark' | 'light'
  /** The legend. Defaults to shown when there are two series or more. */
  legend?: boolean
  /**
   * Text after a series' label in the legend, by key: a total, like the
   * Figma "Revenue" legend ("Current Week  $58,211").
   */
  legendValues?: Readonly<Record<string, ReactNode>>
  /**
   * Animates the series on mount and on data changes. Defaults to `'auto'`:
   * on, unless the user prefers reduced motion (and off during SSR).
   */
  animate?: boolean | 'auto'
  /** Extra Recharts elements drawn in the chart (`<ReferenceLine>`…). */
  children?: ReactNode
}

/** Axis label style: 12px, `text-secondary` (Figma: 12 Regular, Black/40%). */
export const AXIS_TICK = {
  fill: 'var(--color-text-secondary)',
  fontSize: 12,
} as const

/** Gridlines: 0.5px Black/4%. */
export const GRID_STROKE = {
  stroke: 'var(--color-black-4)',
  strokeWidth: 0.5,
} as const

/** The baseline (value 0): 0.5px Black/20%. */
export const BASELINE = {
  stroke: 'var(--color-black-20)',
  strokeWidth: 0.5,
} as const

/** An id usable in `url(#…)` references (React ids contain `:` / `«»`). */
export const useSvgId = (): string =>
  `snow-chart-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`

/**
 * The series keys of a chart: `series`, else the config keys that are fields
 * of the data (so a config can also hold per-category colours).
 */
export const seriesKeys = (
  config: ChartConfig,
  data: readonly object[],
  series?: readonly string[],
): readonly string[] =>
  series ??
  Object.keys(config).filter((key) =>
    data.some((row) => key in (row as Record<string, unknown>)),
  )

/** The tooltip variant from the `tooltip` prop. */
export const tooltipVariant = (
  tooltip: boolean | 'dark' | 'light',
): 'dark' | 'light' | undefined =>
  tooltip === false ? undefined : tooltip === 'light' ? 'light' : 'dark'
