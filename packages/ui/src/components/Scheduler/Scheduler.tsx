'use client'

import { useDirection } from '@radix-ui/react-direction'
import { isSameDay, setHours } from 'date-fns'
import {
  type ComponentProps,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TEXT_SIZES } from '../../constants'
import type { CalendarEvent, StartOfWeek } from '../../types'
import {
  getClockHours,
  getDaySegments,
  getEarliestScheduleHour,
  getLatestScheduleHour,
  getScheduleHours,
  getWeekDates,
  resolveWeekStart,
} from '../../utils'
import { twMerge } from '../../utils/tw-merge'
import { Separator } from '../Separator'
import { useSnowUI } from '../SnowUIProvider'
import { Tag } from '../Tag'
import { Typography } from '../Text'
import {
  DEFAULT_LANG,
  formatHour,
  formatTime,
  HOUR_HEIGHT,
  PAGE_HOURS,
} from './constants'
import { EventItem } from './EventItem'

type SchedulerProps = ComponentProps<'div'> & {
  /** A day of the week to show: the grid shows the week that contains it. */
  currentDate: Date
  /**
   * The events. An event is shown in the cell of the hour it starts in, as
   * tall as it lasts on the clock; one that runs past midnight continues on
   * the next day.
   */
  events?: CalendarEvent[]
  /**
   * The first day of the week: 0 for Sunday … 6 for Saturday. Without it,
   * `SnowUIProvider`'s `weekStartsOn` (`'locale'` follows the locale: Sunday
   * with the default English, Monday with `ru`), else Monday, as in the
   * Figma kit.
   * @default 1, or the provider's `weekStartsOn`
   */
  startOfWeek?: StartOfWeek
  /** Called with the event when an event is clicked. */
  onEventClick: (event: CalendarEvent) => void
  /**
   * Called when an hour cell is clicked, with the start of that hour: the
   * cell's day at `hh:00:00.000`.
   */
  onDateClick: (date: Date) => void
}

/**
 * An item of the grid's keyboard navigation: the slot (the button) of an
 * hour of a day, or an event block that starts in that hour.
 */
type Position = {
  /** The day's column, 0 … 6 from the start of the week. */
  day: number
  /** The clock hour of the row. */
  hour: number
  /** The event of the block; the hour's slot without one. */
  eventId?: string
}

const keyOf = ({ day, hour, eventId }: Position): string =>
  eventId === undefined ? `${day}:${hour}` : `${day}:${hour}:${eventId}`

/** A row of the grid: a subgrid of its columns, so the layout is the grid's. */
const ROW_CLASSES = 'grid grid-cols-subgrid col-span-full'

type Navigation = {
  /** The ids of the events that start in the hour of that day, in order. */
  eventsAt: (day: number, hour: number) => string[]
  firstHour: number
  lastHour: number
  rtl: boolean
}

/**
 * Where a key moves the focus from `from`: `null` at an edge of the grid
 * (the key does nothing, not even scroll the page), `undefined` for a key the
 * grid leaves to the browser. Down a day come each hour's slot, then the
 * events that start in that hour; the other keys go to slots.
 */
const getTarget = (
  from: Position,
  key: string,
  modifier: boolean,
  { eventsAt, firstHour, lastHour, rtl }: Navigation,
): Position | null | undefined => {
  const { day, hour, eventId } = from

  if (key === 'Home' || key === 'End') {
    // Ctrl / ⌘: the first or the last slot of the grid.
    if (modifier) {
      return key === 'Home'
        ? { day: 0, hour: firstHour }
        : { day: 6, hour: lastHour }
    }
    return { day: key === 'Home' ? 0 : 6, hour }
  }
  // Ctrl / ⌘ with the arrows and the page keys belong to the browser.
  if (modifier) return undefined

  switch (key) {
    case 'ArrowLeft':
    case 'ArrowRight': {
      // ArrowRight is the next day in left-to-right text, the previous one
      // in right-to-left text.
      const next = day + ((key === 'ArrowRight') === rtl ? -1 : 1)
      return next < 0 || next > 6 ? null : { day: next, hour }
    }
    case 'ArrowDown': {
      const events = eventsAt(day, hour)
      const index = eventId === undefined ? -1 : events.indexOf(eventId)
      if (index + 1 < events.length) {
        return { day, hour, eventId: events[index + 1] }
      }
      return hour < lastHour ? { day, hour: hour + 1 } : null
    }
    case 'ArrowUp': {
      if (eventId !== undefined) {
        const events = eventsAt(day, hour)
        const index = events.indexOf(eventId)
        return index > 0
          ? { day, hour, eventId: events[index - 1] }
          : { day, hour }
      }
      if (hour <= firstHour) return null
      // The last event of the hour above, or its slot.
      return { day, hour: hour - 1, eventId: eventsAt(day, hour - 1).at(-1) }
    }
    case 'PageDown':
    case 'PageUp': {
      const down = key === 'PageDown'
      const target = Math.min(
        Math.max(hour + (down ? PAGE_HOURS : -PAGE_HOURS), firstHour),
        lastHour,
      )
      // On the last row nothing is further down; on the first row PageUp
      // still goes from an event up to its slot.
      if (target === hour && (down || eventId === undefined)) return null
      return { day, hour: target }
    }
    default:
      return undefined
  }
}

/**
 * A week of events on an hour grid: a `grid` of day columns and hour rows.
 * The keyboard moves one tab stop around it (roving `tabIndex`): the arrow
 * keys between the hours' slots and the events, Home / End along a row,
 * Page Up / Page Down by `PAGE_HOURS`.
 */
const Scheduler: FC<SchedulerProps> = ({
  currentDate,
  events = [],
  startOfWeek,
  onEventClick,
  onDateClick,
  dir,
  style,
  className,
  onFocus,
  onBlur,
  onKeyDownCapture,
  ...props
}) => {
  // Day and hour labels in the `SnowUIProvider` locale (en-US without one).
  // The week starts on Monday unless `startOfWeek`, or the provider's
  // `weekStartsOn`, says otherwise, as in Calendar.
  const { locale, weekStartsOn } = useSnowUI()
  const lang = locale?.code ?? DEFAULT_LANG
  const weekStart = startOfWeek ?? resolveWeekStart(weekStartsOn, locale)
  // The `dir` prop, else the provider's: the arrow keys follow the reading
  // direction.
  const rtl =
    useDirection(dir === 'rtl' || dir === 'ltr' ? dir : undefined) === 'rtl'
  // The days at midnight, and the parts of the events on each of them.
  const week = getWeekDates(currentDate, weekStart).map((date) => ({
    date,
    segments: getDaySegments(events, date),
  }))
  // The grid fits the events of this week only.
  const segments = week.flatMap((day) => day.segments)
  const earliestHour = getEarliestScheduleHour(segments)
  const latestHour = getLatestScheduleHour(segments)
  const hours = getScheduleHours(earliestHour, latestHour)
  // The segments that start in each hour of each day: its cell's events.
  const cellSegments = (day: number, hour: number) =>
    week[day].segments.filter(({ start }) => Math.floor(start) === hour)
  const clampHour = (hour: number) =>
    Math.min(Math.max(hour, earliestHour), latestHour)

  const now = new Date()
  const nowHours = getClockHours(now)
  const todayIndex = week.findIndex(({ date }) => isSameDay(date, now))
  // The grid includes the whole latest hour, so it ends at latestHour + 1.
  const showNow =
    todayIndex !== -1 && nowHours >= earliestHour && nowHours < latestHour + 1

  // The grid's name: its week in the locale ("September 28 – October 4,
  // 2026"), so a screen reader says which week it is on entering.
  // Plain spaces: ICU versions differ on the thin spaces around the dash
  // (Node's and the browser's would give a hydration mismatch).
  const weekLabel = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
    .formatRange(week[0].date, week[6].date)
    .replace(/\s+/g, ' ')

  // The last focused item; the tab stop is there.
  const [focused, setFocused] = useState<Position | null>(null)
  // The tab stop. The first time: the current hour of today, within the
  // grid's rows, or the first slot in a week without today. A row that is
  // gone moves it to the nearest one, and an event that is gone (deleted,
  // moved, in another week) to the slot of its hour.
  const active: Position = (() => {
    if (!focused) {
      return todayIndex === -1
        ? { day: 0, hour: earliestHour }
        : { day: todayIndex, hour: clampHour(now.getHours()) }
    }
    const hour = clampHour(focused.hour)
    const { eventId } = focused
    const eventIsHere =
      hour === focused.hour &&
      eventId !== undefined &&
      cellSegments(focused.day, hour).some(({ event }) => event.id === eventId)
    return {
      day: focused.day,
      hour,
      eventId: eventIsHere ? eventId : undefined,
    }
  })()
  const activeKey = keyOf(active)

  // The rendered slots and events: to focus them, and to know which one a
  // focus or key event comes from.
  const items = useRef(new Map<string, { node: HTMLElement; at: Position }>())
  const itemRef = (at: Position) => (node: HTMLElement | null) => {
    if (node) items.current.set(keyOf(at), { node, at })
    else items.current.delete(keyOf(at))
  }
  const positionOf = (target: EventTarget) => {
    for (const { node, at } of items.current.values()) {
      if (node === target) return at
    }
  }
  const itemProps = (at: Position) => ({
    ref: itemRef(at),
    tabIndex: keyOf(at) === activeKey ? 0 : -1,
  })

  // Whether focus is in the grid, or was until the focused item was removed
  // (a deleted event, a row that is gone): that sends focus to <body>
  // without a blur React dispatches, so the new tab stop takes it.
  const hasFocus = useRef(false)
  useEffect(() => {
    const { activeElement } = document
    if (hasFocus.current && (!activeElement || activeElement === document.body))
      items.current.get(activeKey)?.node.focus()
  })

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    onFocus?.(e)
    // Events in an event's menu reach here too (it is a portal): only the
    // grid's own items count.
    const at = positionOf(e.target)
    if (!at) return
    hasFocus.current = true
    setFocused(at)
  }

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    onBlur?.(e)
    if (!e.currentTarget.contains(e.relatedTarget)) hasFocus.current = false
  }

  // In the capture phase, so the grid's keys come before an event's menu
  // trigger's: ArrowDown moves down the day instead of opening the menu
  // (Enter and Space still open it).
  const handleKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCapture?.(e)
    const from = positionOf(e.target)
    if (!from || e.defaultPrevented || e.altKey || e.shiftKey) return
    const to = getTarget(from, e.key, e.ctrlKey || e.metaKey, {
      eventsAt: (day, hour) =>
        cellSegments(day, hour).map(({ event }) => event.id),
      firstHour: earliestHour,
      lastHour: latestHour,
      rtl,
    })
    if (to === undefined) return
    e.preventDefault()
    // focus() scrolls the item into view.
    if (to) items.current.get(keyOf(to))?.node.focus()
  }

  // The grid, its rows and cells are <div>s: table elements can't be the
  // CSS grid (and subgrid rows) that lays the week out.
  // biome-ignore-start lint/a11y/useSemanticElements: ARIA grid roles on a CSS grid layout
  // biome-ignore-start lint/a11y/useFocusableInteractive: the slots and events in the cells take focus (roving tabIndex)
  return (
    <div
      role="grid"
      // A user `aria-label` (in the props) or `aria-labelledby` replaces it.
      aria-label={props['aria-labelledby'] ? undefined : weekLabel}
      dir={dir}
      style={{
        gridAutoRows: `${HOUR_HEIGHT}px`,
        ...style,
      }}
      className={twMerge(
        'grid grid-cols-[59px_repeat(7,100px)] gap-x-4 relative',
        className,
      )}
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <div role="row" className={ROW_CLASSES}>
        {/* The corner: a cell, since axe fails an empty column header. */}
        <div role="gridcell" className="col-span-1" />
        {week.map(({ date }, day) => (
          <div
            key={date.toDateString()}
            role="columnheader"
            aria-current={day === todayIndex ? 'date' : undefined}
            className="flex justify-center items-center"
          >
            {/* Today is semibold too, not told by its colour alone. */}
            <Typography
              size={TEXT_SIZES[12]}
              semibold={day === todayIndex}
              className={twMerge(
                'text-secondary px-1 py-0.5 rounded-4',
                day === todayIndex && 'bg-indigo text-static-black',
              )}
            >
              {date.toLocaleDateString(lang, {
                weekday: 'short',
                day: 'numeric',
              })}
            </Typography>
          </div>
        ))}
      </div>

      {week.slice(1).map(({ date }, index) => {
        const i = index + 1
        return (
          <Separator
            key={date.toDateString()}
            style={{
              // From the end edge, so it stays between the days in
              // right-to-left text.
              insetInlineEnd:
                i === 1 ? `calc(108*${i}px)` : `calc(108px + 116*${i - 1}px)`,
            }}
            orientation="vertical"
            className="absolute bg-black-4"
          />
        )
      })}

      {hours.map((hour) => (
        <div key={hour} role="row" className={ROW_CLASSES}>
          <Typography
            role="rowheader"
            size={TEXT_SIZES[12]}
            className="text-secondary"
          >
            {formatHour(hour, lang)}
          </Typography>
          {week.map(({ date }, day) => {
            // The start of the hour on the clock of that day.
            const cellDate = setHours(date, hour)
            return (
              <div
                key={date.toDateString() + hour}
                role="gridcell"
                className="relative"
              >
                {/* The cell's button fills it, and the events are its
                    siblings: a button can't contain other controls. Raised
                    above the events on keyboard focus, so they don't hide
                    its focus ring. */}
                <button
                  type="button"
                  data-scheduler-item="slot"
                  {...itemProps({ day, hour })}
                  aria-label={cellDate.toLocaleString(lang)}
                  aria-current={
                    day === todayIndex && hour === now.getHours()
                      ? 'time'
                      : undefined
                  }
                  onClick={() => onDateClick(cellDate)}
                  className="absolute inset-0 focus-ring focus-visible:z-[2]"
                />
                {cellSegments(day, hour).map(({ event, start, end }) => (
                  <EventItem
                    key={event.id}
                    data-scheduler-item="event"
                    {...itemProps({ day, hour, eventId: event.id })}
                    className="bg-color-2 text-static-black p-1 text-14 rounded-4"
                    onEventClick={onEventClick}
                    event={event}
                    start={start}
                    end={end}
                  />
                ))}
              </div>
            )
          })}
        </div>
      ))}

      {/* Current time indicator: the slot's aria-current="time" tells it
          to assistive technology, and clicks go through to the slots. */}
      {showNow && (
        <div
          aria-hidden
          className="pointer-events-none absolute start-0 w-full px-4 flex justify-center items-center z-10"
          style={{
            top: `${(1 + (nowHours - earliestHour)) * HOUR_HEIGHT}px`,
          }}
        >
          <Tag
            label={formatTime(now, lang, 'numeric')}
            className="bg-primary text-white font-normal text-12 text-nowrap"
          />
          <Separator className="bg-primary" />
        </div>
      )}
    </div>
  )
  // biome-ignore-end lint/a11y/useFocusableInteractive: the slots and events in the cells take focus (roving tabIndex)
  // biome-ignore-end lint/a11y/useSemanticElements: ARIA grid roles on a CSS grid layout
}

export { Scheduler, type SchedulerProps }
