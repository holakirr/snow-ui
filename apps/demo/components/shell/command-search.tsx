'use client'

import {
  CommandPalette,
  type CommandPaletteGroup,
  IconBox,
  KBD,
  searchStyles,
} from '@holakirr/snow-ui'
import { SearchIcon } from '@holakirr/snow-ui-icons'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { type ComponentProps, useMemo, useSyncExternalStore } from 'react'
import { usePreferences } from '@/app/providers'
import {
  ArrowsLeftRightIcon,
  ChartPieSliceIcon,
  GearSixIcon,
  MoonIcon,
  SignInIcon,
  TranslateIcon,
} from '@/components/icons'

const icon = (Icon: typeof SearchIcon) => (
  <IconBox size={16}>
    <Icon />
  </IconBox>
)

/** ⌘ on Apple platforms, Ctrl elsewhere (the server renders ⌘). */
const useModifierKey = () =>
  useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'),
    () => '⌘',
  )

/** A button drawn as the Figma Search field; it opens the palette. */
const SearchButton = ({
  label,
  ...props
}: ComponentProps<'button'> & { label: string; modifier: string }) => (
  <button
    type="button"
    className={searchStyles({
      // Figma: Black/20% (1.6:1); the label is text, so text-secondary.
      className: 'w-40 cursor-pointer text-secondary',
    })}
    aria-keyshortcuts="Meta+K Control+K"
    {...props}
  >
    <SearchIcon size={16} aria-hidden />
    <span className="flex-1 text-start">{label}</span>
    {/*
     * No fill: KBD's default Black/4% on the Black/4% field takes the
     * text-secondary hint to 4.38:1 in dark mode (Black/4% is 10% there).
     */}
    <KBD
      keys={['/']}
      separator=""
      aria-hidden
      className="inline-flex h-4 items-center rounded-[6px] border-[0.5px] border-black-10 bg-transparent px-1 text-12 text-secondary"
    />
  </button>
)

/**
 * The header search: SnowUI's CommandPalette (the Figma "SearchPopup"),
 * opened by the Search-styled trigger or ⌘K / Ctrl+K from anywhere. It
 * navigates between the pages and runs the header's actions.
 */
export const CommandSearch = () => {
  const router = useRouter()
  const { dict, lang, dir, theme, setLang, setDir, setTheme } = usePreferences()
  const modifier = useModifierKey()

  const groups = useMemo<CommandPaletteGroup[]>(() => {
    const go = (href: Route) => () => router.push(href)
    return [
      {
        id: 'pages',
        heading: dict.header.pagesGroup,
        items: [
          {
            id: 'dashboard',
            label: `${dict.nav.dashboards} · ${dict.nav.default}`,
            icon: icon(ChartPieSliceIcon),
            keywords: ['overview', 'home', 'обзор'],
            onSelect: go('/dashboard'),
          },
          {
            id: 'settings',
            label: dict.nav.settings,
            icon: icon(GearSixIcon),
            keywords: ['profile', 'account', 'профиль'],
            onSelect: go('/settings'),
          },
          {
            id: 'sign-in',
            label: dict.nav.signIn,
            icon: icon(SignInIcon),
            keywords: ['login', 'auth', 'логин'],
            onSelect: go('/sign-in'),
          },
        ],
      },
      {
        id: 'actions',
        heading: dict.header.actionsGroup,
        items: [
          {
            id: 'theme',
            label: dict.header.toggleThemeAction,
            icon: icon(MoonIcon),
            keywords: ['dark', 'light', 'theme', 'тема'],
            onSelect: () => {
              const dark =
                theme === 'dark' ||
                (theme === 'system' &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches)
              setTheme(dark ? 'light' : 'dark')
            },
          },
          {
            id: 'direction',
            label: dict.header.toggleDirectionAction,
            icon: icon(ArrowsLeftRightIcon),
            keywords: ['rtl', 'ltr', 'direction'],
            onSelect: () => setDir(dir === 'rtl' ? 'ltr' : 'rtl'),
          },
          {
            id: 'language',
            label: dict.header.toggleLanguageAction,
            icon: icon(TranslateIcon),
            keywords: ['language', 'english', 'russian', 'язык'],
            onSelect: () => setLang(lang === 'en' ? 'ru' : 'en'),
          },
        ],
      },
    ]
  }, [dict, lang, dir, theme, router, setLang, setDir, setTheme])

  return (
    <CommandPalette
      groups={groups}
      hotkey="mod+k"
      label={dict.header.searchLabel}
      trigger={<SearchButton label={dict.header.search} modifier={modifier} />}
    />
  )
}
