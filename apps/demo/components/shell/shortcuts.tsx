'use client'

import {
  IconBox,
  IconText,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useSidebar,
} from '@holakirr/snow-ui'
import type { Route } from 'next'
import Link from 'next/link'
import { useDictionary } from '@/app/providers'

type Shortcut = { href?: Route; label: string }

const ShortcutList = ({ items }: { items: Shortcut[] }) => {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ href, label }) => (
        <li key={label}>
          <IconText
            asChild
            interactive={Boolean(href)}
            className="flex gap-1 p-2"
            icon={
              <IconBox size={16} className="text-black-20" aria-hidden>
                <span className="size-1.5! rounded-full bg-current" />
              </IconBox>
            }
          >
            {href ? (
              <Link
                href={href}
                onClick={() => {
                  if (isMobile) setOpenMobile(false)
                }}
              >
                {label}
              </Link>
            ) : (
              <span className="text-14">{label}</span>
            )}
          </IconText>
        </li>
      ))}
    </ul>
  )
}

/** The sidebar's "Favorites / Recently" switch (Figma: two text tabs). */
export const Shortcuts = () => {
  const dict = useDictionary()
  const favorites: Shortcut[] = [
    { href: '/dashboard', label: dict.nav.overview },
    { label: dict.nav.projects },
  ]
  const recent: Shortcut[] = [
    { href: '/sign-in', label: dict.nav.signIn },
    { href: '/dashboard', label: dict.nav.default },
  ]

  return (
    <Tabs defaultValue="favorites" className="flex flex-col gap-1">
      <TabsList
        aria-label={dict.nav.shortcuts}
        className="h-6 justify-start gap-2 px-2"
      >
        <TabsTrigger
          value="favorites"
          className="text-12 text-secondary data-[state=active]:text-secondary [&>span:last-child]:hidden"
        >
          {dict.nav.favorites}
        </TabsTrigger>
        <TabsTrigger
          value="recently"
          className="text-12 text-secondary data-[state=active]:text-secondary [&>span:last-child]:hidden"
        >
          {dict.nav.recently}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="favorites" className="mt-0">
        <ShortcutList items={favorites} />
      </TabsContent>
      <TabsContent value="recently" className="mt-0">
        <ShortcutList items={recent} />
      </TabsContent>
    </Tabs>
  )
}
