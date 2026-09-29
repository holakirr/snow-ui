import { ordersNow } from './data'
import { intlLocale, type Lang } from './preferences'

/*
 * Formatting shared by Server and client components. Everything is computed
 * from the fixed demo clock (`ordersNow`) and a fixed time zone, so the server
 * and the browser render the same text.
 */

export const formatNumber = (lang: Lang, value: number) =>
  new Intl.NumberFormat(intlLocale(lang)).format(value)

export const formatChange = (lang: Lang, value: number) =>
  `${new Intl.NumberFormat(intlLocale(lang), {
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`

export const formatCompact = (lang: Lang, value: number) =>
  new Intl.NumberFormat(intlLocale(lang), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

/** Short month names, January = 0. */
export const monthName = (lang: Lang, month: number) =>
  new Intl.DateTimeFormat(intlLocale(lang), {
    month: 'short',
    timeZone: 'UTC',
  }).format(Date.UTC(2026, month, 1))

/** "Just now", "59 minutes ago", "12 hours ago", then the date. */
export const formatAgo = (lang: Lang, minutesAgo: number, justNow: string) => {
  if (minutesAgo < 1) return justNow
  const relative = new Intl.RelativeTimeFormat(intlLocale(lang), {
    numeric: 'auto',
  })
  if (minutesAgo < 60) return relative.format(-minutesAgo, 'minute')
  if (minutesAgo < 60 * 24) {
    return relative.format(-Math.floor(minutesAgo / 60), 'hour')
  }
  if (minutesAgo < 60 * 24 * 2) return relative.format(-1, 'day')
  return new Intl.DateTimeFormat(intlLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(ordersNow - minutesAgo * 60_000)
}
