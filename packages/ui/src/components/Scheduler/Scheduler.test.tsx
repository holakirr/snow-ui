import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { enUS, ru } from 'date-fns/locale'
import { userEvent } from 'storybook/test'
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
import { SnowUIProvider } from '../SnowUIProvider'
import { HOUR_HEIGHT, PAGE_HOURS } from './constants'
import { Scheduler, type SchedulerProps } from './Scheduler'

const renderScheduler = (props: Partial<SchedulerProps> = {}) => {
  const onDateClick = vi.fn()
  const onEventClick = vi.fn()
  const scheduler = (next: Partial<SchedulerProps>) => (
    <Scheduler
      currentDate={new Date(2026, 8, 29, 10, 37, 12, 345)}
      onDateClick={onDateClick}
      onEventClick={onEventClick}
      {...next}
    />
  )
  const { rerender } = render(scheduler(props))
  return {
    onDateClick,
    onEventClick,
    /** Renders again with other props (instead of the first ones). */
    rerender: (next: Partial<SchedulerProps>) => rerender(scheduler(next)),
  }
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
  screen
    .getAllByRole('rowheader')
    .map((header) => (header.textContent ?? '').replace(/\s/, ' '))

/**
 * The slot (hour cell button) that starts at `date`: its name is the date
 * in en-US, the same string, narrow spaces included.
 */
const slotAt = (date: Date) => {
  const slot = document.querySelector<HTMLElement>(
    `button[aria-label="${date.toLocaleString('en-US')}"]`,
  )
  if (!slot) throw new Error(`No slot at ${date.toLocaleString('en-US')}`)
  return slot
}

/** The items in the tab order: a single tab stop. */
const getTabStops = () =>
  Array.from(
    screen.getByRole('grid').querySelectorAll<HTMLElement>('[tabindex]'),
  ).filter((item) => item.tabIndex === 0)

/**
 * Presses a key on the focused element; false when the grid prevented its
 * default (it moved the focus or swallowed the key at an edge).
 */
const press = (key: string, init: Partial<KeyboardEventInit> = {}) =>
  fireEvent.keyDown(document.activeElement ?? document.body, { key, ...init })

/** 2026-09-29 (a Tuesday) at 10:15: today is in the default week. */
const TODAY = new Date(2026, 8, 29, 10, 15)
/** September 2026 (or `month`) on the clock. */
const at = (day: number, hour: number, month = 8) =>
  new Date(2026, month, day, hour)

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

    it('starts on Monday whatever the locale by default', () => {
      render(
        <SnowUIProvider locale={enUS}>
          <Scheduler
            currentDate={new Date(2026, 8, 29, 12)}
            onDateClick={() => {}}
            onEventClick={() => {}}
          />
        </SnowUIProvider>,
      )
      expect(getDays()[0]).toBe('9/28/2026')
    })

    it('follows the locale\'s first day with the provider\'s weekStartsOn="locale"', () => {
      // Tuesday, September 29: the en-US week runs from Sunday the 27th.
      const { unmount } = render(
        <SnowUIProvider weekStartsOn="locale">
          <Scheduler
            currentDate={new Date(2026, 8, 29, 12)}
            onDateClick={() => {}}
            onEventClick={() => {}}
          />
        </SnowUIProvider>,
      )
      expect(getDays()[0]).toBe('9/27/2026')
      expect(getDays()[6]).toBe('10/3/2026')
      unmount()

      // A nested provider inherits it; the ru week starts on Monday, and
      // the labels are in the ru format too.
      render(
        <SnowUIProvider weekStartsOn="locale">
          <SnowUIProvider locale={ru}>
            <Scheduler
              currentDate={new Date(2026, 8, 29, 12)}
              onDateClick={() => {}}
              onEventClick={() => {}}
            />
          </SnowUIProvider>
        </SnowUIProvider>,
      )
      expect(getDays()[0]).toBe('28.09.2026')
      expect(getDays()[6]).toBe('04.10.2026')
    })

    it("takes a day from the provider's weekStartsOn; startOfWeek wins", () => {
      const { unmount } = render(
        <SnowUIProvider weekStartsOn={0}>
          <Scheduler
            currentDate={new Date(2026, 8, 29, 12)}
            onDateClick={() => {}}
            onEventClick={() => {}}
          />
        </SnowUIProvider>,
      )
      expect(getDays()[0]).toBe('9/27/2026')
      unmount()

      render(
        <SnowUIProvider locale={ru} weekStartsOn="locale">
          <Scheduler
            currentDate={new Date(2026, 8, 29, 12)}
            startOfWeek={0}
            onDateClick={() => {}}
            onEventClick={() => {}}
          />
        </SnowUIProvider>,
      )
      expect(getDays()[0]).toBe('27.09.2026')
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

    it('tells today and the current hour to assistive technology', () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(TODAY)
      renderScheduler()

      const headers = screen.getAllByRole('columnheader')
      const today = screen.getByRole('columnheader', { current: 'date' })
      expect(today).toHaveTextContent('29 Tue')
      expect(headers.filter((h) => h.hasAttribute('aria-current'))).toEqual([
        today,
      ])
      // Semibold too: today isn't told by its colour alone (WCAG 1.4.1).
      expect(within(today).getByText('29 Tue')).toHaveClass('font-semibold')
      expect(screen.getByText('30 Wed')).not.toHaveClass('font-semibold')

      const now = slotAt(at(29, 10))
      expect(now).toHaveAttribute('aria-current', 'time')
      expect(
        screen.getByRole('grid').querySelectorAll('[aria-current="time"]'),
      ).toHaveLength(1)
    })

    it('keeps the current-time tag out of the way of the slots', () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(TODAY)
      renderScheduler()

      const indicator = screen.getByText('10:15').closest('[aria-hidden]')
      expect(indicator).toHaveAttribute('aria-hidden', 'true')
      // Clicks reach the slot below it.
      expect(indicator).toHaveClass('pointer-events-none')
    })

    it('marks no date or time in other weeks', () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(TODAY)
      renderScheduler({ currentDate: new Date(2026, 9, 6) })

      expect(screen.getByRole('grid').querySelector('[aria-current]')).toBe(
        null,
      )
    })
  })

  describe('grid semantics', () => {
    it('is a grid named by its week in the locale', () => {
      renderScheduler()
      expect(screen.getByRole('grid')).toHaveAccessibleName(
        'September 28 – October 4, 2026',
      )
    })

    it('names the week in the SnowUIProvider language', () => {
      render(
        <SnowUIProvider locale={ru}>
          <Scheduler
            currentDate={new Date(2026, 8, 29)}
            onDateClick={() => {}}
            onEventClick={() => {}}
          />
        </SnowUIProvider>,
      )
      expect(screen.getByRole('grid')).toHaveAccessibleName(
        /^28 сентября – 4 октября 2026/,
      )
    })

    it('lets aria-label or aria-labelledby replace the name', () => {
      const { unmount } = render(
        <Scheduler
          aria-label="Team week"
          currentDate={new Date(2026, 8, 29)}
          onDateClick={() => {}}
          onEventClick={() => {}}
        />,
      )
      expect(screen.getByRole('grid')).toHaveAccessibleName('Team week')
      unmount()

      render(
        <>
          <h2 id="week-title">Bookings</h2>
          <Scheduler
            aria-labelledby="week-title"
            currentDate={new Date(2026, 8, 29)}
            onDateClick={() => {}}
            onEventClick={() => {}}
          />
        </>,
      )
      const grid = screen.getByRole('grid')
      expect(grid).toHaveAccessibleName('Bookings')
      expect(grid).not.toHaveAttribute('aria-label')
    })

    it('has a header row of days and a row per hour', () => {
      renderScheduler()
      const [header, ...rows] = screen.getAllByRole('row')

      // An empty corner cell (axe fails an empty column header), then the
      // days.
      const corner = within(header).getByRole('gridcell')
      expect(corner).toBeEmptyDOMElement()
      expect(
        within(header)
          .getAllByRole('columnheader')
          .map((day) => day.textContent),
      ).toEqual([
        '28 Mon',
        '29 Tue',
        '30 Wed',
        '1 Thu',
        '2 Fri',
        '3 Sat',
        '4 Sun',
      ])

      expect(rows).toHaveLength(14)
      for (const row of rows) {
        expect(within(row).getAllByRole('rowheader')).toHaveLength(1)
        const cells = within(row).getAllByRole('gridcell')
        expect(cells).toHaveLength(7)
        // Each cell holds its slot.
        for (const cell of cells) {
          expect(
            cell.querySelector('button[data-scheduler-item="slot"]'),
          ).not.toBeNull()
        }
      }
      expect(within(rows[0]).getByRole('rowheader')).toHaveTextContent(
        /^7\sAM$/,
      )
    })

    it('lays the rows out on the grid columns (CSS subgrid)', () => {
      renderScheduler()
      for (const row of screen.getAllByRole('row')) {
        expect(row).toHaveClass('grid', 'grid-cols-subgrid', 'col-span-full')
      }
    })

    it('puts the events of an hour in its cell, after the slot', () => {
      renderScheduler({
        events: [
          event('1', at(29, 9, 8), at(29, 10, 8), 'Standup'),
          event('2', at(29, 9, 8), at(29, 9, 8), 'Check-in'),
        ],
      })
      const cell = slotAt(at(29, 9)).parentElement as HTMLElement
      expect(cell).toHaveAttribute('role', 'gridcell')
      expect(
        Array.from(cell.querySelectorAll('[data-scheduler-item]'), (item) =>
          item.getAttribute('data-scheduler-item'),
        ),
      ).toEqual(['slot', 'event', 'event'])
      expect(within(cell).getByRole('button', { name: /^Standup/ })).toBe(
        getEventBlocks('Standup')[0],
      )
    })

    it('raises a focused slot above the events', () => {
      renderScheduler()
      expect(slotAt(at(29, 9))).toHaveClass('focus-visible:z-[2]')
    })
  })

  describe('keyboard', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    const renderAt = (
      now: Date,
      props: Partial<SchedulerProps> = {},
    ): ReturnType<typeof renderScheduler> => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(now)
      return renderScheduler(props)
    }

    describe('tab stop', () => {
      it("is today's current hour, the only item in the tab order", () => {
        renderAt(TODAY)
        expect(getTabStops()).toEqual([slotAt(at(29, 10))])
        // 98 slots, 97 of them out of the tab order.
        expect(
          screen
            .getAllByRole('button')
            .filter((button) => button.tabIndex === -1),
        ).toHaveLength(97)
      })

      it('is on the last row after the grid’s hours', () => {
        renderAt(new Date(2026, 8, 29, 22, 15))
        expect(getTabStops()).toEqual([slotAt(at(29, 20))])
      })

      it('is on the first row before the grid’s hours', () => {
        renderAt(new Date(2026, 8, 29, 3, 15))
        expect(getTabStops()).toEqual([slotAt(at(29, 7))])
      })

      it('is the first slot in a week without today', () => {
        renderAt(TODAY, { currentDate: new Date(2026, 9, 7) })
        expect(getTabStops()).toEqual([slotAt(at(5, 7, 9))])
      })

      it('follows the focus, and Tab comes back to the last focused item', async () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(TODAY)
        render(
          <>
            <button type="button">Before</button>
            <Scheduler
              currentDate={TODAY}
              onDateClick={() => {}}
              onEventClick={() => {}}
            />
            <button type="button">After</button>
          </>,
        )
        const user = userEvent.setup()
        const before = screen.getByRole('button', { name: 'Before' })
        const after = screen.getByRole('button', { name: 'After' })

        before.focus()
        await user.tab()
        expect(slotAt(at(29, 10))).toHaveFocus()

        await user.keyboard('{ArrowRight}')
        expect(slotAt(at(30, 10))).toHaveFocus()
        expect(getTabStops()).toEqual([slotAt(at(30, 10))])

        // One Tab leaves the grid, Shift+Tab comes back to the same slot.
        await user.tab()
        expect(after).toHaveFocus()
        await user.tab({ shift: true })
        expect(slotAt(at(30, 10))).toHaveFocus()
        await user.tab({ shift: true })
        expect(before).toHaveFocus()

        // A click moves it too.
        await user.click(slotAt(at(2, 15, 9)))
        expect(getTabStops()).toEqual([slotAt(at(2, 15, 9))])
      })
    })

    describe('keys', () => {
      it('ArrowRight / ArrowLeft move a day at the same hour', () => {
        renderAt(TODAY)
        slotAt(at(29, 10)).focus()

        expect(press('ArrowRight')).toBe(false)
        expect(slotAt(at(30, 10))).toHaveFocus()
        press('ArrowLeft')
        press('ArrowLeft')
        expect(slotAt(at(28, 10))).toHaveFocus()
      })

      it('ArrowDown / ArrowUp move an hour down / up the day', () => {
        renderAt(TODAY)
        slotAt(at(29, 10)).focus()

        press('ArrowDown')
        expect(slotAt(at(29, 11))).toHaveFocus()
        press('ArrowUp')
        press('ArrowUp')
        expect(slotAt(at(29, 9))).toHaveFocus()
      })

      it('Home / End go to the first / last day of the row', () => {
        renderAt(TODAY)
        slotAt(at(29, 10)).focus()

        expect(press('End')).toBe(false)
        expect(slotAt(at(4, 10, 9))).toHaveFocus()
        press('Home')
        expect(slotAt(at(28, 10))).toHaveFocus()
      })

      it('Ctrl / ⌘ + Home / End go to the first / last slot of the grid', () => {
        renderAt(TODAY)
        slotAt(at(29, 10)).focus()

        press('End', { ctrlKey: true })
        expect(slotAt(at(4, 20, 9))).toHaveFocus()
        press('Home', { metaKey: true })
        expect(slotAt(at(28, 7))).toHaveFocus()
      })

      it(`PageDown / PageUp move ${PAGE_HOURS} hours and stop at the first / last row`, () => {
        renderAt(TODAY)
        slotAt(at(29, 10)).focus()

        expect(press('PageDown')).toBe(false)
        expect(slotAt(at(29, 16))).toHaveFocus()
        press('PageDown')
        expect(slotAt(at(29, 20))).toHaveFocus()
        press('PageUp')
        expect(slotAt(at(29, 14))).toHaveFocus()
        press('PageUp')
        press('PageUp')
        expect(slotAt(at(29, 7))).toHaveFocus()
      })

      it("doesn't wrap at the edges, and the page doesn't scroll", () => {
        renderAt(TODAY)

        slotAt(at(28, 7)).focus()
        for (const key of ['ArrowLeft', 'ArrowUp', 'PageUp', 'Home']) {
          expect(press(key)).toBe(false)
          expect(slotAt(at(28, 7))).toHaveFocus()
        }

        slotAt(at(4, 20, 9)).focus()
        for (const key of ['ArrowRight', 'ArrowDown', 'PageDown', 'End']) {
          expect(press(key)).toBe(false)
          expect(slotAt(at(4, 20, 9))).toHaveFocus()
        }
      })

      it('leaves Alt / Shift combos and Ctrl / ⌘ + arrows and pages to the browser', () => {
        renderAt(TODAY)
        const start = slotAt(at(29, 10))
        start.focus()

        for (const [key, init] of [
          ['ArrowDown', { altKey: true }],
          ['ArrowRight', { shiftKey: true }],
          ['Home', { shiftKey: true }],
          ['ArrowDown', { ctrlKey: true }],
          ['ArrowLeft', { metaKey: true }],
          ['PageDown', { ctrlKey: true }],
          ['a', {}],
          ['Tab', {}],
        ] as const) {
          expect(press(key, init)).toBe(true)
          expect(start).toHaveFocus()
        }
      })

      it('Enter and Space call onDateClick with the slot’s hour', async () => {
        const { onDateClick } = renderAt(TODAY)
        const user = userEvent.setup()
        slotAt(at(29, 10)).focus()

        // The grid leaves them to the <button>.
        expect(press('Enter')).toBe(true)
        await user.keyboard('{Enter}')
        expect(onDateClick).toHaveBeenLastCalledWith(at(29, 10))
        await user.keyboard('{ArrowRight}')
        await user.keyboard(' ')
        expect(onDateClick).toHaveBeenLastCalledWith(at(30, 10))
      })

      it('keeps calling the onFocus and onKeyDownCapture props', () => {
        const onFocus = vi.fn()
        const onKeyDownCapture = vi.fn()
        renderAt(TODAY, { onFocus, onKeyDownCapture })

        slotAt(at(29, 10)).focus()
        expect(onFocus).toHaveBeenCalledTimes(1)
        press('ArrowDown')
        expect(onKeyDownCapture).toHaveBeenCalledWith(
          expect.objectContaining({ key: 'ArrowDown' }),
        )
        expect(slotAt(at(29, 11))).toHaveFocus()
        expect(onFocus).toHaveBeenCalledTimes(2)
      })

      it('lets an onKeyDownCapture that prevents the default keep the key', () => {
        renderAt(TODAY, {
          onKeyDownCapture: (e) => {
            if (e.key === 'ArrowDown') e.preventDefault()
          },
        })
        slotAt(at(29, 10)).focus()

        press('ArrowDown')
        expect(slotAt(at(29, 10))).toHaveFocus()
        press('ArrowUp')
        expect(slotAt(at(29, 9))).toHaveFocus()
      })
    })

    describe('right-to-left', () => {
      const scheduler = (props: Partial<SchedulerProps> = {}) => (
        <Scheduler
          currentDate={TODAY}
          onDateClick={() => {}}
          onEventClick={() => {}}
          {...props}
        />
      )

      it('mirrors ArrowLeft / ArrowRight in a SnowUIProvider dir="rtl"', () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(TODAY)
        render(<SnowUIProvider dir="rtl">{scheduler()}</SnowUIProvider>)
        slotAt(at(29, 10)).focus()

        press('ArrowLeft')
        expect(slotAt(at(30, 10))).toHaveFocus()
        press('ArrowRight')
        press('ArrowRight')
        expect(slotAt(at(28, 10))).toHaveFocus()
        // Home / End are logical: the first / last day of the week.
        press('End')
        expect(slotAt(at(4, 10, 9))).toHaveFocus()
        press('Home')
        expect(slotAt(at(28, 10))).toHaveFocus()
      })

      it('follows the dir prop, which wins over the provider', () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(TODAY)
        const { rerender } = render(scheduler({ dir: 'rtl' }))
        expect(screen.getByRole('grid')).toHaveAttribute('dir', 'rtl')
        slotAt(at(29, 10)).focus()
        press('ArrowLeft')
        expect(slotAt(at(30, 10))).toHaveFocus()

        rerender(
          <SnowUIProvider dir="rtl">
            {scheduler({ dir: 'ltr' })}
          </SnowUIProvider>,
        )
        slotAt(at(29, 10)).focus()
        press('ArrowRight')
        expect(slotAt(at(30, 10))).toHaveFocus()
      })
    })

    describe('events', () => {
      // Tuesday: two events start at 9, one at noon.
      const standup = event('1', at(29, 9, 8), at(29, 10, 8), 'Standup')
      const checkIn = event('2', at(29, 9, 8), at(29, 9, 8), 'Check-in')
      const lunch = event('3', at(29, 12, 8), at(29, 13, 8), 'Lunch')
      const block = (title: string) => getEventBlocks(title)[0] as HTMLElement

      it('are reached down the day after the slot of their hour', () => {
        renderAt(TODAY, { events: [standup, checkIn, lunch] })
        slotAt(at(29, 8)).focus()

        press('ArrowDown')
        expect(slotAt(at(29, 9))).toHaveFocus()
        press('ArrowDown')
        expect(block('Standup')).toHaveFocus()
        press('ArrowDown')
        expect(block('Check-in')).toHaveFocus()
        press('ArrowDown')
        expect(slotAt(at(29, 10))).toHaveFocus()

        press('ArrowUp')
        expect(block('Check-in')).toHaveFocus()
        press('ArrowUp')
        expect(block('Standup')).toHaveFocus()
        press('ArrowUp')
        expect(slotAt(at(29, 9))).toHaveFocus()

        // Up from a slot goes to the last event of the hour above.
        slotAt(at(29, 13)).focus()
        press('ArrowUp')
        expect(block('Lunch')).toHaveFocus()
      })

      it('take the tab stop when focused, one at a time', () => {
        renderAt(TODAY, { events: [standup, checkIn] })
        act(() => block('Standup').focus())
        expect(getTabStops()).toEqual([block('Standup')])
        press('ArrowDown')
        expect(getTabStops()).toEqual([block('Check-in')])
        for (const item of document.querySelectorAll(
          '[data-scheduler-item="event"]',
        )) {
          expect(item).toHaveAttribute('role', 'button')
        }
      })

      it('move to slots with the other keys', () => {
        renderAt(TODAY, { events: [standup, checkIn] })

        block('Check-in').focus()
        press('ArrowRight')
        expect(slotAt(at(30, 9))).toHaveFocus()

        block('Check-in').focus()
        press('ArrowLeft')
        expect(slotAt(at(28, 9))).toHaveFocus()

        block('Standup').focus()
        press('Home')
        expect(slotAt(at(28, 9))).toHaveFocus()

        block('Standup').focus()
        press('PageDown')
        expect(slotAt(at(29, 15))).toHaveFocus()

        block('Standup').focus()
        press('PageUp')
        expect(slotAt(at(29, 7))).toHaveFocus()

        block('Standup').focus()
        press('End', { ctrlKey: true })
        expect(slotAt(at(4, 20, 9))).toHaveFocus()
      })

      it("PageUp on the first row goes up to the slot; PageDown on the last row doesn't move", () => {
        renderAt(TODAY, {
          events: [
            event('1', at(29, 7, 8), at(29, 8, 8), 'Early'),
            event('2', at(29, 20, 8), at(29, 21, 8), 'Late'),
          ],
        })

        block('Early').focus()
        expect(press('PageUp')).toBe(false)
        expect(slotAt(at(29, 7))).toHaveFocus()

        block('Late').focus()
        expect(press('PageDown')).toBe(false)
        expect(block('Late')).toHaveFocus()
        expect(press('ArrowDown')).toBe(false)
        expect(block('Late')).toHaveFocus()
      })

      it("ArrowDown moves on instead of opening the event's menu", () => {
        renderAt(TODAY, { events: [standup] })
        block('Standup').focus()

        press('ArrowDown')
        expect(slotAt(at(29, 10))).toHaveFocus()
        expect(screen.queryByRole('menu')).toBeNull()
      })

      it('Enter calls onEventClick and opens the menu; Escape closes it and returns focus', async () => {
        const { onEventClick } = renderAt(TODAY, { events: [standup] })
        const standupBlock = block('Standup')
        standupBlock.focus()

        expect(press('Enter')).toBe(false)
        expect(onEventClick).toHaveBeenCalledWith(standup)
        const menu = await screen.findByRole('menu')
        await waitFor(() =>
          expect(menu).toContainElement(document.activeElement as HTMLElement),
        )

        // The menu's keys aren't the grid's.
        fireEvent.keyDown(document.activeElement as Element, {
          key: 'ArrowRight',
        })
        expect(screen.getByRole('menu')).toBeInTheDocument()

        fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' })
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
        await waitFor(() => expect(standupBlock).toHaveFocus())
        expect(getTabStops()).toEqual([standupBlock])
      })

      it('gives the place of a focused event that disappears to its slot', () => {
        const { rerender } = renderAt(TODAY, { events: [standup, checkIn] })
        block('Check-in').focus()

        rerender({ events: [standup] })
        expect(slotAt(at(29, 9))).toHaveFocus()
        expect(getTabStops()).toEqual([slotAt(at(29, 9))])
      })

      it('moves the tab stop to the nearest row when its row disappears', () => {
        const early = event('1', at(29, 5, 8), at(29, 6, 8), 'Early')
        const { rerender } = renderAt(TODAY, { events: [early] })
        slotAt(at(29, 5)).focus()

        rerender({ events: [] })
        expect(slotAt(at(29, 7))).toHaveFocus()
      })

      it("doesn't take the focus back from elsewhere on the page", () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(TODAY)
        const grid = (events: CalendarEvent[]) => (
          <>
            <button type="button">Elsewhere</button>
            <Scheduler
              currentDate={TODAY}
              events={events}
              onDateClick={() => {}}
              onEventClick={() => {}}
            />
          </>
        )
        const { rerender } = render(grid([standup]))
        block('Standup').focus()
        screen.getByRole('button', { name: 'Elsewhere' }).focus()

        rerender(grid([]))
        expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus()
      })
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
