import { Typography } from '@holakirr/snow-ui'
import type { Metadata } from 'next'
import { OrdersTable } from '@/components/dashboard/orders-table'
import { getRequestPreferences } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: dict.orders.title }
}

export default async function OrdersPage() {
  const { dict } = await getRequestPreferences()
  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-7 md:p-7">
      <Typography asChild size={14} semibold>
        <h1 id="orders">{dict.orders.title}</h1>
      </Typography>
      <OrdersTable captionId="orders" />
    </div>
  )
}
