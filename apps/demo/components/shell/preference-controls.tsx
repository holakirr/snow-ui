'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  IconBox,
} from '@holakirr/snow-ui'
import { usePreferences } from '@/app/providers'
import {
  ArrowsLeftRightIcon,
  MoonIcon,
  SunIcon,
  TranslateIcon,
} from '@/components/icons'
import { isLang, isTheme, LANGS, THEMES, type Theme } from '@/lib/preferences'
import { IconButton } from './icon-button'

const THEME_ICONS: Record<Theme, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SunIcon,
}

/** Light / dark / system, stored in localStorage (see `themeScript`). */
export const ThemeMenu = () => {
  const { dict, theme, setTheme } = usePreferences()
  const names: Record<Theme, string> = {
    light: dict.header.themeLight,
    dark: dict.header.themeDark,
    system: dict.header.themeSystem,
  }
  const Icon = THEME_ICONS[theme]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          label={`${dict.header.theme}: ${names[theme]}`}
          icon={<Icon />}
          data-testid="theme-menu"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{dict.header.theme}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) setTheme(value)
          }}
        >
          {THEMES.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {names[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** English / Russian: a cookie set by a Server Action (see `app/actions.ts`). */
export const LanguageMenu = () => {
  const { dict, lang, setLang } = usePreferences()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          label={`${dict.header.language}: ${dict.languages[lang]}`}
          icon={<TranslateIcon />}
          data-testid="language-menu"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{dict.header.language}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(value) => {
            if (isLang(value)) setLang(value)
          }}
        >
          {LANGS.map((value) => (
            <DropdownMenuRadioItem key={value} value={value} lang={value}>
              {dict.languages[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Right-to-left on / off, independent of the language: the demo's way to show
 * the library's RTL support (Russian itself is left-to-right).
 */
export const DirectionToggle = () => {
  const { dict, dir, setDir } = usePreferences()
  const rtl = dir === 'rtl'

  return (
    <Button
      aria-label={dict.header.directionRtl}
      title={dict.header.directionRtl}
      startContent={
        <IconBox size={20}>
          <ArrowsLeftRightIcon />
        </IconBox>
      }
      aria-pressed={rtl}
      data-testid="direction-toggle"
      className={`rounded-12 p-1 ${rtl ? 'bg-black-4' : ''}`}
      onClick={() => setDir(rtl ? 'ltr' : 'rtl')}
    />
  )
}
