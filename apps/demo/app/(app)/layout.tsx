import { SidebarProvider } from '@holakirr/snow-ui'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'
import { AppHeader } from '@/components/shell/app-header'
import { AppSidebar } from '@/components/shell/app-sidebar'
import { RightPanel, RightPanelProvider } from '@/components/shell/right-panel'
import { RightPanelContent } from '@/components/shell/right-panel-content'
import { getRequestPreferences } from '@/lib/i18n/server'

/**
 * `SidebarProvider` remembers the open state in this cookie and reads it in
 * its initial state on the client. Reading it here too, for `defaultOpen`,
 * makes the server render the same state (otherwise a collapsed sidebar
 * would hydrate with a mismatch). The library doesn't export the name.
 */
const SIDEBAR_COOKIE = 'sidebar:state'

/** The dashboard layout of the Figma kit: sidebar, header, content, right sidebar. */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const [{ lang, dict }, store] = await Promise.all([
    getRequestPreferences(),
    cookies(),
  ])
  const defaultOpen = store.get(SIDEBAR_COOKIE)?.value !== 'false'

  return (
    <RightPanelProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <a
          href="#content"
          className="sr-only z-50 rounded-12 bg-background-1 px-3 py-2 text-14 focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus-ring"
        >
          {dict.app.skipToContent}
        </a>
        <AppSidebar dict={dict} />
        <div className="flex min-w-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader dict={dict} />
            <main id="content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
          </div>
          <RightPanel label={dict.panel.label}>
            <RightPanelContent dict={dict} lang={lang} />
          </RightPanel>
        </div>
      </SidebarProvider>
    </RightPanelProvider>
  )
}
