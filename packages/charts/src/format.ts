/**
 * Formats a data value as text for the tooltip, the legend and the data
 * table. `key` is the series (config key) the value belongs to.
 */
export type ChartValueFormatter = (value: number, key: string) => string

/** Formats an axis tick value (numbers on the value axis, categories on the other). */
export type ChartTickFormatter = (
  value: number | string,
  index: number,
) => string

const cache = new Map<string, Intl.NumberFormat>()

/** A cached `Intl.NumberFormat`: charts format hundreds of values per render. */
export const numberFormat = (
  locale: string,
  options: Intl.NumberFormatOptions = {},
): Intl.NumberFormat => {
  const id = `${locale}|${JSON.stringify(options)}`
  let format = cache.get(id)
  if (!format) {
    try {
      format = new Intl.NumberFormat(locale, options)
    } catch {
      // An invalid locale tag: fall back to English rather than throw.
      format = new Intl.NumberFormat('en-US', options)
    }
    cache.set(id, format)
  }
  return format
}

/** The default value formatter: the locale's number format (`12,345.6`). */
export const formatNumber = (value: number, locale: string): string =>
  numberFormat(locale, { maximumFractionDigits: 2 }).format(value)

/**
 * The default value-axis format: compact numbers, as in the SnowUI
 * dashboards (`0`, `10K`, `20K`, `1.5M`).
 */
export const formatCompact = (value: number, locale: string): string =>
  numberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

/** A percentage of a total, e.g. a donut slice: `52.1%`. */
export const formatPercent = (share: number, locale: string): string =>
  numberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(share)

const dates = new Map<string, Intl.DateTimeFormat>()

/**
 * The default text of a category: dates in the locale's medium date style,
 * in UTC so the server and the browser render the same text; anything else
 * as its string.
 */
export const formatCategory = (value: unknown, locale: string): string => {
  if (!(value instanceof Date)) return value == null ? '' : String(value)
  if (Number.isNaN(value.getTime())) return ''
  let format = dates.get(locale)
  if (!format) {
    const options = { dateStyle: 'medium', timeZone: 'UTC' } as const
    try {
      format = new Intl.DateTimeFormat(locale, options)
    } catch {
      format = new Intl.DateTimeFormat('en-US', options)
    }
    dates.set(locale, format)
  }
  return format.format(value)
}

/** A raw data value as a number, or undefined when it isn't one. */
export const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : undefined
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}
