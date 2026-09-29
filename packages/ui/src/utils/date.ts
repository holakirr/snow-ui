import { addDays, max, startOfDay, startOfWeek } from 'date-fns'
import { SCHEDULE_CONFIG } from '../constants'
import type { CalendarEvent, StartOfWeek } from '../types'

/**
 * Returns the seven days, at midnight, of the week that contains `date`,
 * starting on `weekStartsOn` (0 for Sunday … 6 for Saturday).
 */
export const getWeekDates = (
  date: Date,
  weekStartsOn: StartOfWeek = 1,
): Date[] => {
  const firstDay = startOfWeek(date, { weekStartsOn })
  return Array.from({ length: 7 }, (_, i) => addDays(firstDay, i))
}

/**
 * The time of `date` in hours on the clock since its midnight: 9:30 is 9.5.
 * Wall-clock time, so a day with a daylight saving change still runs from 0
 * to 24 and matches the hour labels of the schedule grid.
 */
export const getClockHours = (date: Date): number =>
  date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600

/**
 * The part of an event on one day of the schedule, in clock hours since
 * midnight (see `getClockHours`).
 */
export type ScheduleSegment = {
  event: CalendarEvent
  /** Where the event starts on this day: 0 if it started on an earlier day. */
  start: number
  /** Where it ends on this day: 24 if it runs past midnight. */
  end: number
}

/**
 * Returns the parts of `events` on `day`: the events that start on it, and
 * the rest of those that started earlier and run past its midnight. An event
 * that ends at midnight belongs to the day before; one that ends before it
 * starts is treated as having no duration.
 */
export const getDaySegments = (
  events: CalendarEvent[],
  day: Date,
): ScheduleSegment[] => {
  const dayStart = startOfDay(day)
  const dayEnd = addDays(dayStart, 1)

  return events.flatMap((event) => {
    const { date } = event
    const endsAt = max([date, event.endsAt])
    const startsToday = date >= dayStart && date < dayEnd
    const continuesToday = date < dayStart && endsAt > dayStart
    if (!startsToday && !continuesToday) return []

    const start = startsToday ? getClockHours(date) : 0
    const end = endsAt >= dayEnd ? 24 : getClockHours(endsAt)
    // When clocks fall back, a later time can read earlier on the clock.
    return [{ event, start, end: Math.max(start, end) }]
  })
}

/**
 * Returns the first hour of the schedule grid: the hour the earliest segment
 * starts in, but never later than `SCHEDULE_CONFIG.MIN_HOUR`.
 */
export const getEarliestScheduleHour = (
  segments: Pick<ScheduleSegment, 'start'>[],
): number =>
  Math.min(
    SCHEDULE_CONFIG.MIN_HOUR,
    ...segments.map(({ start }) => Math.floor(start)),
  )

/**
 * Returns the last hour of the schedule grid (inclusive): the last hour a
 * segment covers, but never earlier than `SCHEDULE_CONFIG.MAX_HOUR`. A
 * segment that ends on the hour doesn't cover that hour, and an event block
 * is at least an hour tall.
 */
export const getLatestScheduleHour = (
  segments: Pick<ScheduleSegment, 'start' | 'end'>[],
): number =>
  Math.max(
    SCHEDULE_CONFIG.MAX_HOUR,
    ...segments.map(({ start, end }) =>
      Math.min(23, Math.ceil(Math.max(end, start + 1)) - 1),
    ),
  )

/**
 * Returns the list of hours rendered by the schedule grid, including both
 * bounds.
 */
export const getScheduleHours = (earliest: number, latest: number): number[] =>
  Array.from({ length: latest - earliest + 1 }, (_, i) => i + earliest)
