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

export type SnowUIProviderProps = {
  /**
   * Translations of the components' built-in strings, merged over the
   * English `defaultMessages` (and over an outer provider's messages): pass
   * a whole `Messages` object or only the namespaces and strings you change.
   */
  messages?: MessagesOverrides
  /**
   * The date-fns locale (or a react-day-picker locale, which adds its own
   * labels) for dates: `Calendar` month and weekday names and day labels,
   * `Scheduler` headers and times. Not the first day of the week: both
   * start on Monday unless you set their `weekStartsOn` / `startOfWeek`.
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
  children?: ReactNode
}

export type SnowUIContextValue = {
  /** Every namespace: the provider's messages over the English defaults. */
  messages: Required<Messages>
  locale?: Locale
  /** Undefined unless a provider sets it, so portals inherit `<html dir>`. */
  dir?: TextDirection
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
    }),
    [parent, messages, locale, dir],
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
 * Everything the nearest `SnowUIProvider` sets: `messages`, `locale` and
 * `dir` (`undefined` when no provider sets them).
 */
export const useSnowUI = (): SnowUIContextValue => useContext(SnowUIContext)
