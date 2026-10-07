'use client'

import { IconBox, IconText, useSidebar } from '@holakirr/snow-ui'
import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * A sidebar row that links to a page of the app (the Figma "Frame" item: an
 * IconText with the hover fill, and the active fill on the current page).
 * Client-side only for the active state (`usePathname`) and to close the
 * mobile sidebar after navigating.
 */
export const NavLink = ({
  href,
  icon,
  activeIcon = icon,
  arrow = false,
  children,
}: {
  href: Route
  /** The icon of the row (Figma: Duotone). */
  icon: ReactNode
  /** The icon on the current page (Figma: Fill). */
  activeIcon?: ReactNode
  /** The kit's expand arrow before the icon (dashboard and page items). */
  arrow?: boolean
  children: ReactNode
}) => {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const active = pathname === href

  return (
    <IconText
      asChild
      interactive
      active={active}
      className="flex gap-1"
      icon={
        <span className="flex items-center gap-1">
          {arrow && (
            <IconBox size={16} className="text-black-20" aria-hidden>
              {!active && <ArrowLineRightIcon className="rtl:-scale-x-100" />}
            </IconBox>
          )}
          <IconBox size={20} aria-hidden>
            {active ? activeIcon : icon}
          </IconBox>
        </span>
      }
    >
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        onClick={() => {
          if (isMobile) setOpenMobile(false)
        }}
      >
        {children}
      </Link>
    </IconText>
  )
}
