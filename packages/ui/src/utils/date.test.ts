import { addDays, isSameDay } from 'date-fns'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { SCHEDULE_CONFIG } from '../constants'
import type { CalendarEvent, StartOfWeek } from '../types'
import {
  getClockHours,
  getDaySegments,
  getEarliestScheduleHour,
  getLatestScheduleHour,
  getScheduleHours,
  getWeekDates,
} from './date'

const makeEvent = (id: string, date: Date, endsAt: Date): CalendarEvent => ({
  id,
  title: `Event ${id}`,
  date,
  endsAt,
})

/** A segment from `start` to `end` hours, for the hour range helpers. */
const segment = (start: number, end: number) => ({ start, end })

describe('getWeekDates', () => {
  const WEEK_STARTS = [0, 1, 2, 3, 4, 5, 6] as const satisfies StartOfWeek[]

  it.each(WEEK_STARTS)(
    'returns the week that contains the date when weeks start on day %i',
    (weekStartsOn) => {
      // Every day of a week, at noon: Sunday, September 27, 2026 to Saturday.
      for (let i = 0; i < 7; i++) {
        const date = new Date(2026, 8, 27 + i, 12)
        const week = getWeekDates(date, weekStartsOn)

        expect(week).toHaveLength(7)
        expect(week[0].getDay()).toBe(weekStartsOn)
        expect(week.some((day) => isSameDay(day, date))).toBe(true)
      }
    },
  )

  it('returns seven consecutive days at midnight', () => {
    const week = getWeekDates(new Date(2026, 8, 29, 10, 37, 12, 345))

    week.forEach((day, i) => {
      expect(day).toEqual(new Date(2026, 8, 28 + i))
    })
  })

  it('starts on Monday by default', () => {
    // A Sunday: its week started six days earlier.
    expect(getWeekDates(new Date(2026, 8, 27))[0]).toEqual(
      new Date(2026, 8, 21),
    )
  })

  it('crosses month and year boundaries', () => {
    expect(getWeekDates(new Date(2025, 11, 31), 1)).toEqual(
      Array.from({ length: 7 }, (_, i) => new Date(2025, 11, 29 + i)),
    )
    expect(getWeekDates(new Date(2026, 1, 28), 0).at(-1)).toEqual(
      new Date(2026, 1, 28),
    )
    expect(getWeekDates(new Date(2026, 2, 1), 1)[0]).toEqual(
      new Date(2026, 1, 23),
    )
  })

  describe('with a daylight saving change (Europe/Berlin)', () => {
    // Node applies a new TZ at once; unstubbing restores (or deletes) it.
    beforeAll(() => {
      vi.stubEnv('TZ', 'Europe/Berlin')
    })

    afterAll(() => {
      vi.unstubAllEnvs()
    })

    it('returns calendar days at midnight around the change', () => {
      // Clocks go forward on Sunday, March 29, 2026 and back on Sunday,
      // October 25, 2026.
      for (const date of [
        new Date(2026, 2, 26, 23, 30),
        new Date(2026, 9, 29, 0, 30),
      ]) {
        const week = getWeekDates(date, 1)
        week.forEach((day, i) => {
          expect(day.getHours()).toBe(0)
          if (i > 0) expect(isSameDay(day, addDays(week[i - 1], 1))).toBe(true)
        })
        expect(week.some((day) => isSameDay(day, date))).toBe(true)
      }
    })
  })
})

describe('getClockHours', () => {
  it('returns the time on the clock in hours', () => {
    expect(getClockHours(new Date(2026, 8, 29))).toBe(0)
    expect(getClockHours(new Date(2026, 8, 29, 9, 30))).toBe(9.5)
    expect(getClockHours(new Date(2026, 8, 29, 23, 45, 36))).toBe(23.76)
  })
})

describe('getDaySegments', () => {
  const day = new Date(2026, 8, 29)

  it('returns the events that start on the day', () => {
    const events = [
      makeEvent('1', new Date(2026, 8, 29, 9, 30), new Date(2026, 8, 29, 11)),
      makeEvent('2', new Date(2026, 8, 28, 9), new Date(2026, 8, 28, 10)),
      makeEvent('3', new Date(2026, 8, 30), new Date(2026, 8, 30, 1)),
    ]
    expect(getDaySegments(events, day)).toEqual([
      { event: events[0], start: 9.5, end: 11 },
    ])
  })

  it('cuts an event at midnight and continues it the next day', () => {
    const events = [
      makeEvent('1', new Date(2026, 8, 29, 22), new Date(2026, 8, 30, 1, 30)),
    ]
    expect(getDaySegments(events, day)).toEqual([
      { event: events[0], start: 22, end: 24 },
    ])
    expect(getDaySegments(events, new Date(2026, 8, 30))).toEqual([
      { event: events[0], start: 0, end: 1.5 },
    ])
  })

  it('covers every day of an event that lasts several days', () => {
    const events = [
      makeEvent('1', new Date(2026, 8, 28, 18), new Date(2026, 8, 30, 9)),
    ]
    expect(getDaySegments(events, day)).toEqual([
      { event: events[0], start: 0, end: 24 },
    ])
  })

  it('leaves an event that ends at midnight on its own day', () => {
    const events = [
      makeEvent('1', new Date(2026, 8, 29, 22), new Date(2026, 8, 30)),
    ]
    expect(getDaySegments(events, day)).toEqual([
      { event: events[0], start: 22, end: 24 },
    ])
    expect(getDaySegments(events, new Date(2026, 8, 30))).toEqual([])
  })

  it('treats an event that ends before it starts as having no duration', () => {
    const events = [
      makeEvent('1', new Date(2026, 8, 29, 9), new Date(2026, 8, 28, 10)),
      makeEvent('2', new Date(2026, 8, 29, 23), new Date(2026, 8, 29, 23)),
    ]
    expect(getDaySegments(events, day)).toEqual([
      { event: events[0], start: 9, end: 9 },
      { event: events[1], start: 23, end: 23 },
    ])
    expect(getDaySegments(events, new Date(2026, 8, 28))).toEqual([])
  })

  it('accepts any time of the day', () => {
    const events = [
      makeEvent('1', new Date(2026, 8, 29, 1), new Date(2026, 8, 29, 2)),
    ]
    expect(getDaySegments(events, new Date(2026, 8, 29, 18))).toHaveLength(1)
  })
})

describe('getEarliestScheduleHour', () => {
  it('returns MIN_HOUR when there are no events', () => {
    expect(getEarliestScheduleHour([])).toBe(SCHEDULE_CONFIG.MIN_HOUR)
  })

  it('returns MIN_HOUR when all events start later', () => {
    expect(getEarliestScheduleHour([segment(10, 11)])).toBe(
      SCHEDULE_CONFIG.MIN_HOUR,
    )
  })

  it('returns the hour the earliest segment starts in', () => {
    expect(
      getEarliestScheduleHour([segment(9, 10), segment(5.5, 6), segment(6, 8)]),
    ).toBe(5)
  })

  it('treats midnight as a valid hour', () => {
    expect(getEarliestScheduleHour([segment(0, 1)])).toBe(0)
  })
})

describe('getLatestScheduleHour', () => {
  it('returns MAX_HOUR when there are no events', () => {
    expect(getLatestScheduleHour([])).toBe(SCHEDULE_CONFIG.MAX_HOUR)
  })

  it('returns MAX_HOUR when all events end earlier', () => {
    expect(getLatestScheduleHour([segment(10, 11.5)])).toBe(
      SCHEDULE_CONFIG.MAX_HOUR,
    )
  })

  it('returns the last hour a segment covers', () => {
    expect(
      getLatestScheduleHour([
        segment(10, 12.5),
        segment(21, 22.5),
        segment(19, 23.5),
      ]),
    ).toBe(23)
  })

  it("doesn't count the hour a segment ends on", () => {
    expect(getLatestScheduleHour([segment(18, 22)])).toBe(21)
    expect(getLatestScheduleHour([segment(22, 24)])).toBe(23)
  })

  it('makes room for the one-hour minimum of a block', () => {
    expect(getLatestScheduleHour([segment(21.5, 21.75)])).toBe(22)
    expect(getLatestScheduleHour([segment(23.5, 23.75)])).toBe(23)
  })
})

describe('getScheduleHours', () => {
  it('includes both the earliest and the latest hour', () => {
    expect(getScheduleHours(7, 10)).toEqual([7, 8, 9, 10])
  })

  it('covers the default range inclusively', () => {
    const hours = getScheduleHours(
      SCHEDULE_CONFIG.MIN_HOUR,
      SCHEDULE_CONFIG.MAX_HOUR,
    )
    expect(hours[0]).toBe(SCHEDULE_CONFIG.MIN_HOUR)
    expect(hours.at(-1)).toBe(SCHEDULE_CONFIG.MAX_HOUR)
    expect(hours).toHaveLength(
      SCHEDULE_CONFIG.MAX_HOUR - SCHEDULE_CONFIG.MIN_HOUR + 1,
    )
  })
})
