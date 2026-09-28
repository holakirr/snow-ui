import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { describe, expect, it, vi } from 'vitest'

import { Calendar } from './Calendar'

const RangeCalendar = () => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 27),
    to: new Date(2025, 0, 31),
  })

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={new Date(2025, 0, 1)}
    />
  )
}

describe('Calendar', () => {
  it('renders focusable navigation buttons', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    const previous = screen.getByRole('button', { name: /previous month/i })
    const next = screen.getByRole('button', { name: /next month/i })

    for (const button of [previous, next]) {
      expect(button.tagName).toBe('BUTTON')
      expect(button).not.toBeDisabled()
      button.focus()
      expect(button).toHaveFocus()
    }
  })

  it('navigates months with the nav buttons', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    const caption = screen.getByRole('button', { name: /january 2025/i })
    expect(caption).toBeInTheDocument()

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /next month/i }))
    })

    expect(
      screen.getByRole('button', { name: /february 2025/i }),
    ).toBeInTheDocument()
  })

  it('switches to the year view and back in range mode without throwing', () => {
    render(<RangeCalendar />)

    const caption = screen.getByRole('button', { name: /january 2025/i })

    expect(() => {
      act(() => {
        fireEvent.click(caption)
      })
    }).not.toThrow()

    const year = screen.getByRole('button', { name: '2026' })
    expect(
      screen.getByRole('button', { name: /next \d+ years/i }),
    ).toBeInTheDocument()

    expect(() => {
      act(() => {
        fireEvent.click(year)
      })
    }).not.toThrow()

    // Keeps the month of the selected range start.
    expect(
      screen.getByRole('button', { name: /january 2026/i }),
    ).toBeInTheDocument()
  })

  it('renders the Figma DatePicker surface and lets className override it', () => {
    const { container, rerender } = render(<Calendar mode="single" />)

    const root = container.firstElementChild
    expect(root).toHaveClass(
      'rounded-16',
      'glass-2',
      'inset-ring',
      'inset-ring-surface-1',
    )

    rerender(<Calendar mode="single" className="p-1 rounded-none" />)
    expect(root).toHaveClass('p-1', 'rounded-none')
    expect(root).not.toHaveClass('rounded-16')
  })

  it('starts the week on Monday by default', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    const weekdays = screen.getAllByRole('columnheader', { hidden: true })
    expect(weekdays[0]).toHaveAccessibleName('Monday')
    expect(weekdays[6]).toHaveAccessibleName('Sunday')
    // 30 and 31 December 2024 fill the first week of January 2025.
    expect(screen.getAllByRole('gridcell')[0]).toHaveAttribute(
      'data-day',
      '2024-12-30',
    )
  })

  it('lets weekStartsOn override the Monday start', () => {
    render(
      <Calendar
        mode="single"
        weekStartsOn={0}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    expect(
      screen.getAllByRole('columnheader', { hidden: true })[0],
    ).toHaveAccessibleName('Sunday')
  })

  it('styles the selected day as Primary and today as Secondary/Indigo', () => {
    render(
      <Calendar
        mode="single"
        today={new Date(2025, 0, 10)}
        selected={new Date(2025, 0, 20)}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    const selected = screen
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('data-day') === '2025-01-20')
    const today = screen
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('data-day') === '2025-01-10')

    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(selected).toHaveClass(
      '[&>button]:bg-primary',
      '[&>button]:text-white',
    )
    expect(today).toHaveAttribute('data-today', 'true')
    expect(today).toHaveClass('not-aria-selected:[&>button]:bg-indigo')
    expect(today).not.toHaveClass('[&>button]:bg-primary')
  })

  it('shows outside days in Black/40%', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    const outside = screen
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('data-day') === '2024-12-30')
    expect(outside).toHaveAttribute('data-outside', 'true')
    expect(outside).toHaveClass('text-black-40')
    expect(outside).not.toHaveClass('opacity-50')
  })

  it('renders no toolbar actions by default', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    expect(
      screen.queryByRole('button', { name: 'Today' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Last selection' }),
    ).not.toBeInTheDocument()
  })

  it('goes to the current month and reports it with the Today action', () => {
    const onTodayClick = vi.fn()
    render(
      <Calendar
        mode="single"
        today={new Date(2026, 1, 10)}
        showTodayButton
        onTodayClick={onTodayClick}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Today' }))
    })

    expect(onTodayClick).toHaveBeenCalledWith(new Date(2026, 1, 10))
    expect(
      screen.getByRole('button', { name: /february 2026/i }),
    ).toBeInTheDocument()
  })

  it('goes back to the last selection with the Last selection action', () => {
    const onLastSelectionClick = vi.fn()
    const lastSelection = new Date(2024, 4, 15)
    render(
      <Calendar
        mode="single"
        lastSelection={lastSelection}
        onLastSelectionClick={onLastSelectionClick}
        lastSelectionLabel="Previous pick"
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Previous pick' }))
    })

    expect(onLastSelectionClick).toHaveBeenCalledWith(lastSelection)
    expect(
      screen.getByRole('button', { name: /may 2024/i }),
    ).toBeInTheDocument()
  })

  it('renders the header slot above the months', () => {
    render(
      <Calendar
        mode="single"
        header={<input aria-label="Date" defaultValue="10 / 22 / 2026" />}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Date' })
    expect(input.parentElement).toHaveAttribute('data-slot', 'calendar-header')
    expect(input.parentElement).toHaveClass('border-b-[0.5px]', 'p-4')
  })

  it('passes showWeekNumber through to the day picker', () => {
    render(
      <Calendar
        mode="single"
        showWeekNumber
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    expect(screen.getAllByRole('rowheader').length).toBeGreaterThan(0)
  })
})
