'use client'

import { type FC, Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { TEXT_SIZES } from '../../constants'
import type { CalendarEvent, StartOfWeek } from '../../types'
import {
  getEarliestScheduleHour,
  getLatestScheduleHour,
  getWeekDates,
} from '../../utils'
import { Separator } from '../Separator'
import { Tag } from '../Tag'
import { Text } from '../Text'
import { EventItem } from './EventItem'
import { HOUR_HEIGHT } from './constants'

type SchedulerProps = {
  currentDate: Date
  events?: CalendarEvent[]
  startOfWeek?: StartOfWeek
  onEventClick: (event: CalendarEvent) => void
  onDateClick: (date: Date) => void
}

const Scheduler: FC<SchedulerProps> = ({
  currentDate,
  events = [],
  startOfWeek = 1,
  onEventClick,
  onDateClick,
}) => {
  const weekDates = getWeekDates(currentDate, startOfWeek)
  let hours: number[] = []

  const earliestHour = getEarliestScheduleHour(events)
  const earliestTime = new Date(new Date().setHours(earliestHour))
  const latestHour = getLatestScheduleHour(events)
  const latestTime = new Date(new Date().setHours(latestHour))
  const now = new Date()
  const currHour = new Date(new Date().setHours(10))

  if (events) {
    hours = Array.from(
      { length: latestHour - earliestHour },
      (_, i) => i + earliestHour,
    )
  }

  return (
    <div
      style={{
        gridAutoRows: `${HOUR_HEIGHT}px`,
      }}
      className="grid grid-cols-[59px_repeat(7,100px)] gap-x-4 relative"
    >
      <div className="col-span-1" />
      {weekDates.map((date, i) => (
        <Fragment key={date.toLocaleDateString()}>
          <div
            key={date.toLocaleDateString()}
            className="flex justify-center items-center"
          >
            <Text
              size={TEXT_SIZES[12]}
              className={twMerge(
                'text-black/40 px-1 py-0.5 rounded',
                date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                  ? 'bg-indigo text-[#fff]'
                  : '',
              )}
            >
              {date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
              })}
            </Text>
          </div>
          {i > 0 && (
            <Separator
              style={{
                right:
                  i === 1 ? `calc(108*${i}px)` : `calc(108px + 116*${i - 1}px)`,
              }}
              orientation="vertical"
              className="absolute bg-black/4"
            />
          )}
        </Fragment>
      ))}
      {hours.map((hour) => (
        <Fragment key={hour}>
          <div className="text-left w-fit">
            <Text size={TEXT_SIZES[12]} className="text-black/40">
              {new Date(new Date().setHours(hour)).toLocaleTimeString('en-US', {
                hour: 'numeric',
              })}
            </Text>
          </div>
          {weekDates.map((date) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={date.toLocaleDateString() + hour}
              onClick={() => {
                const clickedDate = new Date(date)
                clickedDate.setHours(hour)
                onDateClick(clickedDate)
              }}
              className="relative"
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
                    key={event.title}
                    className={twMerge(
                      'bg-bg4 text-blue-800 p-1 text-sm rounded cursor-pointer',
                      `mt-[${event.date.getMinutes() / 60}%]`,
                    )}
                    onEventClick={onEventClick}
                    event={event}
                  />
                ))}
            </div>
          ))}
        </Fragment>
      ))}
      {events && currHour < latestTime && currHour > earliestTime && (
        <div
          className={twMerge(
            'absolute left-0 w-full px-4 flex justify-center items-center z-10',
          )}
          style={{
            top: `calc(20px + ${((currHour.getTime() - earliestTime.getTime()) / 1000 / 60 / 60 / hours.length) * 100}%)`,
          }}
        >
          <Tag
            label={currHour
              .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
              })
              .substring(0, 5)}
            className="bg-brand text-white font-normal text-xs text-nowrap"
          />
          <Separator className="bg-brand" />
        </div>
      )}
    </div>
  )
}

export { Scheduler }
