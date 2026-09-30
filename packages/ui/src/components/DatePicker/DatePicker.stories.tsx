import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor, within } from 'storybook/test'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../react-hook-form'
import { Button } from '../Button'
import { Label } from '../Label'
import { Typography } from '../Text'
import { DatePicker } from './DatePicker'

/** A DatePicker with a visible `Label`, as in a form. */
const Labelled = ({
  label = 'Due date',
  ...props
}: Parameters<typeof DatePicker>[0] & { label?: string }) => {
  const id = useId()
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <DatePicker id={id} {...props} />
    </div>
  )
}

// While the modal calendar is open, Radix hides the page with aria-hidden.
const openParameters = {
  layout: 'padded',
  a11y: {
    config: {
      rules: [
        {
          // False positive, as on Select "Open": while the modal calendar is
          // open, Radix hides the rest of the page with aria-hidden and traps
          // focus in the popover, so the field can't be focused. axe sees a
          // focusable button under aria-hidden but not the trap.
          id: 'aria-hidden-focus',
          enabled: false,
        },
      ],
    },
  },
}

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs', 'a11y'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-89331',
    },
    docs: {
      description: {
        component:
          'A field that opens the Figma DatePicker (`Calendar`) in a popover to pick a date. The field is a `<button role="combobox">` in the look of the Figma Input; the calendar is a modal dialog where focus goes to the picked day, the arrow keys move between days, Enter picks one and closes it, and Escape closes it without a change.',
      },
    },
  },
  args: {
    onValueChange: fn(),
  },
  render: (args) => <Labelled {...args} />,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: new Date(2025, 0, 20) },
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Due date' })
    await expect(field).toHaveTextContent('Jan 20, 2025')
    await expect(field).toHaveAttribute('aria-haspopup', 'dialog')

    await step('a click opens the calendar on the picked day', async () => {
      await userEvent.click(field)
      await page.findByRole('dialog', { name: 'Choose a date' })
      await expect(field).toHaveAttribute('aria-expanded', 'true')
      await waitFor(() =>
        expect(
          page.getByRole('button', { name: /January 20th, 2025/ }),
        ).toHaveFocus(),
      )
    })

    await step('the arrow keys move, Enter picks and closes', async () => {
      await userEvent.keyboard('{ArrowRight}{ArrowDown}')
      await expect(
        page.getByRole('button', { name: /January 28th, 2025/ }),
      ).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(args.onValueChange).toHaveBeenLastCalledWith(
        new Date(2025, 0, 28),
      )
      await expect(field).toHaveTextContent('Jan 28, 2025')
      await expect(field).toHaveFocus()
    })

    await step('↓ opens it, Escape closes it without a change', async () => {
      await userEvent.keyboard('{ArrowDown}')
      await page.findByRole('dialog')
      await userEvent.keyboard('{ArrowLeft}{Escape}')
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveTextContent('Jan 28, 2025')
      await expect(field).toHaveFocus()
    })

    await step('Backspace clears it', async () => {
      await userEvent.keyboard('{Backspace}')
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
      await expect(field).toHaveTextContent('Pick a date')
      await expect(
        canvas.queryByRole('button', { name: 'Clear date' }),
      ).not.toBeInTheDocument()
    })
  },
}

/** The field and the Figma DatePicker, open. */
export const Open: Story = {
  args: { defaultValue: new Date(2025, 0, 20), defaultOpen: true },
  parameters: openParameters,
  render: (args) => (
    <div className="h-[30rem]">
      <Labelled {...args} />
    </div>
  ),
}

export const OpenDark: Story = {
  ...Open,
  globals: { theme: 'dark' },
}

/**
 * The Figma "Date and time" type: `withTime` adds the time to the top area
 * ("04 : 08 PM"; 24-hour in a 24-hour locale, or with `hourCycle={24}`).
 * Picking a day keeps the calendar open; closing it, or Enter in the top
 * area, confirms.
 */
export const DateAndTime: Story = {
  args: {
    defaultValue: new Date(2025, 0, 20, 16, 8),
    defaultOpen: true,
    withTime: true,
  },
  parameters: openParameters,
  render: Open.render,
}

/** `withSeconds`: "04 : 08 : 12 PM". */
export const WithSeconds: Story = {
  args: {
    defaultValue: new Date(2025, 0, 20, 16, 8, 12),
    defaultOpen: true,
    withSeconds: true,
  },
  parameters: openParameters,
  render: Open.render,
}

/**
 * The month in the top area (or the "Jan" caption) opens the months, the
 * year the years; "Back" returns to the days.
 */
export const MonthsView: Story = {
  args: { defaultValue: new Date(2025, 0, 20), defaultOpen: true },
  parameters: openParameters,
  render: Open.render,
  play: async ({ canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(
      await page.findByRole('spinbutton', { name: 'Month' }),
    )
    const months = page.getByRole('grid', { name: '2025' })
    await expect(
      within(months).getByRole('button', { name: 'January 2025' }),
    ).toHaveAttribute('data-selected')
  },
}

export const YearsView: Story = {
  args: { defaultValue: new Date(2025, 0, 20), defaultOpen: true },
  parameters: openParameters,
  render: Open.render,
  play: async ({ canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(await page.findByRole('spinbutton', { name: 'Year' }))
    await expect(page.getByRole('button', { name: '2025' })).toHaveAttribute(
      'data-selected',
    )
  },
}

/**
 * The hour in the top area opens the hours; picking one goes on to the
 * minutes. AM / PM switch on the right (or as you type: 13 is 01 PM).
 */
export const TimeView: Story = {
  args: {
    defaultValue: new Date(2025, 0, 20, 16, 8),
    defaultOpen: true,
    withTime: true,
  },
  parameters: openParameters,
  render: Open.render,
  play: async ({ canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(await page.findByRole('spinbutton', { name: 'Hour' }))
    await expect(page.getByRole('grid', { name: 'Hour' })).toBeInTheDocument()
    await expect(page.getByRole('button', { name: 'PM' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}

/**
 * The top area is a date field: the arrow keys step a part, digits fill it
 * and move on, and the calendar follows; Enter closes it with the date.
 */
export const Typing: Story = {
  args: { defaultValue: new Date(2025, 0, 20), defaultOpen: true },
  parameters: openParameters,
  render: Open.render,
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    const month = await page.findByRole('spinbutton', { name: 'Month' })
    await userEvent.click(month)
    await userEvent.keyboard('3')
    await expect(month).toHaveAttribute('aria-valuenow', '3')
    await expect(page.getByRole('spinbutton', { name: 'Day' })).toHaveFocus()
    await userEvent.keyboard('15{ArrowUp}')
    await expect(
      page.getByRole('spinbutton', { name: 'Year' }),
    ).toHaveAttribute('aria-valuenow', '2026')
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenCalledWith(new Date(2026, 2, 15))
    // The page is hidden from assistive technology until the popover is gone.
    await waitFor(() =>
      expect(canvas.getByRole('combobox')).toHaveTextContent('Mar 15, 2026'),
    )
  },
}

/**
 * `title`: the Figma "2 row" field of a form, the title inside the field
 * above the value.
 */
export const WithTitle: Story = {
  args: { title: 'Due date', defaultValue: new Date(2026, 1, 1) },
  render: (args) => (
    <div className="w-72">
      <DatePicker {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('combobox', { name: 'Due date' }),
    ).toHaveTextContent('Feb 1, 2026')
  },
}

/**
 * `minDate` and `maxDate` limit the days (and the months the calendar
 * shows); `disabledDates` takes react-day-picker matchers, here weekends.
 */
export const MinMaxAndDisabledDates: Story = {
  args: {
    defaultValue: new Date(2025, 0, 15),
    minDate: new Date(2025, 0, 6),
    maxDate: new Date(2025, 1, 14),
    disabledDates: { dayOfWeek: [0, 6] },
  },
  render: (args) => <Labelled label="Delivery date" {...args} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Delivery date' }),
    )
    await page.findByRole('dialog')
    await expect(
      page.getByRole('button', { name: /January 5th, 2025/ }),
    ).toBeDisabled()
    await expect(
      page.getByRole('button', { name: /January 11th, 2025/ }),
    ).toBeDisabled()
    await expect(
      page.getByRole('button', { name: /previous month/i }),
    ).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  },
}

/** `calendarProps`: month and year dropdowns and the "Today" action. */
export const CalendarOptions: Story = {
  args: {
    defaultOpen: true,
    defaultValue: new Date(2025, 5, 12),
    calendarProps: {
      captionLayout: 'dropdown',
      startMonth: new Date(2020, 0, 1),
      endMonth: new Date(2030, 11, 1),
      showTodayButton: true,
      showYearSwitcher: false,
    },
  },
  parameters: openParameters,
  render: Open.render,
}

/**
 * Localized by `SnowUIProvider` (the "Locale" toolbar, pinned to Russian
 * here): the date is formatted with its `locale`, the placeholder and the
 * names come from `messages.datePicker`.
 */
export const Localized: Story = {
  globals: { locale: 'ru' },
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date(2025, 0, 20))
    return (
      <div className="flex flex-col gap-4">
        <Labelled label="Срок" value={date} onValueChange={setDate} />
        <Labelled label="Начало" />
      </div>
    )
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('combobox', { name: 'Срок' }),
    ).toHaveTextContent('20 янв. 2025 г.')
    await expect(
      canvas.getByRole('combobox', { name: 'Начало' }),
    ).toHaveTextContent('Выберите дату')
    await expect(
      canvas.getByRole('button', { name: 'Очистить дату' }),
    ).toBeInTheDocument()
  },
}

/** Placeholder, a value, invalid and disabled fields. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Labelled {...args} label="Placeholder" />
      <Labelled {...args} label="Value" defaultValue={new Date(2025, 0, 20)} />
      <Labelled
        {...args}
        label="Invalid"
        defaultValue={new Date(2025, 0, 20)}
        aria-invalid
      />
      <Labelled
        {...args}
        label="Disabled"
        defaultValue={new Date(2025, 0, 20)}
        disabled
      />
    </div>
  ),
}

/**
 * Right-to-left text: the icon and the clear button are on the left, the
 * calendar mirrors (see Calendar › RTL).
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  args: { defaultValue: new Date(2025, 0, 20) },
  render: (args) => <Labelled label="التاريخ" {...args} />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole('combobox', { name: 'التاريخ' })
    const clear = canvas.getByRole('button', { name: 'Clear date' })
    await expect(clear.getBoundingClientRect().left).toBeLessThan(
      field.getBoundingClientRect().left + 64,
    )
    await expect(getComputedStyle(field).direction).toBe('rtl')
  },
}

const formSchema = z.object({
  due: z.date({ error: 'Pick a due date.' }),
})

const FormExample = () => {
  const [submitted, setSubmitted] = useState<Date>()
  const form = useForm<
    z.input<typeof formSchema>,
    unknown,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setSubmitted(values.due))}
        className="flex w-72 flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="due"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={field.disabled}
                  calendarProps={{ defaultMonth: new Date(2025, 0, 1) }}
                />
              </FormControl>
              <FormDescription>When the task is due.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="filled" type="submit" label="Save" />
        {submitted && (
          <Typography size={12} className="text-secondary">
            Due: {submitted.toDateString()}
          </Typography>
        )}
      </form>
    </Form>
  )
}

/**
 * With react-hook-form: `value` / `onValueChange` bind the field, `ref` lets
 * the form focus it on an error, `FormControl` sets `id`, `aria-invalid` and
 * `aria-describedby`.
 */
export const InForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Due date' })

    await step(
      'submitting it empty shows the error and focuses it',
      async () => {
        await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
        await expect(await canvas.findByText('Pick a due date.')).toBeVisible()
        await expect(field).toHaveAttribute('aria-invalid', 'true')
        await expect(field).toHaveAccessibleDescription(
          expect.stringContaining('Pick a due date.'),
        )
        await expect(field).toHaveFocus()
      },
    )

    await step('picking a date clears it', async () => {
      await userEvent.keyboard('{Enter}')
      await page.findByRole('dialog')
      await userEvent.click(
        page.getByRole('button', { name: /January 15th, 2025/ }),
      )
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveAttribute('aria-invalid', 'false')
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
      await expect(
        await canvas.findByText('Due: Wed Jan 15 2025'),
      ).toBeVisible()
    })
  },
}
