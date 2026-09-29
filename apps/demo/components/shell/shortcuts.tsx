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

type Shortcut = { href: Route; label: string }

const ShortcutList = ({ items }: { items: Shortcut[] }) => {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ href, label }) => (
        <li key={label}>
          <IconText
            asChild
            interactive
            className="flex"
            icon={
              <IconBox size={16} className="text-black-20" aria-hidden>
                <span className="size-1.5! rounded-full bg-current" />
              </IconBox>
            }
          >
            <Link
              href={href}
              onClick={() => {
                if (isMobile) setOpenMobile(false)
              }}
            >
              {label}
            </Link>
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
    { href: '/settings', label: dict.nav.settings },
  ]
  const recent: Shortcut[] = [
    { href: '/sign-in', label: dict.nav.signIn },
    { href: '/dashboard', label: dict.nav.default },
  ]

  return (
    <Tabs defaultValue="favorites" className="flex flex-col gap-1">
      <TabsList
        aria-label={dict.nav.shortcuts}
        className="justify-start gap-2 px-2"
      >
        <TabsTrigger value="favorites">{dict.nav.favorites}</TabsTrigger>
        <TabsTrigger value="recently">{dict.nav.recently}</TabsTrigger>
      </TabsList>
      <TabsContent value="favorites">
        <ShortcutList items={favorites} />
      </TabsContent>
      <TabsContent value="recently">
        <ShortcutList items={recent} />
      </TabsContent>
    </Tabs>
  )
}
