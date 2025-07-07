'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'

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
          'A date field component that allows users to enter and edit date.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 20))

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        showOutsideDays
        showYearSwitcher
        labels={{
          labelNav: () => 'Select a date',
        }}
      />
    )
  },
}

export const RuLocale: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <Calendar
        locale={ru}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        captionLayout="dropdown"
        showOutsideDays
        showYearSwitcher
        labels={{
          labelNav: () => 'Select a date',
        }}
      />
    )
  },
}

export const RangeSelected: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2025, 0, 27),
      to: new Date(2025, 0, 31),
    })

    return (
      <Calendar
        locale={ru}
        mode="range"
        selected={range}
        onSelect={setRange}
        className="rounded-md border shadow"
        captionLayout="dropdown"
        showOutsideDays
        showYearSwitcher
        labels={{
          labelNav: () => 'Select a date',
        }}
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
        locale={ru}
        mode="multiple"
        selected={selected}
        onSelect={setSelected}
        className="rounded-md border shadow"
        captionLayout="label"
        showOutsideDays
        showYearSwitcher
        labels={{
          labelNav: () => 'Select a date',
        }}
      />
    )
  },
}
