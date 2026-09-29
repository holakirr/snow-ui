'use client'

import { type ReactElement, useMemo } from 'react'
import {
  Bar,
  type BarShapeProps,
  BarStack,
  CartesianGrid,
  BarChart as RechartsBarChart,
  Rectangle,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer } from './ChartContainer'
import { ChartLegendContent } from './ChartLegend'
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip'
import { paletteColor } from './colors'
import { type ChartConfig, seriesColor } from './config'
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
} from './shared'

export interface BarChartProps<TDatum extends object>
  extends CartesianChartProps<TDatum> {
  /** Stacks the series in one bar per category (else they are grouped side by side). @default false */
  stacked?: boolean
  /** Horizontal bars: categories on the vertical axis, values growing along the horizontal one. @default false */
  horizontal?: boolean
  /**
   * `series` (default): each series has its colour. `category`: each bar
   * takes the colour of its category (a config key per category, else the
   * palette), like the Figma "Traffic by Device" bars.
   */
  colorBy?: 'series' | 'category'
  /** Corner radius of the bars (of the whole stack when `stacked`), in px. @default 8 */
  radius?: number
  /** The maximum bar thickness in px; bars get thinner when there's no room. @default 28 */
  barSize?: number
}

/** The config with an entry (and a palette colour) for every category. */
const withCategories = (
  config: ChartConfig,
  categories: readonly string[],
): ChartConfig => {
  const merged: ChartConfig = { ...config }
  categories.forEach((category, index) => {
    merged[category] = {
      ...config[category],
      color: config[category]?.color ?? paletteColor(index),
    }
  })
  return merged
}

type PlotProps<TDatum extends object> = Omit<
  BarChartProps<TDatum>,
  keyof ChartFrameProps | 'series' | 'legend' | 'legendValues'
> &
  SvgLabelProps & { keys: readonly string[] }

const Plot = <TDatum extends object>({
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
  stacked = false,
  horizontal = false,
  colorBy = 'series',
  radius = 8,
  barSize = 28,
  children,
  ...svgLabel
}: PlotProps<TDatum>) => {
  const chart = useChart()
  const rtl = chart?.dir === 'rtl'
  const locale = chart?.locale ?? 'en-US'
  const variant = tooltipVariant(tooltip)
  const byCategory = colorBy === 'category'

  const categoryAxis = {
    dataKey: xKey as string,
    type: 'category' as const,
    hide: !xAxis,
    tickLine: false,
    tick: AXIS_TICK,
    tickFormatter:
      xTickFormatter ??
      ((value: unknown) => chart?.formatCategory(value) ?? String(value)),
  }
  const valueAxis = {
    type: 'number' as const,
    hide: !yAxis,
    tickLine: false,
    tick: AXIS_TICK,
    tickCount,
    // Steps of 1, 2 or 5 × 10ⁿ: 0, 10K, 20K, 30K.
    niceTicks: 'snap125' as const,
    domain,
    tickFormatter:
      yTickFormatter ?? ((value: number) => formatCompact(value, locale)),
  }

  const shape = byCategory
    ? (props: BarShapeProps) => (
        <Rectangle
          {...props}
          fill={seriesColor(
            String((props.payload as Record<string, unknown>)[xKey]),
          )}
        />
      )
    : undefined

  const bars = keys.map(
    (key): ReactElement => (
      <Bar
        key={key}
        name={key}
        dataKey={key}
        fill={seriesColor(key)}
        fillOpacity={config[key]?.opacity ?? 1}
        radius={stacked ? 0 : radius}
        shape={shape}
        isAnimationActive={animate}
      />
    ),
  )

  return (
    <RechartsBarChart
      data={data as unknown as Record<string, unknown>[]}
      layout={horizontal ? 'vertical' : 'horizontal'}
      margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
      maxBarSize={barSize}
      barGap={4}
      {...svgLabel}
    >
      {grid && (
        <CartesianGrid
          vertical={horizontal}
          horizontal={!horizontal}
          {...GRID_STROKE}
        />
      )}
      {horizontal ? (
        <>
          <XAxis
            {...valueAxis}
            reversed={rtl}
            axisLine={false}
            tickMargin={12}
          />
          <YAxis
            {...categoryAxis}
            orientation={rtl ? 'right' : 'left'}
            axisLine={grid ? BASELINE : false}
            tickMargin={16}
            width="auto"
          />
        </>
      ) : (
        <>
          <XAxis
            {...categoryAxis}
            reversed={rtl}
            axisLine={grid ? BASELINE : false}
            tickMargin={12}
            // Every bar keeps its label unless two labels really overlap
            // (Figma: "Windows" and "Android" 57px apart).
            minTickGap={2}
          />
          <YAxis
            {...valueAxis}
            orientation={rtl ? 'right' : 'left'}
            axisLine={false}
            tickMargin={16}
            width="auto"
          />
        </>
      )}
      {stacked ? <BarStack radius={radius}>{bars}</BarStack> : bars}
      {variant && (
        <ChartTooltip
          content={
            <ChartTooltipContent
              variant={variant}
              colorKey={byCategory ? xKey : undefined}
            />
          }
          cursor={{ fill: 'var(--color-black-4)', stroke: 'none' }}
        />
      )}
      {children}
    </RechartsBarChart>
  )
}

/**
 * A bar chart: vertical (default) or `horizontal` bars, grouped or
 * `stacked`, one colour per series or per category (`colorBy="category"`).
 * SnowUI bars are 28px wide with an 8px radius ("Traffic by Device",
 * "Projections vs Actuals" with a 20% `opacity` projection on top).
 *
 * @example
 * <BarChart
 *   title="Traffic by device"
 *   data={data}
 *   xKey="device"
 *   colorBy="category"
 *   config={{ users: { label: 'Users' }, Linux: { color: 'cyan' }, Mac: { color: 'mint' } }}
 * />
 */
export const BarChart = <TDatum extends object>({
  data,
  config,
  xKey,
  series,
  legend,
  legendValues,
  colorBy,
  title,
  description,
  height,
  loading,
  emptyMessage,
  loadingLabel,
  keyboardHint,
  navigationLabel,
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
}: BarChartProps<TDatum>) => {
  const keys = useMemo(
    () => seriesKeys(config, data, series),
    [config, data, series],
  )
  const categories = useMemo(
    () =>
      colorBy === 'category'
        ? data.map((row) => String((row as Record<string, unknown>)[xKey]))
        : [],
    [colorBy, data, xKey],
  )
  const fullConfig = useMemo(
    () => (categories.length ? withCategories(config, categories) : config),
    [config, categories],
  )
  const showLegend = legend ?? keys.length > 1
  const legendKeys =
    colorBy === 'category' && keys.length === 1 ? categories : keys

  return (
    <ChartContainer
      config={fullConfig}
      title={title}
      description={description}
      height={height}
      loading={loading}
      empty={data.length === 0}
      emptyMessage={emptyMessage}
      loadingLabel={loadingLabel}
      keyboardHint={keyboardHint}
      navigationLabel={navigationLabel}
      data={data}
      categoryKey={xKey}
      categoryLabel={categoryLabel}
      tableSeries={keys}
      table={table}
      valueFormatter={valueFormatter}
      categoryFormatter={categoryFormatter}
      locale={locale}
      dir={dir}
      legend={
        showLegend ? (
          <ChartLegendContent keys={legendKeys} values={legendValues} />
        ) : undefined
      }
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
        keys={keys}
        data={data}
        config={fullConfig}
        xKey={xKey}
        colorBy={colorBy}
        {...plotProps}
      />
    </ChartContainer>
  )
}
