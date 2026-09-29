'use client'

import { type ReactNode, useMemo } from 'react'
import { Pie, PieChart } from 'recharts'
import { ChartContainer } from './ChartContainer'
import { ChartLegendContent } from './ChartLegend'
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip'
import { paletteColor } from './colors'
import { type ChartConfig, seriesColor } from './config'
import { createFormatValue, useChartLocale } from './context'
import { formatPercent, toNumber } from './format'
import { useChartMessages, withDefault } from './messages'
import type { ChartFrameProps } from './shared'
import { tooltipVariant } from './shared'

export interface DonutChartProps<TDatum extends object>
  extends Omit<ChartFrameProps, 'height' | 'keyboardHint' | 'navigationLabel'> {
  /** The slices: one row per category. */
  data: readonly TDatum[]
  /** Colours and labels by category (the values of `nameKey`). Missing categories take the palette. */
  config?: ChartConfig
  /** The field that names a slice (its config key). */
  nameKey: keyof TDatum & string
  /** The field with the slice's value. */
  valueKey: keyof TDatum & string
  /**
   * Header of the value column in the data table.
   * @default messages.charts.value of `SnowUIProvider`: 'Value'
   */
  valueLabel?: string
  /** Diameter in px. @default 120 */
  size?: number
  /** Ring thickness in px. @default 30 (half the radius, as in Figma) */
  thickness?: number
  /** Gap between slices, in degrees. @default 3 */
  padAngle?: number
  /** Corner radius of the slices in px. @default 4 */
  cornerRadius?: number
  /** Small text in the centre (Figma: 12px, secondary). */
  centerLabel?: ReactNode
  /** Big text in the centre (Figma: 24px Semibold), e.g. a total or a share. */
  centerValue?: ReactNode
  /**
   * The legend: each category with its share (`percent`, the default, like
   * "Traffic by Location"), its value (`value`) or neither (`none`); `false`
   * hides it.
   */
  legend?: boolean | 'percent' | 'value' | 'none'
  /** The tooltip on hover and its variant. `false` hides it. @default 'dark' */
  tooltip?: boolean | 'dark' | 'light'
  /** Animates the slices on mount. @default 'auto' */
  animate?: boolean | 'auto'
}

/**
 * A donut chart: shares of a whole, like the Figma "Traffic by Location"
 * (a 120px ring, 30px thick, rounded slices with gaps, starting at 12
 * o'clock and going clockwise) with a legend of the categories and their
 * shares beside it. The legend and the data table carry every value in
 * text, so the ring itself is hidden from assistive technology and isn't a
 * tab stop.
 *
 * @example
 * <DonutChart
 *   title="Traffic by location"
 *   data={[{ country: 'United States', visits: 52.1 }, { country: 'Canada', visits: 22.8 }]}
 *   nameKey="country"
 *   valueKey="visits"
 *   config={{ 'United States': { color: 'primary' }, Canada: { color: 'blue' } }}
 * />
 */
/** The default config: one object, so memoized values stay the same. */
const NO_CONFIG: ChartConfig = {}

export const DonutChart = <TDatum extends object>({
  data,
  config = NO_CONFIG,
  nameKey,
  valueKey,
  valueLabel: valueLabelProp,
  size = 120,
  thickness = 30,
  padAngle = 3,
  cornerRadius = 4,
  centerLabel,
  centerValue,
  legend = 'percent',
  legendPosition = 'end',
  tooltip = 'dark',
  animate = 'auto',
  valueFormatter,
  locale: localeProp,
  categoryLabel,
  title,
  ...props
}: DonutChartProps<TDatum>) => {
  const locale = useChartLocale(localeProp)
  const messages = useChartMessages()
  const valueLabel = withDefault(valueLabelProp, messages.value)
  const format = createFormatValue(locale, valueFormatter)
  const names = useMemo(
    () => data.map((row) => String((row as Record<string, unknown>)[nameKey])),
    [data, nameKey],
  )
  const fullConfig = useMemo(() => {
    const merged: ChartConfig = { ...config }
    names.forEach((name, index) => {
      merged[name] = {
        ...config[name],
        color: config[name]?.color ?? paletteColor(index),
      }
    })
    // The value column of the data table.
    merged[valueKey] ??= { label: valueLabel }
    return merged
  }, [config, names, valueKey, valueLabel])

  const values = useMemo(
    () =>
      data.map(
        (row) => toNumber((row as Record<string, unknown>)[valueKey]) ?? 0,
      ),
    [data, valueKey],
  )
  const total = values.reduce((sum, value) => sum + Math.max(0, value), 0)
  const slices = useMemo(
    () =>
      data.map((row, index) => ({
        ...(row as Record<string, unknown>),
        fill: seriesColor(names[index] as string),
        fillOpacity: fullConfig[names[index] as string]?.opacity ?? 1,
      })),
    [data, names, fullConfig],
  )

  const legendValues =
    legend === 'percent' || legend === true
      ? Object.fromEntries(
          names.map((name, index) => [
            name,
            total > 0
              ? formatPercent((values[index] ?? 0) / total, locale)
              : '–',
          ]),
        )
      : legend === 'value'
        ? Object.fromEntries(
            names.map((name, index) => [
              name,
              format(values[index] ?? 0, valueKey),
            ]),
          )
        : undefined
  const variant = tooltipVariant(tooltip)
  const outer = size / 2
  const center =
    centerLabel != null || centerValue != null ? (
      <div className="snow-chart-donut__center">
        {centerLabel != null && (
          <span className="snow-chart-donut__center-label">{centerLabel}</span>
        )}
        {centerValue != null && (
          <span className="snow-chart-donut__center-value">{centerValue}</span>
        )}
      </div>
    ) : undefined

  return (
    <ChartContainer
      config={fullConfig}
      title={title}
      height={size}
      width={size}
      empty={data.length === 0 || total === 0}
      keyboardHint={false}
      data={data}
      categoryKey={nameKey}
      categoryLabel={categoryLabel}
      tableSeries={[valueKey]}
      valueFormatter={valueFormatter}
      locale={locale}
      legend={
        legend === false ? undefined : (
          <ChartLegendContent
            keys={names}
            values={legendValues}
            layout="vertical"
          />
        )
      }
      legendPosition={legendPosition}
      overlay={center}
      {...props}
    >
      <PieChart
        accessibilityLayer={false}
        aria-hidden
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Pie
          data={slices}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={Math.max(0, outer - thickness)}
          outerRadius={outer}
          startAngle={90}
          endAngle={-270}
          paddingAngle={data.length > 1 ? padAngle : 0}
          cornerRadius={cornerRadius}
          stroke="none"
          rootTabIndex={-1}
          isAnimationActive={animate}
        />
        {variant && (
          <ChartTooltip
            content={
              <ChartTooltipContent
                variant={variant}
                nameKey={nameKey}
                hideLabel
              />
            }
            cursor={false}
          />
        )}
      </PieChart>
    </ChartContainer>
  )
}
