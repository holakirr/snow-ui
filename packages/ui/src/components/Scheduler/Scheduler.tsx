'use client'

import { isSameDay, setHours } from 'date-fns'
import { type ComponentProps, type FC, Fragment } from 'react'
import { TEXT_SIZES } from '../../constants'
import type { CalendarEvent, StartOfWeek } from '../../types'
import {
  getClockHours,
  getDaySegments,
  getEarliestScheduleHour,
  getLatestScheduleHour,
  getScheduleHours,
  getWeekDates,
} from '../../utils'
import { twMerge } from '../../utils/tw-merge'
import { Separator } from '../Separator'
import { useSnowUI } from '../SnowUIProvider'
import { Tag } from '../Tag'
import { Typography } from '../Text'
import { DEFAULT_LANG, formatHour, formatTime, HOUR_HEIGHT } from './constants'
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
   * The first day of the week: 0 for Sunday … 6 for Saturday. Like
   * `Calendar`'s `weekStartsOn`, it doesn't follow the locale.
   * @default 1
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

const Scheduler: FC<SchedulerProps> = ({
  currentDate,
  events = [],
  startOfWeek = 1,
  onEventClick,
  onDateClick,
  style,
  className,
  ...props
}) => {
  // Day and hour labels in the `SnowUIProvider` locale (en-US without one).
  const lang = useSnowUI().locale?.code ?? DEFAULT_LANG
  // The days at midnight, and the parts of the events on each of them.
  const week = getWeekDates(currentDate, startOfWeek).map((date) => ({
    date,
    segments: getDaySegments(events, date),
  }))
  // The grid fits the events of this week only.
  const segments = week.flatMap((day) => day.segments)
  const earliestHour = getEarliestScheduleHour(segments)
  const latestHour = getLatestScheduleHour(segments)
  const hours = getScheduleHours(earliestHour, latestHour)

  const now = new Date()
  const nowHours = getClockHours(now)
  // The grid includes the whole latest hour, so it ends at latestHour + 1.
  const showNow =
    week.some(({ date }) => isSameDay(date, now)) &&
    nowHours >= earliestHour &&
    nowHours < latestHour + 1

  return (
    <div
      style={{
        gridAutoRows: `${HOUR_HEIGHT}px`,
        ...style,
      }}
      className={twMerge(
        'grid grid-cols-[59px_repeat(7,100px)] gap-x-4 relative',
        className,
      )}
      {...props}
    >
      <div className="col-span-1" />
      {week.map(({ date }, i) => (
        <Fragment key={date.toDateString()}>
          <div className="flex justify-center items-center">
            <Typography
              size={TEXT_SIZES[12]}
              className={twMerge(
                'text-secondary px-1 py-0.5 rounded-4',
                isSameDay(date, now) && 'bg-indigo text-static-black',
              )}
            >
              {date.toLocaleDateString(lang, {
                weekday: 'short',
                day: 'numeric',
              })}
            </Typography>
          </div>
          {i > 0 && (
            <Separator
              style={{
                // From the end edge, so it stays between the days in
                // right-to-left text.
                insetInlineEnd:
                  i === 1 ? `calc(108*${i}px)` : `calc(108px + 116*${i - 1}px)`,
              }}
              orientation="vertical"
              className="absolute bg-black-4"
            />
          )}
        </Fragment>
      ))}

      {hours.map((hour) => (
        <Fragment key={hour}>
          <Typography size={TEXT_SIZES[12]} className="text-secondary">
            {formatHour(hour, lang)}
          </Typography>
          {week.map(({ date, segments: daySegments }) => {
            // The start of the hour on the clock of that day.
            const cellDate = setHours(date, hour)
            return (
              <div key={date.toDateString() + hour} className="relative">
                {/* The cell's button fills it, and the events are its
                    siblings: a button can't contain other controls. */}
                <button
                  type="button"
                  aria-label={cellDate.toLocaleString(lang)}
                  onClick={() => onDateClick(cellDate)}
                  className="absolute inset-0 focus-ring"
                />
                {daySegments
                  .filter(({ start }) => Math.floor(start) === hour)
                  .map(({ event, start, end }) => (
                    <EventItem
                      key={event.id}
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
        </Fragment>
      ))}

      {/* Current time indicator */}
      {showNow && (
        <div
          className="absolute start-0 w-full px-4 flex justify-center items-center z-10"
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
}

export { Scheduler, type SchedulerProps }
