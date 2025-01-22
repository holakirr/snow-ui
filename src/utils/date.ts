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

const minimalScheduleHour = 7
const maximalScheduleHour = 20

export const getEarliestScheduleHour = (events: CalendarEvent[]): number => {
  if (!events.length) {
    return minimalScheduleHour
  }

  const earliestEventHour = events
    .reduce((prev, current) => {
      return prev.date < current.date ? prev : current
    })
    .date.getHours()

  if (earliestEventHour > minimalScheduleHour || !earliestEventHour) {
    return minimalScheduleHour
  }

  return earliestEventHour
}

export const getLatestScheduleHour = (events: CalendarEvent[]): number => {
  if (!events.length) {
    return maximalScheduleHour
  }

  const latestEventHour = events
    .reduce((prev, current) => {
      return prev.date > current.date ? prev : current
    })
    .date.getHours()

  if (latestEventHour < maximalScheduleHour || !latestEventHour) {
    return maximalScheduleHour
  }

  return latestEventHour
}
