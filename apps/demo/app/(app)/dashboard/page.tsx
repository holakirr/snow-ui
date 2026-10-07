import { Typography } from '@holakirr/snow-ui'
import type { Metadata } from 'next'
import { Block } from '@/components/dashboard/block'
import {
  MarketingChart,
  TotalUsersChart,
  TrafficByDeviceChart,
  TrafficByLocationChart,
} from '@/components/dashboard/charts'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { PeriodMenu } from '@/components/dashboard/period-menu'
import { TrafficByWebsite } from '@/components/dashboard/traffic-by-website'
import { getRequestPreferences } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: `${dict.nav.dashboards} · ${dict.nav.default}` }
}

/**
 * The SnowUI "Dashboard" (Default): KPI cards, Total Users, the traffic
 * blocks and Marketing & SEO. A Server Component; the
 * charts and period menu are the client islands.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: raw } = await searchParams
  const period = raw === 'week' || raw === 'month' ? raw : 'today'
  const { dict, lang } = await getRequestPreferences()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-7 md:p-7">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2 py-1">
          <Typography asChild size={14} semibold>
            <h1>{dict.dashboard.title}</h1>
          </Typography>
          <PeriodMenu />
        </div>

        <KpiCards dict={dict} lang={lang} period={period} />
      </div>

      <div className="grid gap-4 md:gap-7 lg:grid-cols-4">
        <div className="min-w-0 lg:col-span-3">
          <TotalUsersChart />
        </div>
        <Block id="traffic-website" title={dict.dashboard.trafficByWebsite}>
          <TrafficByWebsite dict={dict} />
        </Block>
      </div>

      <div className="grid gap-4 md:gap-7 lg:grid-cols-2">
        <Block id="traffic-device" title={dict.dashboard.trafficByDevice}>
          <TrafficByDeviceChart labelledBy="traffic-device" />
        </Block>
        <Block id="traffic-location" title={dict.dashboard.trafficByLocation}>
          <TrafficByLocationChart labelledBy="traffic-location" />
        </Block>
      </div>

      <Block id="marketing" title={dict.dashboard.marketing}>
        <MarketingChart labelledBy="marketing" />
      </Block>
    </div>
  )
}
