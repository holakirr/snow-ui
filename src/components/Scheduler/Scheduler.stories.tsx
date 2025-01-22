import type { Meta, StoryObj } from '@storybook/react'

import type { CalendarEvent } from '../../types'
import { Button } from '../Button'
import { Input } from '../Input'
import { Sheet, SheetContent, SheetTrigger } from '../Sheet'
import { Text } from '../Text'
import { Scheduler } from './Scheduler'

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(2025, 0, 24, 10), // Jan 24, 2025, 10:00
    endsAt: new Date(2025, 0, 24, 11, 30), // Jan 24, 2025, 11:00
  },
  {
    id: '2',
    title: 'Lunch Break',
    date: new Date(2025, 0, 23, 12), // Jan 23, 2025, 12:00
    endsAt: new Date(2025, 0, 23, 13, 30), // Jan 23, 2025, 13:00
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
        date: new Date(2025, 0, 24, 10, 0),
        endsAt: new Date(2025, 0, 24, 10, 50),
        dropdownContentRenderer: ({ title, date, id, endsAt }) => (
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-col">
              <Text>
                {id}-{title}
              </Text>

              <Text>
                {date.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: 'numeric',
                })}
                -
                {endsAt.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: 'numeric',
                })}
              </Text>
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger>
                  <Button label="Edit" variant="filled" />
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col text-black text-2xl gap-6 pt-8">
                    <Text>#{id}</Text>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <Text>Title: {title}</Text>
                        <Input defaultValue={title} />
                      </div>
                      <div className="flex flex-col">
                        <Text>
                          Starts at:{' '}
                          {date.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        </Text>
                        <Input
                          defaultValue={date.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Text>
                          Ends at:{' '}
                          {endsAt.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: 'numeric',
                          })}
                        </Text>
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
