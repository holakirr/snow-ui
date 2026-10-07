'use client'

import {
  type Messages,
  SnowUIProvider,
  Toaster,
  TooltipProvider,
} from '@holakirr/snow-ui'
import type { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { ru } from 'date-fns/locale/ru'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useSyncExternalStore,
  useTransition,
} from 'react'
import { SettingsDataProvider } from '@/components/settings/settings-data'
import { type Dictionary, dictionaries } from '@/lib/i18n/dictionaries'
import { ruMessages } from '@/lib/i18n/snow-messages'
import {
  type Dir,
  isTheme,
  type Lang,
  THEME_STORAGE_KEY,
  type Theme,
} from '@/lib/preferences'
import { setDirection, setLanguage } from './actions'

/*
 * The client side of the app shell. The root layout (a Server Component)
 * passes only strings — the language and the direction from the cookies —
 * and this module picks what can't cross the server/client boundary: the
 * SnowUI messages (functions for strings with values) and the date-fns
 * locale.
 */

const snowUI: Record<Lang, { messages?: Messages; locale: Locale }> = {
  // English: the library's default messages.
  en: { locale: enUS },
  ru: { messages: ruMessages, locale: ru },
}

/* --------------------------------- Theme --------------------------------- */

const THEME_EVENT = 'snow-demo-theme-change'

const readTheme = (): Theme => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

const subscribeTheme = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(readTheme())
      onChange()
    }
  }
  window.addEventListener(THEME_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(THEME_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

/** `data-theme` on `<html>` pins light or dark; without it the OS decides. */
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

const storeTheme = (theme: Theme) => {
  try {
    if (theme === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY)
    else window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode): the theme still applies.
  }
  applyTheme(theme)
  window.dispatchEvent(new Event(THEME_EVENT))
}

/* ------------------------------ Preferences ------------------------------ */

type PreferencesContextValue = {
  lang: Lang
  dir: Dir
  dict: Dictionary
  theme: Theme
  setTheme: (theme: Theme) => void
  setLang: (lang: Lang) => void
  setDir: (dir: Dir) => void
  /** A language or direction change is on its way from the server. */
  pending: boolean
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within <Providers>.')
  }
  return context
}

/** The app's strings in the current language. */
export const useDictionary = () => usePreferences().dict

export const Providers = ({
  lang: serverLang,
  dir: serverDir,
  children,
}: {
  lang: Lang
  dir: Dir
  children: ReactNode
}) => {
  const [pending, startTransition] = useTransition()
  // Switch the client at once; the Server Action then re-renders the route
  // with the new cookie, which confirms the value.
  const [lang, setOptimisticLang] = useOptimistic(serverLang)
  const [dir, setOptimisticDir] = useOptimistic(serverDir)
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => 'system' as const,
  )

  const setLang = useCallback(
    (next: Lang) => {
      startTransition(async () => {
        setOptimisticLang(next)
        document.documentElement.lang = next
        await setLanguage(next)
      })
    },
    [setOptimisticLang],
  )

  const setDir = useCallback(
    (next: Dir) => {
      startTransition(async () => {
        setOptimisticDir(next)
        document.documentElement.dir = next
        await setDirection(next)
      })
    },
    [setOptimisticDir],
  )

  const value = useMemo<PreferencesContextValue>(
    () => ({
      lang,
      dir,
      dict: dictionaries[lang],
      theme,
      setTheme: storeTheme,
      setLang,
      setDir,
      pending,
    }),
    [lang, dir, theme, setLang, setDir, pending],
  )

  const { messages, locale } = snowUI[lang]

  return (
    <PreferencesContext value={value}>
      <SnowUIProvider messages={messages} locale={locale} dir={dir}>
        <TooltipProvider delayDuration={300}>
          <SettingsDataProvider>{children}</SettingsDataProvider>
          <Toaster />
        </TooltipProvider>
      </SnowUIProvider>
    </PreferencesContext>
  )
}
