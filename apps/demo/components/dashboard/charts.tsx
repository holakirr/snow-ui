'use client'

import {
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@holakirr/snow-ui'
import {
  AreaChart,
  BarChart,
  type ChartConfig,
  ChartLegendContent,
  DonutChart,
} from '@holakirr/snow-ui-charts'
import { useMemo, useState } from 'react'
import { usePreferences } from '@/app/providers'
import {
  marketing,
  marketingColors,
  operatingStatus,
  totalProjects,
  totalUsers,
  totalUsersConfig,
  trafficByDevice,
  trafficByDeviceColors,
  trafficByLocation,
  trafficByLocationColors,
} from '@/lib/data'
import { formatCompact, formatNumber, monthName } from '@/lib/format'
import { intlLocale } from '@/lib/preferences'
import { SourceDonutArtwork } from './source-donut-artwork'
import { SourceOverviewChart } from './source-overview-chart'

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
export const TotalUsersChart = () => {
  const [metric, setMetric] = useState('totalUsers')
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
  const metrics = [
    { key: 'totalUsers', label: dict.dashboard.totalUsers, data: totalUsers },
    {
      key: 'totalProjects',
      label: dict.dashboard.totalProjects,
      data: totalProjects,
    },
    {
      key: 'operatingStatus',
      label: dict.dashboard.operatingStatus,
      data: operatingStatus,
    },
  ]
  return (
    <Card variant="block" className="min-w-0">
      <Tabs
        value={metric}
        onValueChange={setMetric}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-center gap-4">
          <TabsList
            aria-label={dict.dashboard.metric}
            className="justify-start gap-4"
          >
            {metrics.map(({ key, label }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="gap-0 rounded-12 data-[state=active]:font-semibold data-[state=active]:text-black [&>span:last-child]:hidden"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <span aria-hidden className="h-4 w-px bg-black-10" />
          <ChartLegendContent
            config={config}
            className="[&_.snow-chart-swatch]:size-1"
          />
        </div>
        {metrics.map(({ key, label, data }) => (
          <TabsContent key={key} value={key} className="mt-0">
            {key === 'totalUsers' ? (
              <SourceOverviewChart
                label={label}
                description={dict.dashboard.totalUsersDescription}
                month={month}
                locale={locale}
                config={config}
              />
            ) : (
              <AreaChart
                aria-label={label}
                description={
                  key === 'totalUsers'
                    ? dict.dashboard.totalUsersDescription
                    : undefined
                }
                data={data}
                xKey="month"
                config={config}
                categoryLabel={dict.dashboard.month}
                categoryFormatter={month}
                yTickFormatter={
                  key === 'operatingStatus' ? (value) => `${value}%` : compact
                }
                locale={locale}
                keyboardHint={keyboardHint}
                grid={false}
                legend={false}
                fade
                height={246}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
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
      plotMargin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      xAxisHeight={28}
      yAxisWidth={39}
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
      plotWidth={160}
      overlay={<SourceDonutArtwork />}
      style={{ minHeight: 196, columnGap: 16 }}
      className="[&_.snow-chart-swatch]:size-1 [&_.recharts-pie-sector_path]:fill-transparent"
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
      barSize={28}
      domain={[0, 30000]}
      plotMargin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      xAxisHeight={28}
      yAxisWidth={39}
      height={196}
    />
  )
}
