'use client'

import { useSnowUI } from '@holakirr/snow-ui'
import {
  createContext,
  type RefObject,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import type { ChartConfig } from './config'
import { type ChartValueFormatter, formatNumber } from './format'

/** The text direction of a chart. */
export type ChartDirection = 'ltr' | 'rtl'

export interface ChartContextValue {
  config: ChartConfig
  /** BCP 47 language tag used to format numbers. */
  locale: string
  dir: ChartDirection
  /** Formats a value of a series as text (the chart's `valueFormatter`). */
  formatValue: (value: number, key: string) => string
  /** Formats a category (an x-axis value) as text (`categoryFormatter`). */
  formatCategory: (value: unknown) => string
  /**
   * Announces text through the chart's live region, if the chart has focus
   * (keyboard navigation between data points).
   */
  announce: (text: string) => void
}

const ChartContext = createContext<ChartContextValue | null>(null)

export const ChartContextProvider = ChartContext.Provider

/** The nearest `ChartContainer`'s config, locale, direction and formatters. */
export const useChart = (): ChartContextValue | null => useContext(ChartContext)

/**
 * The locale for numbers: the `locale` prop, else the language of the nearest
 * `SnowUIProvider` (its date-fns locale's `code`), else `en-US`, so the server
 * and the browser render the same text.
 */
export const useChartLocale = (localeProp?: string): string => {
  const { locale } = useSnowUI()
  return localeProp ?? locale?.code ?? 'en-US'
}

/**
 * The text direction: the `dir` prop, else the nearest `SnowUIProvider`'s,
 * else the computed `direction` of the chart's element (`<html dir="rtl">` or
 * any `dir` ancestor), read before paint.
 */
export const useChartDirection = (
  ref: RefObject<HTMLElement | null>,
  dirProp?: ChartDirection,
): ChartDirection => {
  const { dir: providerDir } = useSnowUI()
  const [domDir, setDomDir] = useState<ChartDirection>('ltr')
  const explicit = dirProp ?? providerDir

  // No dependency list: the document direction can change without a render
  // of ours (a `dir` toggle higher up), so it is re-read on every render;
  // setting the same value doesn't re-render.
  useLayoutEffect(() => {
    if (explicit || !ref.current) return
    setDomDir(getComputedStyle(ref.current).direction === 'rtl' ? 'rtl' : 'ltr')
  })

  return explicit ?? domDir
}

/** Builds the value formatter of a chart from its props and locale. */
export const createFormatValue =
  (locale: string, valueFormatter?: ChartValueFormatter) =>
  (value: number, key: string): string =>
    valueFormatter ? valueFormatter(value, key) : formatNumber(value, locale)
