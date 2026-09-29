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
