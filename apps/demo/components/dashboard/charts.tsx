'use client'

import {
  AreaChart,
  BarChart,
  type ChartConfig,
  DonutChart,
} from '@holakirr/snow-ui-charts'
import { useMemo } from 'react'
import { usePreferences } from '@/app/providers'
import {
  marketing,
  marketingColors,
  totalUsers,
  totalUsersConfig,
  trafficByDevice,
  trafficByDeviceColors,
  trafficByLocation,
  trafficByLocationColors,
} from '@/lib/data'
import { formatCompact, formatNumber, monthName } from '@/lib/format'
import { intlLocale } from '@/lib/preferences'

/*
 * The dashboard's Recharts-based charts. A client module because the charts
 * take formatters (functions), which a Server Component can't pass; the data
 * and the cards around them stay on the server. Each chart is named by its
 * card's heading (`aria-labelledby`).
 */

type ChartProps = { labelledBy: string }

const useChartLocale = () => {
  const { lang, dict } = usePreferences()
  return {
    lang,
    dict,
    locale: intlLocale(lang),
    // The charts' own strings are props, not SnowUI messages.
    keyboardHint: dict.dashboard.keyboardHint,
    month: (value: unknown) => monthName(lang, Number(value)),
    compact: (value: unknown) => formatCompact(lang, Number(value)),
  }
}

/** Figma "Total Users": this year (Primary, gradient) against last year (dashed). */
export const TotalUsersChart = ({ labelledBy }: ChartProps) => {
  const { dict, locale, keyboardHint, month, compact } = useChartLocale()
  const config = useMemo<ChartConfig>(
    () => ({
      thisYear: {
        ...totalUsersConfig.thisYear,
        label: dict.dashboard.thisYear,
      },
      lastYear: {
        ...totalUsersConfig.lastYear,
        label: dict.dashboard.lastYear,
      },
    }),
    [dict],
  )
  return (
    <AreaChart
      aria-labelledby={labelledBy}
      description={dict.dashboard.totalUsersDescription}
      data={totalUsers}
      xKey="month"
      config={config}
      categoryLabel={dict.dashboard.month}
      categoryFormatter={month}
      yTickFormatter={compact}
      locale={locale}
      keyboardHint={keyboardHint}
      grid={false}
      legend
      fade
      height={232}
    />
  )
}

/** Figma "Traffic by Device": one bar per device, each in its colour. */
export const TrafficByDeviceChart = ({ labelledBy }: ChartProps) => {
  const { dict, locale, keyboardHint, compact } = useChartLocale()
  const config = useMemo<ChartConfig>(
    () => ({
      users: { label: dict.dashboard.users },
      ...Object.fromEntries(
        Object.entries(trafficByDeviceColors).map(([device, color]) => [
          device,
          { color, label: dict.dashboard.devices[device] },
        ]),
      ),
    }),
    [dict],
  )
  return (
    <BarChart
      aria-labelledby={labelledBy}
      data={trafficByDevice}
      xKey="device"
      series={['users']}
      config={config}
      colorBy="category"
      categoryLabel={dict.dashboard.device}
      categoryFormatter={(value) =>
        dict.dashboard.devices[String(value)] ?? String(value)
      }
      yTickFormatter={compact}
      locale={locale}
      keyboardHint={keyboardHint}
      grid={false}
      height={196}
    />
  )
}

/** Figma "Traffic by Location": the ring and the legend of shares. */
export const TrafficByLocationChart = ({ labelledBy }: ChartProps) => {
  const { dict, locale } = useChartLocale()
  const config = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        Object.entries(trafficByLocationColors).map(([country, color]) => [
          country,
          { color, label: dict.dashboard.countries[country] },
        ]),
      ),
    [dict],
  )
  return (
    <DonutChart
      aria-labelledby={labelledBy}
      data={trafficByLocation}
      nameKey="country"
      valueKey="visits"
      config={config}
      categoryLabel={dict.dashboard.country}
      categoryFormatter={(value) =>
        dict.dashboard.countries[String(value)] ?? String(value)
      }
      valueLabel={dict.dashboard.visitsShare}
      locale={locale}
      style={{ minHeight: 196 }}
    />
  )
}

/** Figma "Marketing & SEO": campaigns per month, one colour per bar. */
export const MarketingChart = ({ labelledBy }: ChartProps) => {
  const { lang, dict, locale, keyboardHint, month, compact } = useChartLocale()
  const config = useMemo<ChartConfig>(
    () => ({
      campaigns: { label: dict.dashboard.campaigns },
      ...Object.fromEntries(
        marketing.map(({ month: index }) => [
          String(index),
          { color: marketingColors[index % marketingColors.length] },
        ]),
      ),
    }),
    [dict],
  )
  return (
    <BarChart
      aria-labelledby={labelledBy}
      data={marketing}
      xKey="month"
      series={['campaigns']}
      config={config}
      colorBy="category"
      categoryLabel={dict.dashboard.month}
      categoryFormatter={month}
      yTickFormatter={compact}
      valueFormatter={(value) => formatNumber(lang, Number(value))}
      locale={locale}
      keyboardHint={keyboardHint}
      grid={false}
      barSize={20}
      height={196}
    />
  )
}
