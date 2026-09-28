import { ArrowLineDownIcon } from '@holakirr/snow-ui-icons'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
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

  it.each([
    ['label', 'label'],
    ['dropdown', 'dropdown'],
  ] as const)(
    'moves between months with Previous / Next (%s caption)',
    (_name, captionLayout) => {
      render(
        <Calendar
          mode="range"
          captionLayout={captionLayout}
          defaultMonth={new Date(2025, 0, 1)}
          startMonth={new Date(2020, 0, 1)}
          endMonth={new Date(2030, 11, 1)}
        />,
      )

      const shownMonth = () =>
        captionLayout === 'dropdown'
          ? `${
              (
                screen.getByRole('combobox', {
                  name: /choose the month/i,
                }) as HTMLSelectElement
              ).value
            }/${
              (
                screen.getByRole('combobox', {
                  name: /choose the year/i,
                }) as HTMLSelectElement
              ).value
            }`
          : screen.getByRole('button', { name: /^[a-z]+ \d{4}$/i }).textContent

      const before = shownMonth()
      fireEvent.click(screen.getByRole('button', { name: /next month/i }))
      const after = shownMonth()
      expect(after).not.toBe(before)
      expect(after).toBe(
        captionLayout === 'dropdown' ? '1/2025' : 'February 2025',
      )

      fireEvent.click(screen.getByRole('button', { name: /previous month/i }))
      fireEvent.click(screen.getByRole('button', { name: /previous month/i }))
      expect(shownMonth()).toBe(
        captionLayout === 'dropdown' ? '11/2024' : 'December 2024',
      )
    },
  )

  it('uses down chevrons and pointer dropdowns in the dropdown caption', () => {
    render(
      <Calendar
        mode="single"
        captionLayout="dropdown"
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    const month = screen.getByRole('combobox', { name: /choose the month/i })
    // react-day-picker's own classes stay, so its stylesheet still lays the
    // native select over the label.
    expect(month).toHaveClass('rdp-dropdown', 'cursor-pointer')
    expect(month.parentElement).toHaveClass(
      'rdp-dropdown_root',
      'cursor-pointer',
    )
    // The chevron next to the label points down (ArrowLineDown).
    const chevron = month.parentElement?.querySelector('svg')
    expect(chevron).not.toBeNull()
    expect(chevron?.innerHTML).toBe(
      render(<ArrowLineDownIcon size={16} />).container.querySelector('svg')
        ?.innerHTML,
    )
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
    expect(today).toHaveClass(
      'not-aria-selected:[&>button]:bg-indigo',
      // Static black on indigo (10:1); Figma's white is 2.07:1.
      'not-aria-selected:[&>button]:text-static-black',
    )
    expect(today).not.toHaveClass('[&>button]:bg-primary')
  })

  it('shows outside days in text-secondary (Figma Black/40% is 2.85:1)', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    const outside = screen
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('data-day') === '2024-12-30')
    expect(outside).toHaveAttribute('data-outside', 'true')
    expect(outside).toHaveClass('text-secondary')
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

  it('puts Previous in the first caption and Next in the last one', () => {
    const { container } = render(
      <Calendar
        mode="single"
        numberOfMonths={2}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    const captions = container.querySelectorAll<HTMLElement>(
      '[data-slot="calendar-caption"]',
    )
    expect(captions).toHaveLength(2)
    const [first, last] = captions

    expect(
      within(first).getByRole('button', { name: /previous month/i }),
    ).toBeInTheDocument()
    expect(
      within(first).queryByRole('button', { name: /next month/i }),
    ).toBeNull()
    expect(
      within(last).getByRole('button', { name: /next month/i }),
    ).toBeInTheDocument()
    expect(
      within(last).queryByRole('button', { name: /previous month/i }),
    ).toBeNull()

    // A single navigation landmark, not one per month.
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    expect(
      screen.getByRole('navigation', { name: 'Month navigation' }),
    ).toContainElement(
      within(first).getByRole('button', { name: /previous month/i }),
    )
  })

  it('hides outside days by default when it shows several months', () => {
    const { container, rerender } = render(
      <Calendar
        mode="single"
        numberOfMonths={2}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )
    const visibleOutside = () =>
      container.querySelectorAll('[data-outside]:not([data-hidden])').length

    expect(visibleOutside()).toBe(0)

    rerender(
      <Calendar
        mode="single"
        numberOfMonths={2}
        showOutsideDays
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )
    expect(visibleOutside()).toBeGreaterThan(0)
  })

  it('translates the navigation label with labels.labelNav', () => {
    render(
      <Calendar
        mode="single"
        labels={{ labelNav: () => 'Navigation des mois' }}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    expect(
      screen.getByRole('navigation', { name: 'Navigation des mois' }),
    ).toBeInTheDocument()
  })

  it('renders no navigation landmark when the navigation is hidden', () => {
    render(
      <Calendar
        mode="single"
        hideNavigation
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    expect(screen.queryByRole('navigation')).toBeNull()
    expect(
      screen.queryByRole('button', { name: /next month/i }),
    ).not.toBeInTheDocument()
  })

  it('merges user classNames into the defaults', () => {
    render(
      <Calendar
        mode="single"
        classNames={{ day: 'custom-day', selected: 'ring-2' }}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )

    const day = screen
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('data-day') === '2025-01-15')
    // The user's class is added to the slot's defaults…
    expect(day).toHaveClass('custom-day', 'text-12', 'justify-center')
    // …and the other slots keep theirs.
    expect(
      screen.getAllByRole('columnheader', { hidden: true })[0],
    ).toHaveClass('text-12', 'text-secondary')
    expect(
      screen.getByRole('button', { name: /next month/i }),
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
