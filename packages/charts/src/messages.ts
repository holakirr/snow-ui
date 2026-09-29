'use client'

import { type Messages, useSnowUI } from '@holakirr/snow-ui'

/**
 * The charts' built-in strings: `messages.charts` of `SnowUIProvider`. Each
 * has a prop that wins over it (`emptyMessage`, `loadingLabel`,
 * `keyboardHint`, `navigationLabel`, `valueLabel`, `categoryLabel`).
 */
export interface ChartMessages {
  /** Shown instead of a chart without data. */
  empty: string
  /** Announced while a chart loads. */
  loading: string
  /** How to move between data points with the keyboard (screen readers). */
  keyboardHint: string
  /** The name of a chart's focusable plot. */
  navigation: string
  /** Header of the value column of `DonutChart`'s and `Sparkline`'s tables. */
  value: string
  /** Header of the first column of `Sparkline`'s table. */
  point: string
}

/** The English strings, for `@holakirr/snow-ui` 5.0 (before `messages.charts`). */
const defaultChartMessages: ChartMessages = {
  empty: 'No data',
  loading: 'Loading chart',
  keyboardHint:
    'Use the left and right arrow keys to move between data points.',
  navigation: 'Data points',
  value: 'Value',
  point: 'Point',
}

/**
 * The charts' strings from the nearest `SnowUIProvider` (its `messages.charts`
 * over the English defaults), or the English defaults with a
 * `@holakirr/snow-ui` older than 5.1.
 */
export const useChartMessages = (): ChartMessages =>
  (useSnowUI().messages as Messages).charts ?? defaultChartMessages
