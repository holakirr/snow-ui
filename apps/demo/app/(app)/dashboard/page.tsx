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
import { OrdersTable } from '@/components/dashboard/orders-table'
import { TrafficByWebsite } from '@/components/dashboard/traffic-by-website'
import { getRequestPreferences } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: `${dict.nav.dashboards} · ${dict.nav.default}` }
}

/**
 * The SnowUI "Dashboard" (Default): KPI cards, Total Users, the traffic
 * blocks, Marketing & SEO and the order list. A Server Component; the
 * charts and the table are the client islands.
 */
export default async function DashboardPage() {
  const { dict, lang } = await getRequestPreferences()

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-7 md:p-7">
      <div className="flex items-center justify-between">
        <Typography asChild size={14} semibold>
          <h1>{dict.dashboard.title}</h1>
        </Typography>
        <Typography size={12} className="text-secondary">
          {dict.dashboard.today}
        </Typography>
      </div>

      <KpiCards dict={dict} lang={lang} />

      <div className="grid gap-4 md:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(12.5rem,16rem)]">
        <Block id="total-users" title={dict.dashboard.totalUsers}>
          <TotalUsersChart labelledBy="total-users" />
        </Block>
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

      <Block id="orders" title={dict.orders.title}>
        <Typography size={12} className="-mt-2 text-secondary">
          {dict.orders.description}
        </Typography>
        <OrdersTable captionId="orders" />
      </Block>
    </div>
  )
}
