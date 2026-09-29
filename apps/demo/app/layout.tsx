import '@holakirr/snow-ui/fonts.css'
import './globals.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { getRequestPreferences } from '@/lib/i18n/server'
import { themeScript } from '@/lib/preferences'
import { Providers } from './providers'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return {
    title: { default: dict.meta.title, template: `%s · ${dict.meta.title}` },
    description: dict.meta.description,
  }
}

export const viewport: Viewport = {
  // The SnowUI tokens follow the OS preference unless the theme is pinned.
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#333333' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const { lang, dir } = await getRequestPreferences()

  return (
    // The theme script sets `data-theme` before hydration, and the client
    // updates `lang` / `dir` optimistically: attribute differences on <html>
    // are expected.
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a constant script, the documented way to apply a stored theme before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers lang={lang} dir={dir}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
