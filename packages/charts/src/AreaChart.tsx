'use client'

import { SeriesChart, type SeriesChartProps } from './SeriesChart'

export type AreaChartProps<TDatum extends object> = SeriesChartProps<TDatum>

/**
 * An area chart: a line chart whose series are filled with a gradient of
 * their colour, from 10% at the line to transparent at the baseline (the
 * Figma "Total Users" area). A series' config `opacity` sets the top of the
 * gradient (`0`: a line without fill, e.g. a dashed previous period);
 * `stacked` stacks the series.
 *
 * @example
 * <AreaChart
 *   title="Total users"
 *   data={data}
 *   xKey="month"
 *   config={{
 *     thisYear: { label: 'This year', color: 'primary' },
 *     lastYear: { label: 'Last year', color: 'cyan', dashed: true, opacity: 0 },
 *   }}
 * />
 */
export const AreaChart = <TDatum extends object>(
  props: AreaChartProps<TDatum>,
) => <SeriesChart type="area" {...props} />
