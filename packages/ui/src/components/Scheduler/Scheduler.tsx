'use client'

import { type ComponentProps, type FC, Fragment } from 'react'
import { TEXT_SIZES } from '../../constants'
import type { CalendarEvent, StartOfWeek } from '../../types'
import {
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
import { DEFAULT_LANG, formatTime, HOUR_HEIGHT } from './constants'
import { EventItem } from './EventItem'

/**
 * Props для компонента Scheduler
 */
type SchedulerProps = ComponentProps<'div'> & {
  /** Текущая дата */
  currentDate: Date
  /** Массив событий календаря */
  events?: CalendarEvent[]
  /** Начало недели (0-6, где 0 - воскресенье) */
  startOfWeek?: StartOfWeek
  /** Обработчик клика по событию */
  onEventClick: (event: CalendarEvent) => void
  /** Обработчик клика по дате */
  onDateClick: (date: Date) => void
}

const getCellDate = (date: Date, hour: number): Date => {
  const cellDate = new Date(date)
  cellDate.setHours(hour)
  return cellDate
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
  const weekDates = getWeekDates(currentDate, startOfWeek)

  const earliestHour = getEarliestScheduleHour(events)
  const earliestTime = new Date(new Date().setHours(earliestHour, 0, 0, 0))
  const latestHour = getLatestScheduleHour(events)
  // The grid includes the whole latest hour, so it ends at latestHour + 1
  const latestTime = new Date(new Date().setHours(latestHour + 1, 0, 0, 0))
  const now = new Date()
  const hours = getScheduleHours(earliestHour, latestHour)

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
      {weekDates.map((date, i) => (
        <Fragment key={date.toLocaleDateString()}>
          <div
            key={date.toLocaleDateString()}
            className="flex justify-center items-center"
          >
            <Typography
              size={TEXT_SIZES[12]}
              className={twMerge(
                'text-secondary px-1 py-0.5 rounded-4',
                date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                  ? 'bg-indigo text-static-black'
                  : '',
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
            {new Date(new Date().setHours(hour)).toLocaleTimeString(lang, {
              hour: 'numeric',
            })}
          </Typography>
          {weekDates.map((date) => (
            // biome-ignore lint/a11y/useSemanticElements: the cell hosts nested interactive events, so it can't be a <button>
            <div
              key={date.toLocaleDateString() + hour}
              role="button"
              tabIndex={0}
              aria-label={getCellDate(date, hour).toLocaleString()}
              onClick={(e) => {
                e.preventDefault()
                onDateClick(getCellDate(date, hour))
              }}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onDateClick(getCellDate(date, hour))
                }
              }}
              className="relative focus-ring"
            >
              {events
                ?.filter((event) => {
                  const eventDate = new Date(event.date)
                  return (
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear() &&
                    eventDate.getHours() === hour
                  )
                })
                .map((event) => (
                  <EventItem
                    key={event.id}
                    className="bg-color-2 text-static-black p-1 text-14 rounded-4"
                    onEventClick={onEventClick}
                    event={event}
                  />
                ))}
            </div>
          ))}
        </Fragment>
      ))}

      {/* Current time indicator */}
      {now < latestTime && now > earliestTime && (
        <div
          className="absolute start-0 w-full px-4 flex justify-center items-center z-10"
          style={{
            top: `${
              (1 + (now.getHours() - earliestHour) + now.getMinutes() / 60) *
              HOUR_HEIGHT
            }px`,
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
