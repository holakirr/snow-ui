'use client'

import { Fragment, type ReactElement } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  usePlotArea,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer } from './ChartContainer'
import { ChartLegendContent } from './ChartLegend'
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip'
import { seriesColor } from './config'
import { useChart } from './context'
import { formatCompact } from './format'
import {
  AXIS_TICK,
  BASELINE,
  type CartesianChartProps,
  type ChartFrameProps,
  GRID_STROKE,
  type SvgLabelProps,
  seriesKeys,
  tooltipVariant,
  useSvgId,
} from './shared'

/** The curve between points. */
export type ChartCurve = 'smooth' | 'linear' | 'step'

export interface SeriesChartProps<TDatum extends object>
  extends CartesianChartProps<TDatum> {
  /**
   * `smooth` (default): a monotone curve, as in the SnowUI dashboards; it
   * never overshoots the data. `linear`: straight segments. `step`: steps.
   */
  curve?: ChartCurve
  /** Draws a dot on every data point (a dot on the active point is always drawn). @default false */
  dots?: boolean
  /** Line width in px. @default 1 */
  strokeWidth?: number
  /**
   * The category (x value) from which the lines turn dashed: a projection or
   * forecast after the last actual value. Series whose config is `dashed`
   * stay dashed throughout.
   */
  projectionFrom?: string | number
  /**
   * Fades each line in from 40% opacity at its start to 100% at its end,
   * like the Figma "Total Users" and "Revenue" lines. @default false
   */
  fade?: boolean
  /** Area charts: stacks the series. @default false */
  stacked?: boolean
}

const CURVES = {
  smooth: 'monotone',
  linear: 'linear',
  step: 'stepAfter',
} as const

const DASH = '2 4'
const solidKey = (key: string) => `__snow_solid__${key}`
const projectionKey = (key: string) => `__snow_projection__${key}`

/**
 * A horizontal gradient from 40% to 100% opacity across the plot area, for
 * `fade`. In user space, so a flat line (a zero-height box) gets it too.
 */
const FadeGradient = ({
  id,
  color,
  reversed,
}: {
  id: string
  color: string
  reversed: boolean
}) => {
  const plot = usePlotArea()
  if (!plot) return null
  const start = plot.x
  const end = plot.x + plot.width
  return (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={reversed ? end : start}
      x2={reversed ? start : end}
      y1={0}
      y2={0}
    >
      <stop offset="0" style={{ stopColor: color, stopOpacity: 0.4 }} />
      <stop offset="1" style={{ stopColor: color, stopOpacity: 1 }} />
    </linearGradient>
  )
}

/** The fill of an area: the series colour fading to transparent downwards. */
const AreaGradient = ({
  id,
  color,
  opacity,
}: {
  id: string
  color: string
  opacity: number
}) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" style={{ stopColor: color, stopOpacity: opacity }} />
    <stop offset="1" style={{ stopColor: color, stopOpacity: 0 }} />
  </linearGradient>
)

type PlotProps<TDatum extends object> = Omit<
  SeriesChartProps<TDatum>,
  keyof ChartFrameProps | 'series' | 'legend'
> &
  SvgLabelProps & {
    type: 'line' | 'area'
    keys: readonly string[]
  }

/** The Recharts chart, inside `ChartContainer` (it reads the direction). */
const Plot = <TDatum extends object>({
  type,
  keys,
  data,
  config,
  xKey,
  grid = true,
  xAxis = true,
  yAxis = true,
  xTickFormatter,
  yTickFormatter,
  tickCount = 4,
  domain = [0, 'auto'],
  tooltip = 'dark',
  animate = 'auto',
  curve = 'smooth',
  dots = false,
  strokeWidth = 1,
  projectionFrom,
  fade = false,
  stacked = false,
  children,
  ...svgLabel
}: PlotProps<TDatum>) => {
  const chart = useChart()
  const rtl = chart?.dir === 'rtl'
  const locale = chart?.locale ?? 'en-US'
  const svgId = useSvgId()

  const projectionIndex =
    projectionFrom === undefined
      ? -1
      : data.findIndex(
          (row) => (row as Record<string, unknown>)[xKey] === projectionFrom,
        )
  const split = (key: string) => projectionIndex >= 0 && !config[key]?.dashed
  const rows =
    projectionIndex >= 0
      ? data.map((row, index) => {
          const record = { ...(row as Record<string, unknown>) }
          for (const key of keys) {
            if (!split(key)) continue
            record[solidKey(key)] =
              index <= projectionIndex ? record[key] : null
            record[projectionKey(key)] =
              index >= projectionIndex ? record[key] : null
          }
          return record
        })
      : (data as readonly object[])

  const variant = tooltipVariant(tooltip)
  const Series = type === 'area' ? Area : Line

  return (
    <ComposedChart
      data={rows as Record<string, unknown>[]}
      margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
      {...svgLabel}
    >
      <defs>
        {keys.map((key) => (
          <Fragment key={key}>
            {fade && (
              <FadeGradient
                id={`${svgId}-fade-${keys.indexOf(key)}`}
                color={seriesColor(key)}
                reversed={rtl}
              />
            )}
            {type === 'area' && (
              <AreaGradient
                id={`${svgId}-area-${keys.indexOf(key)}`}
                color={seriesColor(key)}
                opacity={config[key]?.opacity ?? 0.1}
              />
            )}
          </Fragment>
        ))}
      </defs>
      {grid && <CartesianGrid vertical={false} {...GRID_STROKE} />}
      <XAxis
        dataKey={xKey as string}
        hide={!xAxis}
        reversed={rtl}
        tickLine={false}
        axisLine={grid ? BASELINE : false}
        tick={AXIS_TICK}
        tickMargin={12}
        minTickGap={8}
        // The first and last labels stay inside the chart.
        padding={{ left: 16, right: 16 }}
        tickFormatter={
          xTickFormatter ??
          ((value: unknown) => chart?.formatCategory(value) ?? String(value))
        }
      />
      <YAxis
        hide={!yAxis}
        orientation={rtl ? 'right' : 'left'}
        tickLine={false}
        axisLine={false}
        tick={AXIS_TICK}
        tickMargin={16}
        tickCount={tickCount}
        niceTicks="snap125"
        width="auto"
        domain={domain}
        tickFormatter={
          yTickFormatter ?? ((value: number) => formatCompact(value, locale))
        }
      />
      {keys.flatMap((key) => {
        const index = keys.indexOf(key)
        const color = seriesColor(key)
        const dashed = Boolean(config[key]?.dashed)
        const common = {
          name: key,
          type: CURVES[curve],
          stroke: fade ? `url(#${svgId}-fade-${index})` : color,
          strokeWidth,
          strokeLinecap: 'round' as const,
          dot: dots ? { r: 2.5, fill: color, stroke: 'none' } : false,
          activeDot: {
            r: 5,
            strokeWidth: 2,
            stroke: color,
            fill: 'var(--color-background-1)',
          },
          isAnimationActive: animate,
          stackId: stacked ? 'stack' : undefined,
          ...(type === 'area' && {
            fill: `url(#${svgId}-area-${index})`,
            fillOpacity: 1,
          }),
        }
        if (!split(key)) {
          return [
            <Series
              key={key}
              {...common}
              dataKey={key}
              strokeDasharray={dashed ? DASH : undefined}
            />,
          ] as ReactElement[]
        }
        return [
          <Series key={key} {...common} dataKey={solidKey(key)} />,
          <Series
            key={`${key}-projection`}
            {...common}
            dataKey={projectionKey(key)}
            strokeDasharray={DASH}
            legendType="none"
          />,
        ] as ReactElement[]
      })}
      {variant && (
        <ChartTooltip
          content={<ChartTooltipContent variant={variant} />}
          cursor={{ stroke: 'var(--color-black-20)', strokeWidth: 1 }}
        />
      )}
      {children}
    </ComposedChart>
  )
}

/** Line and area charts: `ChartContainer` around the Recharts chart. */
export const SeriesChart = <TDatum extends object>({
  type,
  data,
  config,
  xKey,
  series,
  legend,
  title,
  description,
  height,
  loading,
  emptyMessage,
  loadingLabel,
  keyboardHint,
  table,
  categoryLabel,
  valueFormatter,
  categoryFormatter,
  locale,
  dir,
  legendPosition,
  className,
  style,
  id,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...plotProps
}: SeriesChartProps<TDatum> & { type: 'line' | 'area' }) => {
  const keys = seriesKeys(config, data, series)
  const showLegend = legend ?? keys.length > 1
  return (
    <ChartContainer
      config={config}
      title={title}
      description={description}
      height={height}
      loading={loading}
      empty={data.length === 0}
      emptyMessage={emptyMessage}
      loadingLabel={loadingLabel}
      keyboardHint={keyboardHint}
      data={data}
      categoryKey={xKey}
      categoryLabel={categoryLabel}
      tableSeries={keys}
      table={table}
      valueFormatter={valueFormatter}
      categoryFormatter={categoryFormatter}
      locale={locale}
      dir={dir}
      legend={showLegend ? <ChartLegendContent keys={keys} /> : undefined}
      legendPosition={legendPosition}
      className={className}
      style={style}
      id={id}
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <Plot
        type={type}
        keys={keys}
        data={data}
        config={config}
        xKey={xKey}
        {...plotProps}
      />
    </ChartContainer>
  )
}
