import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { describe, expect, it } from 'vitest'

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

  it('lets className override the root defaults', () => {
    const { container } = render(
      <Calendar mode="single" className="p-1 rounded-none" />,
    )

    const root = container.firstElementChild
    expect(root).toHaveClass('p-1', 'rounded-none')
    expect(root).not.toHaveClass('p-4')
    expect(root).not.toHaveClass('rounded-2xl')
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
