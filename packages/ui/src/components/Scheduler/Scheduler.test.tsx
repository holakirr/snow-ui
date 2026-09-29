import { fireEvent, render, screen } from '@testing-library/react'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { CalendarEvent } from '../../types'
import { HOUR_HEIGHT } from './constants'
import { Scheduler, type SchedulerProps } from './Scheduler'

const renderScheduler = (props: Partial<SchedulerProps> = {}) => {
  const onDateClick = vi.fn()
  const onEventClick = vi.fn()
  render(
    <Scheduler
      currentDate={new Date(2026, 8, 29, 10, 37, 12, 345)}
      onDateClick={onDateClick}
      onEventClick={onEventClick}
      {...props}
    />,
  )
  return { onDateClick, onEventClick }
}

/** The hour cells, in DOM order (row by row). */
const getCells = () =>
  screen
    .getAllByRole('button')
    .filter((button) => button.hasAttribute('aria-label'))

/** The day of every column, from the first row of cells ("9/28/2026"). */
const getDays = () =>
  getCells()
    .slice(0, 7)
    .map((cell) => cell.getAttribute('aria-label')?.split(',')[0])

/** The hour labels of the rows ("7 AM"…), with a regular space. */
const getHourLabels = () =>
  Array.from(
    screen.getByText(/^7\sAM$/).parentElement?.children ?? [],
    (child) => child.textContent ?? '',
  )
    .filter((text) => /^\d+\s[AP]M$/.test(text))
    .map((text) => text.replace(/\s/, ' '))

/** The blocks rendered for an event (one per day it covers). */
const getEventBlocks = (title: string) =>
  screen
    .getAllByText(title)
    .map((node) => node.closest<HTMLElement>('[role="button"]'))

/** The hour cell (its button) an event block is placed in. */
const cellOf = (block: HTMLElement | null | undefined) =>
  block?.parentElement?.querySelector(':scope > button')

const event = (
  id: string,
  date: Date,
  endsAt: Date,
  title = `Event ${id}`,
): CalendarEvent => ({ id, title, date, endsAt })

describe('Scheduler', () => {
  describe('week', () => {
    it('starts on Monday by default and shows the week of currentDate', () => {
      renderScheduler()
      expect(getDays()).toEqual([
        '9/28/2026',
        '9/29/2026',
        '9/30/2026',
        '10/1/2026',
        '10/2/2026',
        '10/3/2026',
        '10/4/2026',
      ])
    })

    it('shows the week that contains a Sunday when weeks start on Monday', () => {
      renderScheduler({ currentDate: new Date(2026, 8, 27, 12) })
      expect(getDays()[0]).toBe('9/21/2026')
      expect(getDays()[6]).toBe('9/27/2026')
    })

    it('shows the week that contains currentDate for any startOfWeek', () => {
      // Wednesday, September 30: the week starting on Saturday began on the
      // 26th and runs into October.
      renderScheduler({
        currentDate: new Date(2026, 8, 30, 12),
        startOfWeek: 6,
      })
      expect(getDays()).toEqual([
        '9/26/2026',
        '9/27/2026',
        '9/28/2026',
        '9/29/2026',
        '9/30/2026',
        '10/1/2026',
        '10/2/2026',
      ])
    })

    it('crosses the year boundary', () => {
      renderScheduler({ currentDate: new Date(2026, 0, 1) })
      expect(getDays()).toEqual([
        '12/29/2025',
        '12/30/2025',
        '12/31/2025',
        '1/1/2026',
        '1/2/2026',
        '1/3/2026',
        '1/4/2026',
      ])
    })
  })

  describe('hour cells', () => {
    it("calls onDateClick with the cell's hour, whatever the time of currentDate", () => {
      const { onDateClick } = renderScheduler()
      const cell = getCells().find((c) =>
        /^9\/29\/2026, 9:00:00\sAM$/.test(c.getAttribute('aria-label') ?? ''),
      )
      expect(cell).toBeDefined()

      fireEvent.click(cell as HTMLElement)
      expect(onDateClick).toHaveBeenCalledWith(new Date(2026, 8, 29, 9))
    })

    it('are native buttons next to the events, not around them', () => {
      renderScheduler({
        events: [
          event(
            '1',
            new Date(2026, 8, 29, 9),
            new Date(2026, 8, 29, 10),
            'Standup',
          ),
        ],
      })

      // Enter and Space come with the <button>.
      for (const cell of getCells()) {
        expect(cell.tagName).toBe('BUTTON')
        expect(cell).toHaveAttribute('type', 'button')
        expect(cell).toBeEmptyDOMElement()
      }
      // A control inside a button isn't exposed to assistive technology.
      const [block] = getEventBlocks('Standup')
      expect(block?.closest('button')).toBeNull()
    })
  })

  describe('hour range', () => {
    it('shows 7 AM to 8 PM without events', () => {
      renderScheduler()
      const hours = getHourLabels()
      expect(hours[0]).toBe('7 AM')
      expect(hours.at(-1)).toBe('8 PM')
      expect(hours).toHaveLength(14)
    })

    it('adds no row for an event that ends on the hour', () => {
      renderScheduler({
        events: [
          event('1', new Date(2026, 8, 29, 18), new Date(2026, 8, 29, 21)),
        ],
      })
      expect(getHourLabels().at(-1)).toBe('8 PM')
    })

    it('adds the rows an event needs', () => {
      renderScheduler({
        events: [
          event('1', new Date(2026, 8, 29, 5, 30), new Date(2026, 8, 29, 6)),
          event('2', new Date(2026, 8, 30, 20), new Date(2026, 8, 30, 21, 30)),
        ],
      })
      const hours = getHourLabels()
      expect(hours[0]).toBe('5 AM')
      expect(hours.at(-1)).toBe('9 PM')
    })

    it('fits the whole block of a short event late in the day', () => {
      // A block is at least an hour tall, so a 15-minute event at 20:30
      // reaches 21:30.
      renderScheduler({
        events: [
          event(
            '1',
            new Date(2026, 8, 29, 20, 30),
            new Date(2026, 8, 29, 20, 45),
          ),
        ],
      })
      expect(getHourLabels().at(-1)).toBe('9 PM')
    })

    it('ignores the events of other weeks', () => {
      renderScheduler({
        events: [
          event('1', new Date(2026, 9, 14, 3), new Date(2026, 9, 14, 4)),
          event('2', new Date(2026, 8, 20, 22), new Date(2026, 8, 20, 23)),
        ],
      })
      const hours = getHourLabels()
      expect(hours[0]).toBe('7 AM')
      expect(hours.at(-1)).toBe('8 PM')
      expect(screen.queryByText('Event 1')).toBeNull()
      expect(screen.queryByText('Event 2')).toBeNull()
    })
  })

  describe('events', () => {
    it('places an event in the cell of its start hour, as tall as it lasts', () => {
      const onEventClick = vi.fn()
      const standup = event(
        '1',
        new Date(2026, 8, 29, 9, 30),
        new Date(2026, 8, 29, 11),
        'Standup',
      )
      renderScheduler({ events: [standup], onEventClick })

      const [block] = getEventBlocks('Standup')
      expect(cellOf(block)).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/^9\/29\/2026, 9:00:00\sAM$/),
      )
      expect(block).toHaveStyle({
        top: '50%',
        height: `${1.5 * HOUR_HEIGHT}px`,
      })

      fireEvent.click(block as HTMLElement)
      expect(onEventClick).toHaveBeenCalledWith(standup)
    })

    it('splits an event that runs past midnight at the end of the day', () => {
      renderScheduler({
        events: [
          event(
            '1',
            new Date(2026, 8, 29, 22),
            new Date(2026, 8, 30, 1, 30),
            'Deploy',
          ),
        ],
      })

      const blocks = getEventBlocks('Deploy')
      expect(blocks).toHaveLength(2)
      // Row by row: the midnight row comes first.
      const [night, evening] = blocks
      expect(cellOf(evening)).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/^9\/29\/2026, 10:00:00\sPM$/),
      )
      expect(evening).toHaveStyle({ height: `${2 * HOUR_HEIGHT}px` })
      expect(cellOf(night)).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/^9\/30\/2026, 12:00:00\sAM$/),
      )
      expect(night).toHaveStyle({
        top: '0%',
        height: `${1.5 * HOUR_HEIGHT}px`,
      })

      // Both parts are on the grid: it runs from midnight to 11 PM.
      const hours = getHourLabels()
      expect(hours[0]).toBe('12 AM')
      expect(hours.at(-1)).toBe('11 PM')
    })

    it('shows the part of an event that started in the previous week', () => {
      renderScheduler({
        events: [
          event(
            '1',
            new Date(2026, 8, 27, 23),
            new Date(2026, 8, 28, 2),
            'Backup',
          ),
        ],
      })

      const blocks = getEventBlocks('Backup')
      expect(blocks).toHaveLength(1)
      expect(cellOf(blocks[0])).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/^9\/28\/2026, 12:00:00\sAM$/),
      )
      expect(blocks[0]).toHaveStyle({ height: `${2 * HOUR_HEIGHT}px` })
      // The previous Sunday isn't shown, so the grid doesn't grow to 11 PM.
      expect(getHourLabels().at(-1)).toBe('8 PM')
    })

    it('treats an event that ends at midnight as ending with its day', () => {
      renderScheduler({
        events: [
          event('1', new Date(2026, 8, 29, 22), new Date(2026, 8, 30), 'Late'),
        ],
      })

      const blocks = getEventBlocks('Late')
      expect(blocks).toHaveLength(1)
      expect(blocks[0]).toHaveStyle({ height: `${2 * HOUR_HEIGHT}px` })
      expect(getHourLabels().at(-1)).toBe('11 PM')
    })

    it('gives an event that ends before it starts the minimum height', () => {
      renderScheduler({
        events: [
          event(
            '1',
            new Date(2026, 8, 29, 9),
            new Date(2026, 8, 28, 10),
            'Broken',
          ),
        ],
      })

      const blocks = getEventBlocks('Broken')
      expect(blocks).toHaveLength(1)
      expect(blocks[0]).toHaveStyle({ minHeight: `${HOUR_HEIGHT}px` })
      expect(blocks[0]?.style.height).toBe('0px')
    })
  })

  describe('current time', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('marks today and the current time in the week that contains today', () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(2026, 8, 29, 10, 15))
      renderScheduler()

      expect(screen.getByText('10:15')).toBeInTheDocument()
      expect(screen.getByText('29 Tue')).toHaveClass('bg-indigo')
    })

    it('shows no current time in other weeks', () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(2026, 8, 29, 10, 15))
      renderScheduler({ currentDate: new Date(2026, 9, 6) })

      expect(screen.queryByText('10:15')).toBeNull()
      expect(screen.getByText('6 Tue')).not.toHaveClass('bg-indigo')
    })

    it('shows no current time outside the hours of the grid', () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(2026, 8, 29, 22, 15))
      renderScheduler()

      expect(screen.queryByText('22:15')).toBeNull()
    })
  })

  // Daylight saving time: the grid shows wall-clock hours, so a day with a
  // DST change still has one row per hour label and events are as tall as
  // the hours they cover on the clock.
  describe('daylight saving time (America/New_York)', () => {
    // Node applies a new TZ at once; unstubbing restores (or deletes) it.
    beforeAll(() => {
      vi.stubEnv('TZ', 'America/New_York')
    })

    afterAll(() => {
      vi.unstubAllEnvs()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('labels every hour once on the day clocks spring forward', () => {
      // March 8, 2026: 2:00 doesn't exist, the clocks go from 1:59 to 3:00.
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(2026, 2, 8, 12))
      renderScheduler({
        currentDate: new Date(2026, 2, 8),
        events: [
          event('1', new Date(2026, 2, 8, 1), new Date(2026, 2, 8, 4), 'Night'),
        ],
      })

      const hours = getHourLabels()
      expect(hours.slice(0, 4)).toEqual(['1 AM', '2 AM', '3 AM', '4 AM'])
      expect(new Set(hours).size).toBe(hours.length)
    })

    it('sizes events by the clock on the day clocks spring forward', () => {
      renderScheduler({
        currentDate: new Date(2026, 2, 8),
        events: [
          // Two real hours, three on the clock.
          event(
            '1',
            new Date(2026, 2, 8, 1),
            new Date(2026, 2, 8, 4),
            'Spring',
          ),
        ],
      })
      expect(getEventBlocks('Spring')[0]).toHaveStyle({
        height: `${3 * HOUR_HEIGHT}px`,
      })
    })

    it('sizes events by the clock on the day clocks fall back', () => {
      // November 1, 2026: 1:00-2:00 happens twice. 3.5 real hours, 2.5 on
      // the clock.
      renderScheduler({
        currentDate: new Date(2026, 10, 1),
        startOfWeek: 0,
        events: [
          event(
            '1',
            new Date(2026, 10, 1, 0, 30),
            new Date(2026, 10, 1, 3),
            'Fall',
          ),
        ],
      })
      expect(getEventBlocks('Fall')[0]).toHaveStyle({
        height: `${2.5 * HOUR_HEIGHT}px`,
      })
    })

    it('keeps seven consecutive days in a week with a DST change', () => {
      renderScheduler({ currentDate: new Date(2026, 2, 11), startOfWeek: 0 })
      expect(getDays()).toEqual([
        '3/8/2026',
        '3/9/2026',
        '3/10/2026',
        '3/11/2026',
        '3/12/2026',
        '3/13/2026',
        '3/14/2026',
      ])
      expect(getCells()[0]).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/^3\/8\/2026, 7:00:00\sAM$/),
      )
    })
  })
})
