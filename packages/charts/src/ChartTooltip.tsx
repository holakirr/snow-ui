'use client'

import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useEffect,
} from 'react'
import { Tooltip } from 'recharts'
import {
  type ChartConfig,
  type ChartSeriesConfig,
  chartConfigStyle,
  seriesColor,
  seriesLabel,
} from './config'
import { createFormatValue, useChart } from './context'
import { type ChartValueFormatter, toNumber } from './format'
import { isDerivedKey } from './series-data'

/** The props of Recharts' `<Tooltip>`. */
export type ChartTooltipProps = ComponentProps<typeof Tooltip>

/**
 * Recharts' `<Tooltip>` with the SnowUI defaults: `<ChartTooltipContent />`,
 * a Black/20% line (or Black/4% band) as the cursor, and the tooltip placed
 * on the left of the pointer in right-to-left charts.
 */
export const ChartTooltip = (props: ChartTooltipProps) => {
  const chart = useChart()
  return (
    <Tooltip
      content={<ChartTooltipContent />}
      cursor={{
        stroke: 'var(--color-black-20)',
        strokeWidth: 1,
        fill: 'var(--color-black-4)',
      }}
      reverseDirection={{ x: chart?.dir === 'rtl' }}
      wrapperStyle={{ zIndex: 10 }}
      {...props}
    />
  )
}

/** An entry of the tooltip payload (what Recharts passes for each series). */
export interface ChartTooltipItem {
  dataKey?: unknown
  name?: string | number
  value?: unknown
  color?: string
  fill?: string
  stroke?: string
  payload?: unknown
}

export interface ChartTooltipContentProps {
  /** Set by Recharts. */
  active?: boolean
  /** Set by Recharts: one entry per series at the active point. */
  payload?: readonly ChartTooltipItem[]
  /** Set by Recharts: the active category. */
  label?: ReactNode
  /**
   * `dark` (default): the Figma chart tooltip, Black/80% with a background
   * blur (white/80% in dark mode, like `Tooltip`). `light`: the popover glass
   * surface (Background/3, blur, Glass 2 shadow).
   */
  variant?: 'dark' | 'light'
  /** Hides the category label above the values. */
  hideLabel?: boolean
  /** Hides the colour dots. */
  hideIndicator?: boolean
  /** Formats the category label (defaults to the chart's `categoryFormatter`). */
  labelFormatter?: (
    label: ReactNode,
    payload: readonly ChartTooltipItem[],
  ) => ReactNode
  /** Formats values (defaults to the chart's `valueFormatter`). */
  valueFormatter?: ChartValueFormatter
  /**
   * The payload field whose value is the config key of an entry, e.g. the
   * category field of a donut (`nameKey`). Defaults to the entry's `name`.
   */
  nameKey?: string
  /**
   * A data field whose value is the config key that colours the dot:
   * per-category colours (a bar chart with `colorBy="category"`).
   */
  colorKey?: string
  /** Config for use outside a `ChartContainer`. */
  config?: ChartConfig
  className?: string
  style?: CSSProperties
}

const fieldOf = (item: ChartTooltipItem, field: string): unknown =>
  (item.payload as Record<string, unknown> | undefined)?.[field]

/** The config key an entry belongs to. */
const keyOf = (item: ChartTooltipItem, nameKey?: string): string => {
  if (nameKey) {
    const value = fieldOf(item, nameKey)
    if (value != null) return String(value)
  }
  return String(item.name ?? item.dataKey ?? '')
}

const text = (node: ReactNode, fallback: string) =>
  typeof node === 'string' || typeof node === 'number' ? String(node) : fallback

const valueText = (
  value: unknown,
  key: string,
  format: (value: number, key: string) => string,
): string => {
  if (Array.isArray(value)) {
    return value.map((part) => valueText(part, key, format)).join(' – ')
  }
  const number = toNumber(value)
  return number === undefined ? String(value ?? '') : format(number, key)
}

/**
 * The tooltip of SnowUI charts: the category and, for each series, a colour
 * dot (or the series icon), its label and the formatted value. Use it as
 * Recharts' tooltip content: `<ChartTooltip content={<ChartTooltipContent />} />`.
 *
 * While the chart has keyboard focus, the same text is announced through the
 * chart's live region, so screen reader users hear the value they move to.
 */
export const ChartTooltipContent = ({
  active,
  payload,
  label,
  variant = 'dark',
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  valueFormatter,
  nameKey,
  colorKey,
  config: configProp,
  className,
  style,
}: ChartTooltipContentProps) => {
  const chart = useChart()
  const config = configProp ?? chart?.config ?? {}
  const locale = chart?.locale ?? 'en-US'
  const format = valueFormatter
    ? createFormatValue(locale, valueFormatter)
    : (chart?.formatValue ?? createFormatValue(locale))

  // One entry per series: a projection segment repeats its series at the
  // point where the solid and the dashed lines meet.
  const seen = new Set<string>()
  const items = (active ? (payload ?? []) : []).filter((item) => {
    const key = keyOf(item, nameKey)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const labelNode =
    hideLabel || label == null || label === ''
      ? null
      : labelFormatter
        ? labelFormatter(label, items)
        : chart
          ? chart.formatCategory(label)
          : label

  const rows = items.map((item) => {
    const key = keyOf(item, nameKey)
    const colorSource = colorKey ? fieldOf(item, colorKey) : undefined
    const colorKeyValue = colorSource != null ? String(colorSource) : key
    const series: ChartSeriesConfig | undefined = config[key]
    const color =
      config[colorKeyValue] != null
        ? seriesColor(colorKeyValue)
        : (item.color ?? item.fill ?? item.stroke ?? 'currentColor')
    // Stacked and projected series are drawn from derived fields (a running
    // sum, a copy): show the series' own value.
    const value = isDerivedKey(item.dataKey) ? fieldOf(item, key) : item.value
    return {
      key,
      series,
      color,
      name: seriesLabel(config, key),
      value: valueText(value, key, format),
    }
  })

  const announcement =
    rows.length > 0
      ? [
          labelNode != null ? text(labelNode, '') : '',
          rows
            .map((row) => `${text(row.name, row.key)} ${row.value}`)
            .join(', '),
        ]
          .filter(Boolean)
          .join(': ')
      : ''
  const announce = chart?.announce

  useEffect(() => {
    if (announcement) announce?.(announcement)
  }, [announcement, announce])

  if (rows.length === 0) return null

  return (
    <div
      className={['snow-chart-tooltip', className].filter(Boolean).join(' ')}
      style={
        chart || !configProp ? style : { ...chartConfigStyle(config), ...style }
      }
      data-slot="chart-tooltip"
      data-variant={variant}
    >
      {labelNode != null && (
        <div className="snow-chart-tooltip__label">{labelNode}</div>
      )}
      <ul className="snow-chart-tooltip__list">
        {rows.map(({ key, series, color, name, value }) => {
          const Icon = series?.icon
          const swatch = { '--snow-chart-swatch': color } as CSSProperties
          return (
            <li key={key} className="snow-chart-tooltip__item">
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
              <span className="snow-chart-tooltip__name">{name}</span>
              <span className="snow-chart-tooltip__value">{value}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
