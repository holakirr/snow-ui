'use client'

import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { Legend } from 'recharts'
import {
  type ChartConfig,
  chartConfigStyle,
  seriesColor,
  seriesLabel,
} from './config'
import { useChart } from './context'

/** Recharts' `<Legend>`: pass `content={<ChartLegendContent />}`. */
export const ChartLegend = Legend

/** The props of Recharts' `<Legend>`. */
export type ChartLegendProps = ComponentProps<typeof Legend>

/** A legend entry Recharts passes to `content`. */
export interface ChartLegendPayloadItem {
  value?: unknown
  dataKey?: unknown
  color?: string
}

export interface ChartLegendContentProps {
  /**
   * The series to list, as config keys. Defaults to Recharts' payload (inside
   * `<ChartLegend>`), else every key of the config.
   */
  keys?: readonly string[]
  /**
   * Text after each label, by key: a total or a share, like the percentages
   * of the Figma "Traffic by Location" legend.
   */
  values?: Readonly<Record<string, ReactNode>>
  /** `horizontal`: a wrapping row (default). `vertical`: a column with the values aligned at the end. */
  layout?: 'horizontal' | 'vertical'
  /** Hides the colour dots. */
  hideIndicator?: boolean
  /** Config for use outside a `ChartContainer`. */
  config?: ChartConfig
  /** Set by Recharts. */
  payload?: readonly ChartLegendPayloadItem[]
  /** An accessible name for the list. */
  'aria-label'?: string
  className?: string
  style?: CSSProperties
}

const payloadKey = (item: ChartLegendPayloadItem, config: ChartConfig) => {
  if (typeof item.dataKey === 'string' && item.dataKey in config) {
    return item.dataKey
  }
  return String(item.value ?? item.dataKey ?? '')
}

/**
 * The legend of SnowUI charts: a colour dot (or the series icon) and the
 * label of each series, optionally with a value. Works inside Recharts'
 * `<ChartLegend content={<ChartLegendContent />} />` or on its own (in a
 * `ChartContainer`'s `legend`, or anywhere with `config`).
 */
export const ChartLegendContent = ({
  keys,
  values,
  layout = 'horizontal',
  hideIndicator = false,
  config: configProp,
  payload,
  'aria-label': ariaLabel,
  className,
  style,
}: ChartLegendContentProps) => {
  const chart = useChart()
  const config = configProp ?? chart?.config ?? {}
  const entries =
    keys ??
    (payload?.length
      ? payload.map((item) => payloadKey(item, config))
      : Object.keys(config))
  if (entries.length === 0) return null

  return (
    <ul
      className={['snow-chart-legend', className].filter(Boolean).join(' ')}
      style={
        chart && !configProp ? style : { ...chartConfigStyle(config), ...style }
      }
      data-slot="chart-legend"
      data-layout={layout}
      aria-label={ariaLabel}
    >
      {entries.map((key) => {
        const series = config[key]
        const Icon = series?.icon
        const swatch = {
          '--snow-chart-swatch': seriesColor(key),
        } as CSSProperties
        return (
          <li key={key} className="snow-chart-legend__item">
            <span className="snow-chart-legend__name">
              {!hideIndicator &&
                (Icon ? (
                  <span className="snow-chart-icon" style={swatch} aria-hidden>
                    <Icon />
                  </span>
                ) : (
                  <span
                    className="snow-chart-swatch"
                    style={swatch}
                    data-dashed={series?.dashed || undefined}
                    aria-hidden
                  />
                ))}
              {seriesLabel(config, key)}
            </span>
            {values?.[key] != null && (
              <span className="snow-chart-legend__value">{values[key]}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
