'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useDictionary } from '@/app/providers'
import { BellIcon, SidebarSimpleIcon } from '@/components/icons'
import { IconButton } from './icon-button'

const PANEL_ID = 'right-panel'

type RightPanelContextValue = {
  open: boolean
  toggle: () => void
}

const RightPanelContext = createContext<RightPanelContextValue | null>(null)

const useRightPanel = () => {
  const context = useContext(RightPanelContext)
  if (!context) throw new Error('Use inside <RightPanelProvider>.')
  return context
}

export const RightPanelProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true)
  const value = useMemo(
    () => ({ open, toggle: () => setOpen((current) => !current) }),
    [open],
  )
  return <RightPanelContext value={value}>{children}</RightPanelContext>
}

/** The header's bell: shows and hides the notifications panel (wide screens). */
export const RightPanelToggle = ({ layout = false }: { layout?: boolean }) => {
  const dict = useDictionary()
  const { open, toggle } = useRightPanel()
  return (
    <IconButton
      label={layout ? dict.header.rightSidebar : dict.header.notificationsPanel}
      icon={
        layout ? <SidebarSimpleIcon className="-scale-x-100" /> : <BellIcon />
      }
      aria-expanded={open}
      aria-controls={PANEL_ID}
      className="hidden xl:inline-flex"
      onClick={toggle}
    />
  )
}

/**
 * The Figma "RightSidebar" (280px): Notifications, Activities, Contacts. The
 * content is rendered on the server and passed in as children; this client
 * wrapper only shows or hides it.
 */
export const RightPanel = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => {
  const { open } = useRightPanel()
  return (
    <aside
      id={PANEL_ID}
      aria-label={label}
      hidden={!open}
      // Scrolls on its own when taller than the viewport: focusable, so the
      // keyboard can scroll it too.
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region
      tabIndex={0}
      // Stays in view while the page scrolls, like the left sidebar.
      className="sticky top-0 hidden h-svh w-70 shrink-0 flex-col gap-4 self-start overflow-y-auto border-s-[0.5px] border-black-10 p-4 xl:flex"
    >
      {children}
    </aside>
  )
}
