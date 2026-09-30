import { describe, expect, it } from 'vitest'
import {
  clearSegment,
  composeDate,
  type DateParts,
  dayPeriodForKey,
  dayPeriodLabels,
  fieldLayout,
  localeHourCycle,
  partsOf,
  segmentValue,
  setSegment,
  stepSegment,
  typeDigit,
} from './segments'

const type = (
  parts: DateParts,
  segment: Parameters<typeof typeDigit>[1],
  digits: string,
  hourCycle: 12 | 24 = 24,
) => {
  let state = { buffer: '', parts, done: false }
  for (const digit of digits) {
    state = typeDigit(state.parts, segment, state.buffer, digit, hourCycle)
  }
  return state
}

describe('date segments', () => {
  it('orders the parts as the locale does', () => {
    expect(fieldLayout('en-US', 12, false)).toEqual({
      date: ['month', 'day', 'year'],
      dateSeparator: '/',
      time: ['hour', 'minute', 'dayPeriod'],
      timeSeparator: ':',
    })
    expect(fieldLayout('ru', 24, true)).toEqual({
      date: ['day', 'month', 'year'],
      dateSeparator: '.',
      time: ['hour', 'minute', 'second'],
      timeSeparator: ':',
    })
    expect(fieldLayout('ja', 24, false).date).toEqual(['year', 'month', 'day'])
  })

  it('takes the hour cycle and AM / PM from the locale', () => {
    expect(localeHourCycle('en-US')).toBe(12)
    expect(localeHourCycle('ru')).toBe(24)
    expect(dayPeriodLabels('en-US')).toEqual(['AM', 'PM'])
    expect(dayPeriodForKey('p', ['AM', 'PM'])).toBe(1)
    expect(dayPeriodForKey('A', ['AM', 'PM'])).toBe(0)
    expect(dayPeriodForKey('x', ['AM', 'PM'])).toBeUndefined()
  })

  it('waits for a second digit only while one could follow', () => {
    expect(type({}, 'month', '1')).toMatchObject({
      buffer: '1',
      parts: { month: 1 },
      done: false,
    })
    expect(type({}, 'month', '12')).toMatchObject({
      parts: { month: 12 },
      done: true,
    })
    expect(type({}, 'month', '3')).toMatchObject({
      parts: { month: 3 },
      done: true,
    })
    // "0" alone isn't a month.
    expect(type({ month: 5 }, 'month', '0')).toMatchObject({
      buffer: '0',
      parts: { month: 5 },
      done: false,
    })
    expect(type({}, 'month', '09').parts.month).toBe(9)
    // 13 can't be a month: the 3 starts over.
    expect(type({}, 'month', '13').parts.month).toBe(3)
    expect(type({}, 'minute', '6')).toMatchObject({
      parts: { minute: 6 },
      done: true,
    })
    expect(type({}, 'minute', '45').parts.minute).toBe(45)
  })

  it('takes four digits for the year', () => {
    const partial = type({ year: 2026 }, 'year', '19')
    expect(partial).toMatchObject({ buffer: '19', done: false })
    expect(partial.parts.year).toBe(2026)
    expect(type({}, 'year', '1999')).toMatchObject({
      parts: { year: 1999 },
      done: true,
    })
  })

  it('keeps the day within the month', () => {
    expect(type({ year: 2026, month: 2 }, 'day', '3')).toMatchObject({
      parts: { day: 3 },
      done: true,
    })
    expect(
      setSegment({ year: 2026, month: 1, day: 31 }, 'month', 2, 24),
    ).toEqual({ year: 2026, month: 2, day: 28 })
  })

  it('switches a typed 13–23 to PM with 12-hour time', () => {
    const pm = type({ hour: 4 }, 'hour', '13', 12)
    expect(pm.parts.hour).toBe(13)
    expect(segmentValue(pm.parts, 'hour', 12)).toBe(1)
    expect(segmentValue(pm.parts, 'dayPeriod', 12)).toBe(1)
    // 1–12 keep the period.
    expect(type({ hour: 15 }, 'hour', '4', 12).parts.hour).toBe(16)
    expect(type({ hour: 3 }, 'hour', '12', 12).parts.hour).toBe(0)
    expect(type({ hour: 15 }, 'hour', '00', 12).parts.hour).toBe(0)
    // "0" waits.
    expect(type({ hour: 9 }, 'hour', '0', 12)).toMatchObject({
      parts: { hour: 9 },
      done: false,
    })
  })

  it('steps with the arrow keys, wrapping around', () => {
    expect(stepSegment({ month: 12 }, 'month', 1, 24).month).toBe(1)
    expect(stepSegment({ minute: 0 }, 'minute', -1, 24).minute).toBe(59)
    expect(stepSegment({ year: 2026 }, 'year', 1, 24).year).toBe(2027)
    // 12 PM → 1 PM, the period stays.
    expect(stepSegment({ hour: 12 }, 'hour', 1, 12).hour).toBe(13)
    expect(stepSegment({ hour: 11 }, 'hour', 1, 12).hour).toBe(0)
    expect(stepSegment({ hour: 4 }, 'dayPeriod', 1, 12).hour).toBe(16)
    // An empty segment starts at its minimum.
    expect(stepSegment({}, 'day', 1, 24).day).toBe(2)
  })

  it('keeps AM / PM when the 12-hour hour is erased', () => {
    const erased = clearSegment({ hour: 16, minute: 8 }, 'hour')
    expect(erased).toEqual({ hour: undefined, minute: 8, period: 1 })
    expect(segmentValue(erased, 'dayPeriod', 12)).toBe(1)
    expect(type(erased, 'hour', '05', 12).parts.hour).toBe(17)
    expect(setSegment(erased, 'hour', 9, 12).hour).toBe(21)
    // AM / PM on an empty hour waits for it; AM / PM itself isn't erased.
    expect(setSegment(erased, 'dayPeriod', 0, 12)).toMatchObject({
      hour: undefined,
      period: 0,
    })
    expect(clearSegment({ hour: 16 }, 'dayPeriod')).toEqual({ hour: 16 })
  })

  it('composes a date only from complete parts', () => {
    const parts = partsOf(new Date(2026, 9, 22, 16, 8, 12))
    expect(composeDate(parts, false, false)).toEqual(new Date(2026, 9, 22))
    expect(composeDate(parts, true, false)).toEqual(
      new Date(2026, 9, 22, 16, 8),
    )
    expect(composeDate(parts, true, true)).toEqual(
      new Date(2026, 9, 22, 16, 8, 12),
    )
    expect(composeDate({ ...parts, day: undefined }, false, false)).toBeNull()
    expect(composeDate({ ...parts, minute: undefined }, true, false)).toBeNull()
    expect(
      composeDate({ year: 26, month: 1, day: 1 }, false, false)?.getFullYear(),
    ).toBe(26)
  })
})
