import type { Meta, StoryObj } from '@storybook/react-vite'
import { addDays, setHours, setMinutes, startOfWeek } from 'date-fns'

import type { CalendarEvent } from '../../types'
import { Button } from '../Button'
import { Input } from '../Input'
import { Sheet, SheetContent, SheetTrigger } from '../Sheet'
import { Typography } from '../Text'
import { Scheduler } from './Scheduler'

/**
 * A time in the current week (`day` 0 is its Monday), so the events are in
 * the week the stories show (`currentDate: new Date()`).
 */
const thisWeek = (day: number, hours: number, minutes = 0) =>
  setMinutes(
    setHours(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), day), hours),
    minutes,
  )

const sampleEvents: CalendarEvent[] = [
  {
    id: '0',
    title: 'Standup Very Long Title',
    date: thisWeek(6, 9, 30), // Sunday, 9:30
    endsAt: thisWeek(6, 10, 30), // Sunday, 10:30
  },
  {
    id: '1',
    title: 'Team Meeting',
    date: thisWeek(4, 10), // Friday, 10:00
    endsAt: thisWeek(4, 11, 30), // Friday, 11:30
  },
  {
    id: '2',
    title: 'Lunch Break',
    date: thisWeek(3, 12), // Thursday, 12:00
    endsAt: thisWeek(3, 13, 30), // Thursday, 13:30
  },
]

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler',
  component: Scheduler,
  tags: ['autodocs'],
  args: {
    currentDate: new Date(),
    events: sampleEvents,
  },
}

export default meta
type Story = StoryObj<typeof Scheduler>

export const Default: Story = {
  args: {
    events: [],
    onEventClick: (event) => console.log('Event clicked:', event),
    onDateClick: (date) => console.log('Date clicked:', date),
  },
}

export const WithEvents: Story = {
  args: {
    onEventClick: (event) => console.log('Event clicked:', event),
    onDateClick: (date) => console.log('Date clicked:', date),
  },
}

export const MultipleEventsPerHour: Story = {
  args: {
    currentDate: new Date(),
    events: [
      ...sampleEvents,
      {
        id: '3',
        title: 'Quick Sync',
        date: thisWeek(4, 10), // Friday, 10:00
        endsAt: thisWeek(4, 10, 50), // Friday, 10:50
        dropdownContentRenderer: ({ title, date, id, endsAt }) => (
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-col">
              <Typography>
                {id}-{title}
              </Typography>

              <Typography>
                {date.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: 'numeric',
                })}
                -
                {endsAt.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: 'numeric',
                })}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger>
                  <Button label="Edit" variant="filled" />
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col text-black text-2xl gap-6 pt-8">
                    <Typography>#{id}</Typography>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <Typography>Title: {title}</Typography>
                        <Input defaultValue={title} />
                      </div>
                      <div className="flex flex-col">
                        <Typography>
                          Starts at:{' '}
                          {date.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        </Typography>
                        <Input
                          defaultValue={date.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Typography>
                          Ends at:{' '}
                          {endsAt.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        </Typography>
                        <Input
                          defaultValue={endsAt.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button label="Share" variant="filled" />
            </div>
          </div>
        ),
      },
    ],
    onEventClick: (event) => console.log('Event clicked:', event),
    onDateClick: (date) => console.log('Date clicked:', date),
  },
}

export const WithWeekStartsFromSunday: Story = {
  args: {
    events: [],
    startOfWeek: 0,
  },
}
