import { Group, SidebarTrigger } from '@holakirr/snow-ui'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { CommandSearch } from './command-search'
import { FavoriteToggle } from './favorite-toggle'
import { HeaderBreadcrumb } from './header-breadcrumb'
import { HistoryMenu } from './history-menu'
import { ThemeMenu } from './preference-controls'
import { RightPanelToggle } from './right-panel'

/**
 * The Figma dashboard Header: sidebar toggle, favourite, breadcrumb; search
 * and the tools. A Server Component that lays out client leaves.
 */
export const AppHeader = ({ dict }: { dict: Dictionary }) => (
  <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 relative after:absolute after:inset-x-0 after:bottom-0 after:h-[0.5px] after:bg-black-10 px-4 py-4 md:px-7 md:py-5">
    <div className="flex items-center gap-2">
      <Group aria-label={dict.header.layout}>
        {/* Named by the SnowUI message `sidebar.toggle` (translated). */}
        <SidebarTrigger className="rounded-12 p-1 [&_svg]:size-5" />
        <FavoriteToggle />
      </Group>
      <HeaderBreadcrumb />
    </div>
    <div className="flex items-center gap-2 md:gap-5">
      <CommandSearch />
      <Group aria-label={dict.header.tools}>
        <ThemeMenu />
        <HistoryMenu />
        <RightPanelToggle />
        <RightPanelToggle layout />
      </Group>
    </div>
  </header>
)
