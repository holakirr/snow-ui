'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useDictionary } from '@/app/providers'
import { BellIcon } from '@/components/icons'
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
export const RightPanelToggle = () => {
  const dict = useDictionary()
  const { open, toggle } = useRightPanel()
  return (
    <IconButton
      label={dict.header.notificationsPanel}
      icon={<BellIcon />}
      badge
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
      className="hidden w-70 shrink-0 flex-col gap-6 border-s-[0.5px] border-black-10 p-5 xl:flex"
    >
      {children}
    </aside>
  )
}
