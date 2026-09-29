import {
  IconBox,
  IconText,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  Typography,
} from '@holakirr/snow-ui'
import { SnowUIIcon } from '@holakirr/snow-ui-icons'
import type { ReactNode } from 'react'
import {
  ChartPieSliceIcon,
  FolderOpenIcon,
  GearSixIcon,
  IdentificationBadgeIcon,
  ShoppingBagOpenIcon,
  SignInIcon,
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

/** A page of the kit the demo doesn't implement: shown, not linked. */
const SoonItem = ({
  icon,
  label,
  soon,
}: {
  icon: ReactNode
  label: string
  soon: string
}) => (
  <li>
    <IconText
      className="flex gap-1 text-secondary"
      icon={
        <span className="flex items-center gap-1" aria-hidden>
          <IconBox size={16} />
          <IconBox size={20}>{icon}</IconBox>
        </span>
      }
    >
      <span className="flex flex-1 items-center justify-between gap-2 text-14">
        {label}
        <span className="text-12">{soon}</span>
      </span>
    </IconText>
  </li>
)

/**
 * The Figma dashboard Sidebar (212px): the user, Favorites / Recently, the
 * Dashboards and Pages groups. A Server Component: only the links (active
 * state) and the shortcut tabs are client components. It collapses off
 * canvas with the header's toggle (⌘B) and is a sheet on small screens.
 */
export const AppSidebar = ({ dict }: { dict: Dictionary }) => (
  // Padding on the parts, not on Sidebar: its className goes to the fixed
  // desktop panel and is dropped by the mobile sheet.
  <Sidebar collapsible="offcanvas">
    <SidebarHeader className="gap-4 pt-3">
      <IconText icon={<InitialsAvatar name={dict.app.user} />} className="px-2">
        <Typography size={14}>{dict.app.user}</Typography>
      </IconText>
      <Shortcuts />
    </SidebarHeader>
    <SidebarContent className="gap-4 px-4 pt-4">
      <nav aria-labelledby="nav-dashboards" className="flex flex-col gap-1">
        <SectionTitle id="nav-dashboards">{dict.nav.dashboards}</SectionTitle>
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink href="/dashboard" arrow icon={<ChartPieSliceIcon />}>
              {dict.nav.default}
            </NavLink>
          </li>
          <SoonItem
            icon={<ShoppingBagOpenIcon />}
            label={dict.nav.eCommerce}
            soon={dict.nav.soon}
          />
          <SoonItem
            icon={<FolderOpenIcon />}
            label={dict.nav.projects}
            soon={dict.nav.soon}
          />
        </ul>
      </nav>
      <nav aria-labelledby="nav-pages" className="flex flex-col gap-1">
        <SectionTitle id="nav-pages">{dict.nav.pages}</SectionTitle>
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink href="/settings" arrow icon={<GearSixIcon />}>
              {dict.nav.settings}
            </NavLink>
          </li>
          <li>
            <NavLink href="/sign-in" arrow icon={<SignInIcon />}>
              {dict.nav.signIn}
            </NavLink>
          </li>
          <SoonItem
            icon={<IdentificationBadgeIcon />}
            label={dict.nav.userProfile}
            soon={dict.nav.soon}
          />
        </ul>
      </nav>
    </SidebarContent>
    <SidebarFooter className="items-center">
      <IconText
        icon={
          // The logo is drawn in currentColor: black, white in the dark theme.
          <IconBox size={20} aria-hidden className="text-black">
            <SnowUIIcon />
          </IconBox>
        }
        className="text-secondary"
      >
        <Typography size={14} semibold>
          {dict.app.brand}
        </Typography>
      </IconText>
    </SidebarFooter>
  </Sidebar>
)
