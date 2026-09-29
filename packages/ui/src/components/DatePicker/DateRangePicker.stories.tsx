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
import { DateRangePicker } from './DateRangePicker'

/** A DateRangePicker with a visible `Label`, as in a form. */
const Labelled = ({
  label = 'Stay',
  ...props
}: Parameters<typeof DateRangePicker>[0] & { label?: string }) => {
  const id = useId()
  return (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <DateRangePicker id={id} {...props} />
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
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs', 'a11y'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-89331',
    },
    docs: {
      description: {
        component:
          'A field that opens the Figma DatePicker (`Calendar`, range mode) in a popover to pick a range: the first click or Enter picks the start, the second the end, and the calendar closes. While the end is being picked, the range follows the pointer.',
      },
    },
  },
  args: {
    onValueChange: fn(),
  },
  render: (args) => <Labelled {...args} />,
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) },
  },
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Stay' })
    const day = (name: RegExp) => page.getByRole('button', { name })
    await expect(field).toHaveTextContent('Jan 13, 2025 – Jan 16, 2025')

    await step('two clicks pick a new range and close it', async () => {
      await userEvent.click(field)
      await page.findByRole('dialog', { name: 'Choose a date range' })
      await waitFor(() => expect(day(/January 13th, 2025/)).toHaveFocus())
      await userEvent.click(day(/January 22nd, 2025/))
      // The old range is gone; the end follows the pointer.
      await userEvent.hover(day(/January 24th, 2025/))
      await expect(
        day(/January 23rd, 2025/).closest('[role="gridcell"]'),
      ).toHaveAttribute('aria-selected', 'true')
      await expect(
        day(/January 14th, 2025/).closest('[role="gridcell"]'),
      ).not.toHaveAttribute('aria-selected')
      await userEvent.click(day(/January 20th, 2025/))
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      // Picked backwards: the ends are put in order.
      await expect(args.onValueChange).toHaveBeenLastCalledWith({
        from: new Date(2025, 0, 20),
        to: new Date(2025, 0, 22),
      })
      await expect(field).toHaveTextContent('Jan 20, 2025 – Jan 22, 2025')
      await expect(field).toHaveFocus()
    })

    await step('the keyboard picks a range too', async () => {
      await userEvent.keyboard('{Enter}')
      await page.findByRole('dialog')
      await waitFor(() => expect(day(/January 20th, 2025/)).toHaveFocus())
      await userEvent.keyboard('{Enter}{ArrowDown}{Enter}')
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveTextContent('Jan 20, 2025 – Jan 27, 2025')
    })

    await step('closing after one day keeps the old range', async () => {
      await userEvent.keyboard('{Enter}')
      await page.findByRole('dialog')
      await userEvent.keyboard('{ArrowRight}{Enter}{Escape}')
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveTextContent('Jan 20, 2025 – Jan 27, 2025')
    })

    await step('the clear button clears it', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Clear date' }))
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
      await expect(field).toHaveTextContent('Pick a date range')
      await expect(field).toHaveFocus()
    })
  },
}

/** The field and the calendar with a range, open. */
export const Open: Story = {
  args: {
    defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) },
    defaultOpen: true,
  },
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

/** `numberOfMonths={2}`: two months side by side, for ranges across months. */
export const TwoMonths: Story = {
  args: {
    defaultValue: { from: new Date(2025, 0, 27), to: new Date(2025, 1, 4) },
    defaultOpen: true,
    numberOfMonths: 2,
  },
  parameters: openParameters,
  render: Open.render,
}

/** `minDate`, `maxDate` and weekends disabled (`disabledDates`). */
export const MinMaxAndDisabledDates: Story = {
  args: {
    defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 17) },
    minDate: new Date(2025, 0, 6),
    maxDate: new Date(2025, 2, 28),
    disabledDates: { dayOfWeek: [0, 6] },
  },
  render: (args) => <Labelled label="Sprint" {...args} />,
}

/** Placeholder, a value, invalid and disabled fields. */
export const States: Story = {
  render: (args) => {
    const range = { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) }
    return (
      <div className="flex flex-col gap-4">
        <Labelled {...args} label="Placeholder" />
        <Labelled {...args} label="Value" defaultValue={range} />
        <Labelled {...args} label="Invalid" defaultValue={range} aria-invalid />
        <Labelled {...args} label="Disabled" defaultValue={range} disabled />
      </div>
    )
  },
}

/** Right-to-left text: the range reads from the right. */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  args: {
    defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) },
    defaultOpen: true,
  },
  parameters: openParameters,
  render: (args) => (
    <div className="h-[30rem]">
      <Labelled label="الإقامة" {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const start = await page.findByRole('button', {
      name: /January 13th, 2025/,
    })
    const end = page.getByRole('button', { name: /January 16th, 2025/ })
    await expect(start.getBoundingClientRect().left).toBeGreaterThan(
      end.getBoundingClientRect().left,
    )
  },
}

const formSchema = z.object({
  stay: z.object(
    { from: z.date(), to: z.date() },
    { error: 'Pick your arrival and departure.' },
  ),
})

const FormExample = () => {
  const [submitted, setSubmitted] = useState<string>()
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
        onSubmit={form.handleSubmit(({ stay }) =>
          setSubmitted(
            `${stay.from.toDateString()} – ${stay.to.toDateString()}`,
          ),
        )}
        className="flex w-80 flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="stay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stay</FormLabel>
              <FormControl>
                <DateRangePicker
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={field.disabled}
                  calendarProps={{ defaultMonth: new Date(2025, 0, 1) }}
                />
              </FormControl>
              <FormDescription>Check-in and check-out.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="filled" type="submit" label="Book" />
        {submitted && (
          <Typography size={12} className="text-secondary">
            Booked: {submitted}
          </Typography>
        )}
      </form>
    </Form>
  )
}

/** With react-hook-form: `value` / `onValueChange`, and `ref` for focus on errors. */
export const InForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Stay' })

    await step(
      'submitting it empty shows the error and focuses it',
      async () => {
        await userEvent.click(canvas.getByRole('button', { name: 'Book' }))
        await expect(
          await canvas.findByText('Pick your arrival and departure.'),
        ).toBeVisible()
        await expect(field).toHaveAttribute('aria-invalid', 'true')
        await expect(field).toHaveFocus()
      },
    )

    await step('picking a range clears it', async () => {
      await userEvent.keyboard('{Enter}')
      await page.findByRole('dialog')
      await userEvent.click(
        page.getByRole('button', { name: /January 10th, 2025/ }),
      )
      await userEvent.click(
        page.getByRole('button', { name: /January 12th, 2025/ }),
      )
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveAttribute('aria-invalid', 'false')
      await userEvent.click(canvas.getByRole('button', { name: 'Book' }))
      await expect(
        await canvas.findByText('Booked: Fri Jan 10 2025 – Sun Jan 12 2025'),
      ).toBeVisible()
    })
  },
}
