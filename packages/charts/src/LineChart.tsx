'use client'

import { SeriesChart, type SeriesChartProps } from './SeriesChart'

export type LineChartProps<TDatum extends object> = SeriesChartProps<TDatum>

/**
 * A line chart of one or more series over categories (months, days…): the
 * SnowUI dashboards' "Total Users" and "Revenue". Smooth 1px lines, 12px
 * axis labels, Black/4% gridlines, a tooltip on hover and keyboard focus
 * (← / →), and a legend when there are two series or more. Mark a series
 * `dashed` in its config (the previous period) or dash every line after
 * `projectionFrom` (a forecast).
 *
 * @example
 * <LineChart
 *   title="Total users"
 *   data={data}
 *   xKey="month"
 *   config={{
 *     thisYear: { label: 'This year', color: 'primary' },
 *     lastYear: { label: 'Last year', color: 'indigo', dashed: true },
 *   }}
 * />
 */
export const LineChart = <TDatum extends object>(
  props: LineChartProps<TDatum>,
) => <SeriesChart type="line" {...props} />
