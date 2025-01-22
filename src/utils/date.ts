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

type ComparisonFn = (a: Date, b: Date) => boolean

const getScheduleHour = (
  events: CalendarEvent[],
  defaultHour: number,
  compareDate: ComparisonFn,
): number => {
  if (!events.length) {
    return defaultHour
  }

  const eventHour = events
    .reduce((prev, current) => {
      return compareDate(prev.date, current.date) ? prev : current
    })
    .date.getHours()

  if (
    !eventHour ||
    (defaultHour === SCHEDULE_CONFIG.MIN_HOUR
      ? eventHour > defaultHour
      : eventHour < defaultHour)
  ) {
    return defaultHour
  }

  return eventHour
}

export const getEarliestScheduleHour = (events: CalendarEvent[]): number =>
  getScheduleHour(events, SCHEDULE_CONFIG.MIN_HOUR, (a, b) => a < b)

export const getLatestScheduleHour = (events: CalendarEvent[]): number =>
  getScheduleHour(events, SCHEDULE_CONFIG.MAX_HOUR, (a, b) => a > b)
