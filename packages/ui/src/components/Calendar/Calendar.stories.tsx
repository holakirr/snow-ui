'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { expect } from 'storybook/test'

import { Calendar } from './Calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          'The Figma DatePicker: a glass surface (Background/3, "Glass 2", 1px Surface/1 stroke, radius 16), weeks starting on Monday, 12 Regular days, the selected day in Primary, today in Secondary/Indigo and outside days in `text-secondary` (Figma: Black/40%, 2.85:1). `header` adds the top row (e.g. a date input); `showTodayButton` and `lastSelection` add the "Today" and "Last selection" actions.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

// The Figma frames show February 2023 (1 February is a Wednesday) with the
// 10th as today.
const FIGMA_TODAY = new Date(2023, 1, 10)
const FIGMA_MONTH = new Date(2023, 1, 1)

/** The Figma top row: month / day / year segments and "/" (Figma: Black/20%; `text-secondary` here). */
const DateDisplay = ({ date }: { date?: Date }) => {
  const parts = date
    ? [
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
        String(date.getFullYear()),
      ]
    : ['MM', 'DD', 'YYYY']

  return (
    <output aria-label="Selected date" className="flex items-center text-14">
      {parts.map((part, index) => (
        <span key={part + String(index)} className="flex items-center">
          {index > 0 && <span className="text-secondary">/</span>}
          <span
            className={`rounded-4 px-1 py-0.5 ${date ? '' : 'text-secondary'}`}
          >
            {part}
          </span>
        </span>
      ))}
    </output>
  )
}

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 20))

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2025, 0, 1)}
      />
    )
  },
  play: async ({ canvas, userEvent, step }) => {
    const grid = () => canvas.getByRole('grid')
    const cell = (label: RegExp) =>
      canvas.getByRole('button', { name: label }).closest('[role="gridcell"]')

    await expect(grid()).toHaveAccessibleName(/January 2025/)
    await expect(cell(/January 20th, 2025/)).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await step('Next and Previous change the month', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /next month/i }))
      await expect(grid()).toHaveAccessibleName(/February 2025/)
      await userEvent.click(
        canvas.getByRole('button', { name: /previous month/i }),
      )
      await userEvent.click(
        canvas.getByRole('button', { name: /previous month/i }),
      )
      await expect(grid()).toHaveAccessibleName(/December 2024/)
      await userEvent.click(canvas.getByRole('button', { name: /next month/i }))
      await expect(grid()).toHaveAccessibleName(/January 2025/)
    })

    await step('a click selects a day', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: /January 14th, 2025/ }),
      )
      await expect(cell(/January 14th, 2025/)).toHaveAttribute(
        'aria-selected',
        'true',
      )
      await expect(cell(/January 20th, 2025/)).not.toHaveAttribute(
        'aria-selected',
        'true',
      )
    })

    await step('arrow keys move between days, Enter selects', async () => {
      await userEvent.keyboard('{ArrowRight}')
      await expect(
        canvas.getByRole('button', { name: /January 15th, 2025/ }),
      ).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      await expect(
        canvas.getByRole('button', { name: /January 22nd, 2025/ }),
      ).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect(cell(/January 22nd, 2025/)).toHaveAttribute(
        'aria-selected',
        'true',
      )
    })
  },
}

/** The Figma "Date only" DatePicker: header, toolbar actions and the grid. */
export const DatePicker: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    const [lastSelection] = useState(new Date(2022, 9, 22))

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        today={FIGMA_TODAY}
        defaultMonth={FIGMA_MONTH}
        showYearSwitcher={false}
        formatters={{
          formatCaption: (month) =>
            month.toLocaleDateString('en-US', { month: 'short' }),
        }}
        header={<DateDisplay date={date ?? lastSelection} />}
        showTodayButton
        onTodayClick={setDate}
        lastSelection={lastSelection}
        onLastSelectionClick={setDate}
      />
    )
  },
}

export const DatePickerDark: Story = {
  ...DatePicker,
  globals: { theme: 'dark' },
}

/** Hover a day for the Figma "Hover state"; today and a selected day. */
export const States: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2023, 1, 17))

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        today={FIGMA_TODAY}
        defaultMonth={FIGMA_MONTH}
      />
    )
  },
}

export const RangeSelected: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2023, 1, 21),
      to: new Date(2023, 1, 25),
    })

    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        today={FIGMA_TODAY}
        defaultMonth={FIGMA_MONTH}
        showTodayButton
      />
    )
  },
}

export const RangeSelectedDark: Story = {
  ...RangeSelected,
  globals: { theme: 'dark' },
}

export const TwoMonths: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2023, 1, 21),
      to: new Date(2023, 2, 3),
    })

    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        today={FIGMA_TODAY}
        defaultMonth={FIGMA_MONTH}
      />
    )
  },
}

export const MultipleSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date[] | undefined>([
      new Date(2025, 0, 27),
      new Date(2025, 0, 31),
    ])

    return (
      <Calendar
        mode="multiple"
        selected={selected}
        onSelect={setSelected}
        defaultMonth={new Date(2025, 0, 1)}
      />
    )
  },
}

/** `weekStartsOn={0}` restores a Sunday start. */
export const WeekStartsOnSunday: Story = {
  render: () => (
    <Calendar
      mode="single"
      weekStartsOn={0}
      defaultMonth={new Date(2025, 0, 1)}
    />
  ),
}

export const RuLocale: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 20))

    return (
      <Calendar
        locale={ru}
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2025, 0, 1)}
        captionLayout="dropdown"
        showTodayButton
        todayLabel="Сегодня"
        onTodayClick={setDate}
      />
    )
  },
}

/** Month / year dropdowns in the caption, over two months. */
export const RangeWithDropdowns: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2025, 0, 27),
      to: new Date(2025, 1, 4),
    })

    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        captionLayout="dropdown"
        startMonth={new Date(2020, 0, 1)}
        endMonth={new Date(2030, 11, 1)}
        selected={range}
        onSelect={setRange}
        defaultMonth={new Date(2025, 0, 1)}
      />
    )
  },
}
