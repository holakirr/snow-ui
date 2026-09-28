import { SCHEDULE_CONFIG } from '../constants'
import type { CalendarEvent, StartOfWeek } from '../types'

export const getWeekDates = (
  date: Date,
  startOfWeek: StartOfWeek = 1,
): Date[] => {
  const week = []
  const current = new Date(date)
  current.setDate(current.getDate() - current.getDay() + startOfWeek)

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(current)
    dayDate.setDate(current.getDate() + i)
    week.push(dayDate)
  }

  return week
}

const getEventHours = (events: CalendarEvent[]): number[] =>
  events.flatMap(({ date, endsAt }) => [date.getHours(), endsAt.getHours()])

/**
 * Returns the first hour of the schedule grid: the earliest event hour
 * (start or end), but never later than `SCHEDULE_CONFIG.MIN_HOUR`.
 */
export const getEarliestScheduleHour = (events: CalendarEvent[]): number =>
  Math.min(SCHEDULE_CONFIG.MIN_HOUR, ...getEventHours(events))

/**
 * Returns the last hour of the schedule grid (inclusive): the latest event
 * hour (start or end), but never earlier than `SCHEDULE_CONFIG.MAX_HOUR`.
 */
export const getLatestScheduleHour = (events: CalendarEvent[]): number =>
  Math.max(SCHEDULE_CONFIG.MAX_HOUR, ...getEventHours(events))

/**
 * Returns the list of hours rendered by the schedule grid, including both
 * bounds.
 */
export const getScheduleHours = (earliest: number, latest: number): number[] =>
  Array.from({ length: latest - earliest + 1 }, (_, i) => i + earliest)
