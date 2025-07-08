import type { ComponentProps, FC } from 'react'

import { TEXT_SIZES } from '../../constants'
import type { CalendarEvent } from '../../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { Text } from '../Text'
import { HOUR_HEIGHT } from './constants'

export type EventItemProps = ComponentProps<'div'> & {
  event: CalendarEvent
  onEventClick: (event: CalendarEvent) => void
}

export const EventItem: FC<EventItemProps> = ({ event, onEventClick }) => {
  const { endsAt, date, title, dropdownContentRenderer } = event

  const duration = endsAt.getTime() - date.getTime()
  const durationInHours = duration / 1000 / 60 / 60

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: since we are using onClick */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: since we are using onClick */}
        <div
          className="w-full bg-bg4 flex flex-col gap-2 p-2 rounded-lg cursor-pointer absolute z-[1]"
          onClick={(e) => {
            e.stopPropagation()
            onEventClick(event)
          }}
          style={{
            height: `${durationInHours * HOUR_HEIGHT}px`,
            top: `${(date.getMinutes() / 60) * 100}%`,
            minHeight: `${HOUR_HEIGHT}px`,
          }}
        >
          <div className="flex flex-col text-nowrap text-[#000]">
            <Text size={TEXT_SIZES[12]} className="truncate">
              {title}
            </Text>

            <div className="flex gap-0.5 text-nowrap opacity-40">
              <Text size={TEXT_SIZES[12]}>
                {date
                  .toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: 'numeric',
                  })
                  .substring(0, 5)}
              </Text>

              <Text size={TEXT_SIZES[12]}>-</Text>

              <Text size={TEXT_SIZES[12]}>
                {endsAt
                  .toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: 'numeric',
                  })
                  .substring(0, 5)}
              </Text>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {dropdownContentRenderer ? (
          dropdownContentRenderer(event)
        ) : (
          <div className="flex flex-col gap-2 p-2">
            <Text size={TEXT_SIZES[12]}>{title}</Text>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
