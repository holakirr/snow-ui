import {
  IconBox,
  IconText,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  Typography,
} from '@holakirr/snow-ui'
import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type { ReactNode } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { BrandWordmark } from '@/components/brand-wordmark'
import {
  AddressBookIcon,
  ChartPieSliceIcon,
  ChatsTeardropIcon,
  FolderOpenIcon,
  GearSixIcon,
  IdentificationBadgeIcon,
  ListBulletsIcon,
  NotebookIcon,
  ShoppingBagOpenIcon,
  SignInIcon,
  UsersThreeIcon,
} from '@/components/icons'
import { InitialsAvatar } from '@/components/initials-avatar'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { NavLink } from './nav-link'
import { Shortcuts } from './shortcuts'

const SectionTitle = ({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) => (
  <Typography asChild size={14} className="px-3 py-1 text-secondary">
    <h2 id={id}>{children}</h2>
  </Typography>
)

/** A source navigation item whose page is outside the demo's scope. */
const StaticItem = ({
  icon,
  label,
  arrow = false,
}: {
  icon?: ReactNode
  label: string
  arrow?: boolean
}) => (
  <li>
    <IconText
      className="flex gap-1 p-2"
      icon={
        icon ? (
          <span className="flex items-center gap-1" aria-hidden>
            <IconBox size={16} className="text-black-20">
              {arrow && <ArrowLineRightIcon />}
            </IconBox>
            <IconBox size={20}>{icon}</IconBox>
          </span>
        ) : undefined
      }
    >
      <span className={icon ? 'text-14' : 'ps-10 text-14'}>{label}</span>
    </IconText>
  </li>
)

/**
 * The Figma dashboard Sidebar (212px): the user, Favorites / Recently, the
 * Dashboards and Pages groups, with Duotone icons (Fill on the current
 * page). A Server Component: only the links (active state) and the shortcut
 * tabs are client components. It collapses off canvas with the header's
 * toggle (⌘B) and is a sheet on small screens.
 */
export const AppSidebar = ({ dict }: { dict: Dictionary }) => (
  // Padding on the parts, not on Sidebar: its className goes to the fixed
  // desktop panel and is dropped by the mobile sheet.
  <Sidebar collapsible="offcanvas">
    <SidebarHeader className="gap-1 px-4 pt-2 pb-3">
      <IconText icon={<InitialsAvatar name={dict.app.user} />} className="p-2">
        <Typography size={14}>{dict.app.user}</Typography>
      </IconText>
      <div aria-hidden className="h-1" />
      <Shortcuts />
    </SidebarHeader>
    <SidebarContent className="gap-2 px-4 pt-2">
      <nav
        aria-labelledby="nav-dashboards"
        className="flex flex-col gap-1 pb-3"
      >
        <SectionTitle id="nav-dashboards">{dict.nav.dashboards}</SectionTitle>
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink
              href="/dashboard"
              arrow
              icon={<ChartPieSliceIcon weight="duotone" />}
              activeIcon={<ChartPieSliceIcon weight="fill" />}
            >
              {dict.nav.overview}
            </NavLink>
          </li>
          <StaticItem
            icon={<ShoppingBagOpenIcon />}
            label={dict.nav.eCommerce}
            arrow
          />
          <StaticItem
            icon={<FolderOpenIcon />}
            label={dict.nav.projects}
            arrow
          />
        </ul>
      </nav>
      <nav aria-labelledby="nav-pages" className="flex flex-col gap-1 pb-3">
        <SectionTitle id="nav-pages">{dict.nav.pages}</SectionTitle>
        <ul className="flex flex-col gap-1">
          <StaticItem
            icon={<IdentificationBadgeIcon />}
            label={dict.nav.userProfile}
            arrow
          />
          {[
            dict.nav.overview,
            dict.nav.projects,
            dict.nav.campaigns,
            dict.nav.documents,
            dict.nav.followers,
          ].map((label) => (
            <StaticItem key={label} label={label} />
          ))}
          <li>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-12 p-2 text-14 hover:bg-black-4 focus-ring">
                <IconBox
                  size={16}
                  className="text-black-20 group-open:rotate-90"
                >
                  <ArrowLineRightIcon />
                </IconBox>
                <IconBox size={20}>
                  <AddressBookIcon />
                </IconBox>
                {dict.nav.account}
              </summary>
              <ul className="flex flex-col gap-1 ps-5">
                <li>
                  <NavLink href="/settings" icon={<GearSixIcon />}>
                    {dict.nav.settings}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/sign-in" icon={<SignInIcon />}>
                    {dict.nav.signIn}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/orders" icon={<ListBulletsIcon />}>
                    {dict.orders.title}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>
          <StaticItem
            icon={<UsersThreeIcon />}
            label={dict.nav.corporate}
            arrow
          />
          <StaticItem icon={<NotebookIcon />} label={dict.nav.blog} arrow />
          <StaticItem
            icon={<ChatsTeardropIcon />}
            label={dict.nav.social}
            arrow
          />
        </ul>
      </nav>
    </SidebarContent>
    <SidebarFooter className="items-center px-4 pt-0 pb-3">
      <IconText
        icon={
          <IconBox size={20} aria-hidden className="text-black">
            <BrandLogo name="SnowUI" size={20} />
          </IconBox>
        }
        className="gap-1 p-2 text-secondary"
      >
        <BrandWordmark />
      </IconText>
    </SidebarFooter>
  </Sidebar>
)
