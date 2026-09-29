export const HOUR_HEIGHT = 48

/** The language of the day and hour labels without a `SnowUIProvider` locale. */
export const DEFAULT_LANG = 'en-US'

/** A 24-hour time, e.g. "09:30" (`2-digit`) or "9:30" (`numeric`). */
export const formatTime = (
  date: Date,
  lang: string,
  hour: '2-digit' | 'numeric' = '2-digit',
): string =>
  date.toLocaleTimeString(lang, { hour, minute: '2-digit', hourCycle: 'h23' })

/**
 * The label of an hour row in the locale's clock, e.g. "9 AM" or "09".
 * Formatted in UTC, which has no daylight saving time, so the label doesn't
 * depend on today's date: on a day the clocks spring forward, the local
 * 2:00 doesn't exist and would read "3 AM".
 */
export const formatHour = (hour: number, lang: string): string =>
  new Date(Date.UTC(2000, 0, 1, hour)).toLocaleTimeString(lang, {
    hour: 'numeric',
    timeZone: 'UTC',
  })
