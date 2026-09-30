'use client'

import { DirectionProvider, useDirection } from '@radix-ui/react-direction'
import type { Locale } from 'date-fns'
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  defaultMessages,
  type Messages,
  type MessagesOverrides,
  mergeMessages,
  sameOverrides,
} from './messages'

/** The text direction: left-to-right or right-to-left. */
export type TextDirection = 'ltr' | 'rtl'

/** A SnowUI colour theme: the `data-theme` values of `theme.css`. */
export type SnowUITheme = 'light' | 'dark'

/**
 * A contrast level: the `data-contrast` values of `theme.css` (`more`, the
 * high-contrast control borders and placeholders; `standard`, the Figma
 * look).
 */
export type SnowUIContrast = 'standard' | 'more'

export type SnowUIProviderProps = {
  /**
   * Translations of the components' built-in strings, merged over the
   * English `defaultMessages` (and over an outer provider's messages): pass
   * a whole `Messages` object or only the namespaces and strings you change.
   */
  messages?: MessagesOverrides
  /**
   * The date-fns locale (or a react-day-picker locale, which adds its own
   * labels) for dates: `Calendar` (and `DatePicker`, `DateRangePicker`)
   * month and weekday names, day labels and the first day of the week
   * (unless their `weekStartsOn` is set), and `Scheduler` headers, times
   * and first day of the week (unless its `startOfWeek` is set).
   * @default enUS (date-fns)
   */
  locale?: Locale
  /**
   * The text direction. Radix-based components follow it for keyboard
   * navigation (Tabs, Slider, menus, RadioGroup, ToggleGroup, Accordion),
   * `Calendar` for its arrow keys, `Sheet` and `Sidebar` for their `start` /
   * `end` sides, and portalled content (dialogs, popovers, menus, tooltips)
   * gets it as its `dir` attribute. Set the same `dir` on `<html>` (or on the
   * element you scope it to): the layout and the `rtl:` styles follow the
   * DOM, not the provider.
   * @default inherited, else "ltr"
   */
  dir?: TextDirection
  /**
   * The theme of portalled content (dialogs, sheets, popovers, menus,
   * selects, comboboxes, date pickers, tooltips, the command palette): it
   * renders at the end of `<body>`, outside a `data-theme` scope, and gets
   * this as its `data-theme`. Set the same `data-theme` on the element you
   * scope it to, or use `ThemeScope`, which does both.
   * @default inherited, else none (portals take the theme of `<html>`)
   */
  theme?: SnowUITheme
  /**
   * The contrast level of portalled content, like `theme`: it gets this as
   * its `data-contrast`. Set the same `data-contrast` on the element you
   * scope it to, or use `ThemeScope`, which does both.
   * @default inherited, else none (portals take the contrast of `<html>` and the OS)
   */
  contrast?: SnowUIContrast
  children?: ReactNode
}

export type SnowUIContextValue = {
  /** Every namespace: the provider's messages over the English defaults. */
  messages: Required<Messages>
  locale?: Locale
  /** Undefined unless a provider sets it, so portals inherit `<html dir>`. */
  dir?: TextDirection
  /**
   * Undefined unless a provider (or a `ThemeScope`) sets it, so portals
   * inherit `<html data-theme>`.
   */
  theme?: SnowUITheme
  /** Like `theme`, for `data-contrast`. */
  contrast?: SnowUIContrast
}

const SnowUIContext = createContext<SnowUIContextValue>({
  messages: defaultMessages,
})

/**
 * Localizes the components and sets their text direction. Optional: without
 * it, the components use the English `defaultMessages`, date-fns' `enUS` and
 * left-to-right keyboard navigation. Providers nest: an inner one overrides
 * the outer one's messages, locale and direction for its subtree.
 *
 * It is a client component, and date-fns locales and function messages
 * can't be passed from a React Server Component: render it in a
 * `'use client'` module that imports them (see the README).
 *
 * Define `messages` outside the component (or memoize it): an equal inline
 * object is recognised, but inline function messages are new on every
 * render and re-render every component that reads the messages.
 *
 * @example
 * 'use client'
 * import { ar } from 'react-day-picker/locale'
 * import { arMessages } from './messages'
 *
 * export const Providers = ({ children }: { children: ReactNode }) => (
 *   <SnowUIProvider dir="rtl" locale={ar} messages={arMessages}>
 *     {children}
 *   </SnowUIProvider>
 * )
 */
export const SnowUIProvider = ({
  messages: messagesProp,
  locale,
  dir,
  theme,
  contrast,
  children,
}: SnowUIProviderProps) => {
  const parent = useContext(SnowUIContext)
  // Keeps an outer Radix `DirectionProvider` when no `dir` is set here.
  const radixDir = useDirection()

  // An equal `messages` object (e.g. written inline) keeps the previous one,
  // so the context value, and every consumer, stays the same.
  const [messages, setMessages] = useState(messagesProp)
  if (!sameOverrides(messages, messagesProp)) setMessages(messagesProp)

  const value = useMemo<SnowUIContextValue>(
    () => ({
      messages: mergeMessages(parent.messages, messages),
      locale: locale ?? parent.locale,
      dir: dir ?? parent.dir,
      theme: theme ?? parent.theme,
      contrast: contrast ?? parent.contrast,
    }),
    [parent, messages, locale, dir, theme, contrast],
  )

  return (
    <SnowUIContext.Provider value={value}>
      <DirectionProvider dir={value.dir ?? radixDir}>
        {children}
      </DirectionProvider>
    </SnowUIContext.Provider>
  )
}
SnowUIProvider.displayName = 'SnowUIProvider'

/**
 * The messages of the nearest `SnowUIProvider` (the English
 * `defaultMessages` without one). Use it to localize your own components
 * together with the library's.
 */
export const useMessages = (): Required<Messages> =>
  useContext(SnowUIContext).messages

/**
 * Everything the nearest `SnowUIProvider` sets: `messages`, `locale`, `dir`
 * `theme` and `contrast` (`undefined` when no provider sets them).
 */
export const useSnowUI = (): SnowUIContextValue => useContext(SnowUIContext)
