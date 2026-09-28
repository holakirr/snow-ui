import { describe, expect, it } from 'vitest'

import { SCHEDULE_CONFIG } from '../constants'
import type { CalendarEvent } from '../types'
import {
  getEarliestScheduleHour,
  getLatestScheduleHour,
  getScheduleHours,
} from './date'

const makeEvent = (
  id: string,
  startHour: number,
  endHour: number,
  day = 1,
): CalendarEvent => ({
  id,
  title: `Event ${id}`,
  date: new Date(2024, 0, day, startHour, 0),
  endsAt: new Date(2024, 0, day, endHour, 30),
})

describe('getEarliestScheduleHour', () => {
  it('returns MIN_HOUR when there are no events', () => {
    expect(getEarliestScheduleHour([])).toBe(SCHEDULE_CONFIG.MIN_HOUR)
  })

  it('returns MIN_HOUR when all events start later', () => {
    expect(getEarliestScheduleHour([makeEvent('1', 10, 11)])).toBe(
      SCHEDULE_CONFIG.MIN_HOUR,
    )
  })

  it('returns the minimum event hour, regardless of event dates', () => {
    const events = [
      // Earlier date, but later hour
      makeEvent('1', 9, 10, 1),
      // Later date, but earliest hour
      makeEvent('2', 5, 6, 3),
      makeEvent('3', 6, 8, 2),
    ]
    expect(getEarliestScheduleHour(events)).toBe(5)
  })

  it('treats midnight as a valid hour', () => {
    expect(getEarliestScheduleHour([makeEvent('1', 0, 1)])).toBe(0)
  })
})

describe('getLatestScheduleHour', () => {
  it('returns MAX_HOUR when there are no events', () => {
    expect(getLatestScheduleHour([])).toBe(SCHEDULE_CONFIG.MAX_HOUR)
  })

  it('returns MAX_HOUR when all events end earlier', () => {
    expect(getLatestScheduleHour([makeEvent('1', 10, 11)])).toBe(
      SCHEDULE_CONFIG.MAX_HOUR,
    )
  })

  it('takes the end hour of events into account', () => {
    const events = [
      // Latest date, but earlier hours
      makeEvent('1', 10, 12, 5),
      makeEvent('2', 21, 22, 1),
      makeEvent('3', 19, 23, 2),
    ]
    expect(getLatestScheduleHour(events)).toBe(23)
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
