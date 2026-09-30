'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { enUS, ru } from 'react-day-picker/locale'
import { expect } from 'storybook/test'

import { SnowUIProvider } from '../SnowUIProvider'
import { Calendar } from './Calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-89331',
    },
    docs: {
      description: {
        component:
          'The Figma DatePicker: a glass surface (Background/3, "Glass 2", 1px Surface/1 stroke, radius 16), weeks starting on Monday (`weekStartsOn` sets another day; `SnowUIProvider`’s `weekStartsOn="locale"` follows the locale), 12 Regular days, the selected day in Primary, today in Secondary/Indigo and outside days in `text-secondary` (Figma: Black/40%, 2.85:1). `header` adds the top row (e.g. a date input); `showTodayButton` and `lastSelection` add the "Today" and "Last selection" actions.',
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
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    // The year view shows 12 years from five years before the current one.
    const currentYear = new Date().getFullYear()
    const from = currentYear - 5
    const switcher = canvas.getByRole('button', { name: 'January 2025' })

    await step('Enter on the year switcher opens the year view', async () => {
      await userEvent.tab()
      await userEvent.tab()
      await expect(switcher).toHaveFocus()
      await expect(switcher).toHaveAttribute('aria-expanded', 'false')
      await userEvent.keyboard('{Enter}')
      await expect(switcher).toHaveAttribute('aria-expanded', 'true')
      const years = canvas.getByRole('group', {
        name: `${from} - ${from + 11}`,
      })
      await expect(switcher).toHaveAttribute('aria-controls', years.id)
    })

    await step('picking a year returns the focus to the switcher', async () => {
      // Past the next-years button to the current year.
      await userEvent.tab()
      for (let year = from; year <= currentYear; year++) {
        await userEvent.tab()
      }
      await expect(
        canvas.getByRole('button', { name: String(currentYear) }),
      ).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      // January (the month of the first selected day) of that year.
      const shown = canvas.getByRole('button', {
        name: `January ${currentYear}`,
      })
      await expect(shown).toHaveFocus()
      await expect(shown).toHaveAttribute('aria-expanded', 'false')
      await expect(canvas.queryByRole('group')).not.toBeInTheDocument()
    })

    // At the pinned clock of the screenshots (2025) this is January 2025
    // again: the story looks as it did before the play function.
    const { activeElement, defaultView } = canvasElement.ownerDocument
    if (activeElement instanceof HTMLElement) activeElement.blur()
    defaultView?.scrollTo(0, 0)
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
  play: async ({ canvasElement }) => {
    const weekdays = canvasElement.querySelectorAll('th[aria-label]')
    await expect(weekdays[0]).toHaveAttribute('aria-label', 'Sunday')
  },
}

/**
 * `SnowUIProvider`'s `weekStartsOn="locale"` starts the week on the
 * locale's first day (`locale.options.weekStartsOn`): Sunday in English,
 * Monday in Russian. A calendar's own `weekStartsOn` still wins.
 */
export const LocaleWeekStart: Story = {
  render: () => (
    <SnowUIProvider weekStartsOn="locale">
      <div className="flex flex-wrap items-start gap-4">
        <SnowUIProvider locale={enUS}>
          <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
        </SnowUIProvider>
        <SnowUIProvider locale={ru}>
          <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
        </SnowUIProvider>
      </div>
    </SnowUIProvider>
  ),
  play: async ({ canvasElement }) => {
    const [en, russian] = canvasElement.querySelectorAll('table')
    await expect(en?.querySelector('th[aria-label]')).toHaveAttribute(
      'aria-label',
      'Sunday',
    )
    await expect(russian?.querySelector('th[aria-label]')).toHaveAttribute(
      'aria-label',
      'понедельник',
    )
  },
}

/**
 * Localized by `SnowUIProvider` (the "Locale" toolbar, pinned to Russian
 * here): its `locale` (react-day-picker's `ru`) names the months, weekdays
 * and days, its `messages` the toolbar actions and the navigation landmark.
 */
export const RuLocale: Story = {
  globals: { locale: 'ru' },
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 20))

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2025, 0, 1)}
        captionLayout="dropdown"
        showTodayButton
        lastSelection={new Date(2024, 11, 3)}
        onTodayClick={setDate}
      />
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('grid')).toHaveAccessibleName(/январь 2025/i)
    await expect(
      canvas.getByRole('navigation', { name: 'Навигация по месяцам' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Сегодня' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Последний выбор' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Предыдущий месяц' }),
    ).toBeInTheDocument()
  },
}

/**
 * The `locale`, `todayLabel` (and `dir`) props win over the provider. With
 * the English default messages, the previous / next buttons and their
 * landmark take the react-day-picker locale's own labels.
 */
export const LocaleProp: Story = {
  globals: { locale: 'en' },
  render: () => (
    <Calendar
      locale={ru}
      mode="single"
      defaultMonth={new Date(2025, 0, 1)}
      showTodayButton
      todayLabel="Сегодня!"
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('grid')).toHaveAccessibleName(/январь 2025/i)
    await expect(
      canvas.getByRole('button', { name: 'Сегодня!' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Перейти к предыдущему месяцу' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('navigation', { name: 'Панель навигации' }),
    ).toBeInTheDocument()
  },
}

/**
 * Right-to-left text: the toolbar actions are on the right, the previous
 * arrow points right, a range's rounded ends follow the direction and the
 * arrow keys follow the reading direction (ArrowLeft is the next day).
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2025, 0, 13),
      to: new Date(2025, 0, 16),
    })

    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        defaultMonth={new Date(2025, 0, 1)}
        showTodayButton
      />
    )
  },
  play: async ({ canvas, userEvent }) => {
    const previous = canvas.getByRole('button', { name: /previous month/i })
    const next = canvas.getByRole('button', { name: /next month/i })
    await expect(previous.getBoundingClientRect().left).toBeGreaterThan(
      next.getBoundingClientRect().left,
    )

    const day = (name: RegExp) => canvas.getByRole('button', { name })
    const start = day(/January 13th, 2025/)
    const end = day(/January 16th, 2025/)
    // The range starts on the right.
    await expect(start.getBoundingClientRect().left).toBeGreaterThan(
      end.getBoundingClientRect().left,
    )

    await userEvent.click(day(/January 20th, 2025/))
    await userEvent.keyboard('{ArrowLeft}')
    await expect(day(/January 21st, 2025/)).toHaveFocus()
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
