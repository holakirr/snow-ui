import { getDaysInMonth } from 'date-fns'

/**
 * The editable parts of the date field at the top of the date pickers, as
 * in React Aria's DateField: each is a spinbutton that the arrow keys step
 * and digits fill.
 */
export type DateSegment = 'year' | 'month' | 'day'
export type TimeSegment = 'hour' | 'minute' | 'second' | 'dayPeriod'
export type Segment = DateSegment | TimeSegment

/** 12-hour (with AM / PM) or 24-hour time. */
export type HourCycle = 12 | 24

/**
 * A date while it is typed, part by part (`month` 1–12, `hour` 0–23). A
 * missing part shows the placeholder's value, dimmed.
 */
export type DateParts = Partial<
  Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', number>
>

/** The order of the segments and their separators in a locale. */
export type FieldLayout = {
  date: DateSegment[]
  dateSeparator: string
  time: TimeSegment[]
  timeSeparator: string
}

// Direction marks around the literals of right-to-left locales.
const clean = (text: string | undefined) =>
  text?.replace(/[‎‏؜]/g, '').trim() ?? ''

const layouts = new Map<string, FieldLayout>()

const EN_LAYOUT: FieldLayout = {
  date: ['month', 'day', 'year'],
  dateSeparator: '/',
  time: ['hour', 'minute', 'dayPeriod'],
  timeSeparator: ':',
}

/**
 * The locale's order of the date and time parts and their separators:
 * "10 / 22 / 2026" and "04 : 08 AM" in en-US, "22 . 10 . 2026" and
 * "16 : 08" in ru.
 */
export const fieldLayout = (
  lang: string,
  hourCycle: HourCycle,
  withSeconds: boolean,
): FieldLayout => {
  const key = `${lang}|${hourCycle}|${withSeconds}`
  const cached = layouts.get(key)
  if (cached) return cached
  let layout: FieldLayout
  try {
    const sample = new Date(2026, 9, 22, 16, 8, 12)
    const dateParts = new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(sample)
    const timeParts = new Intl.DateTimeFormat(lang, {
      hour: '2-digit',
      minute: '2-digit',
      second: withSeconds ? '2-digit' : undefined,
      hourCycle: hourCycle === 12 ? 'h12' : 'h23',
    }).formatToParts(sample)
    const date = dateParts
      .map((part) => part.type)
      .filter(
        (type): type is DateSegment =>
          type === 'year' || type === 'month' || type === 'day',
      )
    const time = timeParts
      .map((part) => part.type)
      .filter(
        (type): type is TimeSegment =>
          type === 'hour' ||
          type === 'minute' ||
          type === 'second' ||
          (type === 'dayPeriod' && hourCycle === 12),
      )
    if (hourCycle === 12 && !time.includes('dayPeriod')) time.push('dayPeriod')
    const hourIndex = timeParts.findIndex((part) => part.type === 'hour')
    layout = {
      date: date.length === 3 ? date : EN_LAYOUT.date,
      dateSeparator:
        clean(dateParts.find((part) => part.type === 'literal')?.value) || '/',
      time,
      timeSeparator:
        clean(
          timeParts[hourIndex + 1]?.type === 'literal'
            ? timeParts[hourIndex + 1]?.value
            : undefined,
        ) || ':',
    }
  } catch {
    layout = {
      ...EN_LAYOUT,
      time: [
        'hour',
        'minute',
        ...(withSeconds ? (['second'] as const) : []),
        ...(hourCycle === 12 ? (['dayPeriod'] as const) : []),
      ],
    }
  }
  layouts.set(key, layout)
  return layout
}

/** 12-hour time in the locale (en-US), else 24-hour (ru). */
export const localeHourCycle = (lang: string): HourCycle => {
  try {
    const cycle = new Intl.DateTimeFormat(lang, {
      hour: 'numeric',
    }).resolvedOptions().hourCycle
    return cycle === 'h11' || cycle === 'h12' ? 12 : 24
  } catch {
    return 12
  }
}

/** The locale's AM and PM, e.g. ["AM", "PM"]. */
export const dayPeriodLabels = (lang: string): [string, string] => {
  const label = (hour: number) => {
    try {
      return new Intl.DateTimeFormat(lang, {
        hour: 'numeric',
        hourCycle: 'h12',
      })
        .formatToParts(new Date(2026, 0, 1, hour))
        .find((part) => part.type === 'dayPeriod')?.value
    } catch {
      return undefined
    }
  }
  return [label(4) ?? 'AM', label(16) ?? 'PM']
}

const daysIn = (year: number | undefined, month: number | undefined) =>
  year && month ? getDaysInMonth(new Date(year, month - 1, 1)) : 31

/** The smallest and the largest value of a segment, in its own terms. */
export const segmentRange = (
  segment: Segment,
  parts: DateParts,
  hourCycle: HourCycle,
): [number, number] => {
  switch (segment) {
    case 'year':
      return [1, 9999]
    case 'month':
      return [1, 12]
    case 'day':
      return [1, daysIn(parts.year, parts.month)]
    case 'hour':
      return hourCycle === 12 ? [1, 12] : [0, 23]
    case 'dayPeriod':
      return [0, 1]
    default:
      return [0, 59]
  }
}

/**
 * A segment's value in its own terms (the 12-hour hour, 0 for AM and 1 for
 * PM), or `undefined` while it is empty.
 */
export const segmentValue = (
  parts: DateParts,
  segment: Segment,
  hourCycle: HourCycle,
): number | undefined => {
  if (segment === 'dayPeriod') {
    return parts.hour === undefined ? undefined : parts.hour >= 12 ? 1 : 0
  }
  if (segment === 'hour' && hourCycle === 12 && parts.hour !== undefined) {
    return parts.hour % 12 || 12
  }
  return parts[segment]
}

/** Sets a segment from a value in its own terms; the day follows the month. */
export const setSegment = (
  parts: DateParts,
  segment: Segment,
  value: number,
  hourCycle: HourCycle,
): DateParts => {
  let next: DateParts
  if (segment === 'dayPeriod') {
    const hour = parts.hour ?? 0
    next = { ...parts, hour: (hour % 12) + (value ? 12 : 0) }
  } else if (segment === 'hour' && hourCycle === 12) {
    const pm = (parts.hour ?? 0) >= 12
    next = { ...parts, hour: (value % 12) + (pm ? 12 : 0) }
  } else {
    next = { ...parts, [segment]: value }
  }
  if (next.day !== undefined && next.year && next.month) {
    next.day = Math.min(next.day, daysIn(next.year, next.month))
  }
  return next
}

/**
 * The arrow keys: one step up or down, wrapping around (the year doesn't
 * wrap). An empty segment takes the placeholder's value first.
 */
export const stepSegment = (
  parts: DateParts,
  segment: Segment,
  delta: number,
  hourCycle: HourCycle,
): DateParts => {
  const [min, max] = segmentRange(segment, parts, hourCycle)
  const current = segmentValue(parts, segment, hourCycle) ?? min
  if (segment === 'year') {
    return setSegment(
      parts,
      segment,
      Math.min(Math.max(current + delta, min), max),
      hourCycle,
    )
  }
  const span = max - min + 1
  const next = ((((current - min + delta) % span) + span) % span) + min
  return setSegment(parts, segment, next, hourCycle)
}

type Typed = {
  /** The digits typed into the segment so far. */
  buffer: string
  parts: DateParts
  /** The segment is full: the focus moves to the next one. */
  done: boolean
}

/**
 * A digit typed into a segment. Two-digit segments wait for a second digit
 * while one could follow ("1" in a month could become 10–12), the year
 * takes four. With 12-hour time, 13–23 switch to PM ("13" is 01 PM).
 */
export const typeDigit = (
  parts: DateParts,
  segment: Segment,
  buffer: string,
  digit: string,
  hourCycle: HourCycle,
): Typed => {
  if (segment === 'dayPeriod') return { buffer: '', parts, done: false }
  if (segment === 'year') {
    const text = buffer.length >= 4 ? digit : buffer + digit
    const done = text.length === 4
    return {
      buffer: done ? '' : text,
      parts: done ? setSegment(parts, 'year', Number(text), hourCycle) : parts,
      done,
    }
  }
  // A 12-hour hour takes 0–23 too.
  const max =
    segment === 'hour' ? 23 : segmentRange(segment, parts, hourCycle)[1]
  let text = buffer + digit
  if (text.length > 2 || Number(text) > max) text = digit
  const value = Number(text)
  const done = text.length === 2 || value * 10 > max
  // A leading 0 waits for the second digit (a 12-hour "0" too: 01–09).
  const min =
    segment === 'month' ||
    segment === 'day' ||
    (segment === 'hour' && hourCycle === 12 && text === '0')
      ? 1
      : 0
  if (value < min) return { buffer: text, parts, done: false }
  let next: DateParts
  if (segment === 'hour' && hourCycle === 12) {
    const pm = (parts.hour ?? 0) >= 12
    next = {
      ...parts,
      hour:
        value > 12
          ? value
          : value === 12
            ? pm
              ? 12
              : 0
            : value + (pm ? 12 : 0),
    }
    // "00" is midnight: 12 AM.
    if (text === '00') next.hour = 0
  } else {
    next = setSegment(parts, segment, value, hourCycle)
  }
  return { buffer: done ? '' : text, parts: next, done }
}

/** Whether a key picks AM or PM: the first letter of the locale's label. */
export const dayPeriodForKey = (
  key: string,
  labels: [string, string],
): 0 | 1 | undefined => {
  const lower = key.toLowerCase()
  if (lower.length !== 1) return undefined
  if (labels[0].toLowerCase().startsWith(lower) || lower === 'a') return 0
  if (labels[1].toLowerCase().startsWith(lower) || lower === 'p') return 1
  return undefined
}

/** A date's parts. */
export const partsOf = (date: Date): Required<DateParts> => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
})

/**
 * The date of complete parts, or `null` while one is missing. Without
 * time, the date is at midnight; without seconds, at the full minute.
 */
export const composeDate = (
  parts: DateParts,
  withTime: boolean,
  withSeconds: boolean,
): Date | null => {
  const { year, month, day } = parts
  if (!year || !month || !day) return null
  if (
    withTime &&
    (parts.hour === undefined ||
      parts.minute === undefined ||
      (withSeconds && parts.second === undefined))
  ) {
    return null
  }
  const date = new Date(
    year,
    month - 1,
    day,
    withTime ? (parts.hour ?? 0) : 0,
    withTime ? (parts.minute ?? 0) : 0,
    withTime && withSeconds ? (parts.second ?? 0) : 0,
  )
  // `new Date` maps 0–99 to 1900–1999.
  date.setFullYear(year, month - 1, day)
  return date
}

/** A segment's text: two digits (the year four), or AM / PM. */
export const segmentText = (
  segment: Segment,
  value: number,
  periods: [string, string],
): string => {
  if (segment === 'dayPeriod') return periods[value ? 1 : 0]
  return String(value).padStart(segment === 'year' ? 4 : 2, '0')
}
