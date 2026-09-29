import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  addDays,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { expect, fn, waitFor, within } from 'storybook/test'

import type { CalendarEvent } from '../../types'
import { Button } from '../Button'
import { Input } from '../Input'
import { Sheet, SheetContent, SheetTrigger } from '../Sheet'
import { SnowUIProvider } from '../SnowUIProvider'
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

/** The name of the slot that starts at `date`: the date and time in en-US. */
const slotName = (date: Date) => date.toLocaleString('en-US')

/** Ends a play function blurred and scrolled to the top (focus() scrolls). */
const settle = (canvasElement: HTMLElement) => {
  const document = canvasElement.ownerDocument
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  document.defaultView?.scrollTo(0, 0)
}

// WCAG 2.5.8 exception for the Storybook target-size check
// (.storybook/targetSize.ts) in the stories with overlapping events.
const eventExceptions = [
  {
    selector: 'button[data-scheduler-item="slot"]',
    reason:
      'An event covers part or all of the slots of its hours by design (Figma), leaving less than 24px of some: the part under an event is no pointer target for the slot, and the grid keys reach every slot.',
  },
]

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler',
  component: Scheduler,
  tags: ['autodocs'],
  args: {
    currentDate: new Date(),
    events: sampleEvents,
    onEventClick: fn(),
    onDateClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Scheduler>

/** The week starts on Monday, as in the Figma kit. */
export const Default: Story = {
  args: {
    events: [],
  },
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const now = new Date()
    const monday = startOfWeek(now, { weekStartsOn: 1 })
    const grid = canvas.getByRole('grid')

    await step('the week starts on Monday', async () => {
      await expect(canvas.getAllByRole('columnheader')[0]).toHaveTextContent(
        monday.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
        }),
      )
    })

    await step('the grid is named by its week', async () => {
      await expect(grid).toHaveAccessibleName(
        new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
          .formatRange(monday, addDays(monday, 6))
          .replace(/\s+/g, ' '),
      )
    })

    await step('today and the current hour are marked', async () => {
      await expect(
        canvas.getByRole('columnheader', { current: 'date' }),
      ).toHaveTextContent(
        now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      )
      // The grid runs from 7 to 20 without events.
      const current = grid.querySelectorAll('[aria-current="time"]')
      if (now.getHours() >= 7 && now.getHours() <= 20) {
        await expect(current).toHaveLength(1)
        await expect(current[0]).toHaveAccessibleName(
          slotName(setHours(startOfDay(now), now.getHours())),
        )
      } else {
        await expect(current).toHaveLength(0)
      }
    })

    await step("one tab stop: today's current hour", async () => {
      await expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1)
      const hour = Math.min(Math.max(now.getHours(), 7), 20)
      await userEvent.tab()
      await expect(
        canvas.getByRole('button', {
          name: slotName(setHours(startOfDay(now), hour)),
        }),
      ).toHaveFocus()
      // The next Tab leaves the grid.
      await userEvent.tab()
      await expect(grid).not.toContainElement(
        canvasElement.ownerDocument.activeElement as HTMLElement,
      )
    })

    settle(canvasElement)
  },
}

export const WithEvents: Story = {
  parameters: { targetSize: { exceptions: eventExceptions } },
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const slot = (day: number, hour: number) =>
      canvas.getByRole('button', { name: slotName(thisWeek(day, hour)) })
    const lunch = canvas.getByRole('button', { name: /^Lunch Break/ })

    await step(
      'Tab enters the grid, Ctrl+Home goes to its first slot',
      async () => {
        await userEvent.tab()
        await expect(canvas.getByRole('grid')).toContainElement(
          canvasElement.ownerDocument.activeElement as HTMLElement,
        )
        await userEvent.keyboard('{Control>}{Home}{/Control}')
        await expect(slot(0, 7)).toHaveFocus()
      },
    )

    await step(
      'ArrowRight / ArrowLeft move a day, without wrapping',
      async () => {
        await userEvent.keyboard('{ArrowRight}')
        await expect(slot(1, 7)).toHaveFocus()
        await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
        await expect(slot(0, 7)).toHaveFocus()
      },
    )

    await step('End / Home go to the last / first day of the row', async () => {
      await userEvent.keyboard('{End}')
      await expect(slot(6, 7)).toHaveFocus()
      await userEvent.keyboard('{Home}')
      await expect(slot(0, 7)).toHaveFocus()
    })

    await step(
      'PageDown / PageUp move six hours, up to the last row',
      async () => {
        await userEvent.keyboard('{PageDown}')
        await expect(slot(0, 13)).toHaveFocus()
        await userEvent.keyboard('{PageDown}{PageDown}')
        await expect(slot(0, 20)).toHaveFocus()
        await userEvent.keyboard('{PageUp}')
        await expect(slot(0, 14)).toHaveFocus()
      },
    )

    await step('Ctrl+End / Ctrl+Home go to the last / first slot', async () => {
      await userEvent.keyboard('{Control>}{End}{/Control}')
      await expect(slot(6, 20)).toHaveFocus()
      await userEvent.keyboard('{Control>}{Home}{/Control}')
      await expect(slot(0, 7)).toHaveFocus()
    })

    await step(
      'ArrowDown / ArrowUp go down the day, events included',
      async () => {
        // Thursday: Lunch Break starts at 12, after the slot of 12.
        await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
        await userEvent.keyboard('{PageDown}')
        await expect(slot(3, 13)).toHaveFocus()
        await userEvent.keyboard('{ArrowUp}')
        await expect(lunch).toHaveFocus()
        // ArrowDown moves on instead of opening the event's menu.
        await userEvent.keyboard('{ArrowDown}')
        await expect(slot(3, 13)).toHaveFocus()
        await expect(page.queryByRole('menu')).not.toBeInTheDocument()
        await userEvent.keyboard('{ArrowUp}{ArrowUp}')
        await expect(slot(3, 12)).toHaveFocus()
        await userEvent.keyboard('{ArrowDown}')
        await expect(lunch).toHaveFocus()
      },
    )

    await step('Enter opens the event, Escape returns to it', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(args.onEventClick).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Lunch Break' }),
      )
      await page.findByRole('menu')
      await userEvent.keyboard('{Escape}')
      await waitFor(() =>
        expect(page.queryByRole('menu')).not.toBeInTheDocument(),
      )
      await waitFor(() => expect(lunch).toHaveFocus())
    })

    await step('Enter on a slot calls onDateClick with its hour', async () => {
      await userEvent.keyboard('{ArrowDown}{Enter}')
      await expect(args.onDateClick).toHaveBeenLastCalledWith(thisWeek(3, 13))
    })

    settle(canvasElement)
  },
}

export const MultipleEventsPerHour: Story = {
  parameters: { targetSize: { exceptions: eventExceptions } },
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
  },
}

/** `startOfWeek={0}` starts the week on Sunday. */
export const WithWeekStartsFromSunday: Story = {
  args: {
    events: [],
    startOfWeek: 0,
  },
  play: async ({ canvas }) => {
    const sunday = startOfWeek(new Date(), { weekStartsOn: 0 })
    await expect(canvas.getAllByRole('columnheader')[0]).toHaveTextContent(
      sunday.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    )
  },
}

/**
 * `SnowUIProvider`'s `weekStartsOn="locale"` starts the week on the
 * locale's first day: Sunday in the stories' English (Monday with the
 * Russian "Locale" toolbar). `startOfWeek` still wins.
 */
export const LocaleWeekStart: Story = {
  args: {
    events: [],
  },
  decorators: [
    (Story) => (
      <SnowUIProvider weekStartsOn="locale">
        <Story />
      </SnowUIProvider>
    ),
  ],
  play: async ({ canvas }) => {
    const sunday = startOfWeek(new Date(), { weekStartsOn: 0 })
    await expect(canvas.getAllByRole('columnheader')[0]).toHaveTextContent(
      sunday.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    )
  },
}
