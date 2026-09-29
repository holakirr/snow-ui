import type { ComponentProps, FC } from 'react'
import { TEXT_SIZES } from '../../constants'
import type { CalendarEvent } from '../../types'
import { twMerge } from '../../utils/tw-merge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { useSnowUI } from '../SnowUIProvider'
import { Typography } from '../Text'
import { DEFAULT_LANG, formatTime, HOUR_HEIGHT } from './constants'

export type EventItemProps = ComponentProps<'div'> & {
  event: CalendarEvent
  onEventClick: (event: CalendarEvent) => void
}

export const EventItem: FC<EventItemProps> = ({
  event,
  onEventClick,
  className,
}) => {
  const { endsAt, date, title, dropdownContentRenderer } = event
  const lang = useSnowUI().locale?.code ?? DEFAULT_LANG

  const duration = endsAt.getTime() - date.getTime()
  const durationInHours = duration / 1000 / 60 / 60

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* biome-ignore lint/a11y/useSemanticElements: a <button> can't contain the block layout used here */}
        <div
          role="button"
          tabIndex={0}
          className={twMerge(
            'w-full bg-color-2 flex flex-col gap-2 p-2 rounded-8 absolute z-[1] focus-ring',
            className,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onEventClick(event)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              onEventClick(event)
            }
          }}
          style={{
            height: `${durationInHours * HOUR_HEIGHT}px`,
            top: `${(date.getMinutes() / 60) * 100}%`,
            minHeight: `${HOUR_HEIGHT}px`,
          }}
        >
          <div className="flex flex-col text-nowrap text-static-black">
            <Typography size={TEXT_SIZES[12]} className="truncate">
              {title}
            </Typography>

            <div className="flex gap-0.5 text-nowrap opacity-60">
              <Typography size={TEXT_SIZES[12]}>
                {formatTime(date, lang)}
              </Typography>

              <Typography size={TEXT_SIZES[12]}>-</Typography>

              <Typography size={TEXT_SIZES[12]}>
                {formatTime(endsAt, lang)}
              </Typography>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {dropdownContentRenderer ? (
          dropdownContentRenderer(event)
        ) : (
          <div className="flex flex-col gap-2 p-2">
            <Typography size={TEXT_SIZES[12]}>{title}</Typography>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
