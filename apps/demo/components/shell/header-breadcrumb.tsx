'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@holakirr/snow-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDictionary } from '@/app/providers'

/** "Dashboards / Default" or "Pages / Settings", from the current route. */
export const HeaderBreadcrumb = () => {
  const dict = useDictionary()
  const pathname = usePathname()
  const [section, page] =
    pathname === '/orders'
      ? [dict.nav.pages, dict.orders.title]
      : pathname === '/settings'
        ? [dict.nav.pages, dict.nav.settings]
        : [dict.nav.dashboards, dict.nav.default]

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList className="gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">{section}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="px-3">{page}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
