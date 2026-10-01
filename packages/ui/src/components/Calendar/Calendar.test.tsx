import { ArrowLineDownIcon } from '@holakirr/snow-ui-icons'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { enUS, ru } from 'react-day-picker/locale'
import { userEvent } from 'storybook/test'
import { describe, expect, it, vi } from 'vitest'

import { getNavButton } from '../../test/queries'
import { SnowUIProvider } from '../SnowUIProvider'
import { Calendar, type CalendarProps } from './Calendar'

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

    const previous = getNavButton(/previous month/i)
    const next = getNavButton(/next month/i)

    for (const button of [previous, next]) {
      expect(button.tagName).toBe('BUTTON')
      expect(button).not.toBeDisabled()
      button.focus()
      expect(button).toHaveFocus()
    }
  })

  it('navigates months with the nav buttons', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)

    const caption = getNavButton(/january 2025/i)
    expect(caption).toBeInTheDocument()

    act(() => {
      fireEvent.click(getNavButton(/next month/i))
    })

    expect(getNavButton(/february 2025/i)).toBeInTheDocument()
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
          : getNavButton(/^[a-z]+ \d{4}$/i).textContent

      const before = shownMonth()
      fireEvent.click(getNavButton(/next month/i))
      const after = shownMonth()
      expect(after).not.toBe(before)
      expect(after).toBe(
        captionLayout === 'dropdown' ? '1/2025' : 'February 2025',
      )

      fireEvent.click(getNavButton(/previous month/i))
      fireEvent.click(getNavButton(/previous month/i))
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

    const caption = getNavButton(/january 2025/i)

    expect(() => {
      act(() => {
        fireEvent.click(caption)
      })
    }).not.toThrow()

    const year = screen.getByRole('button', { name: '2026' })
    expect(getNavButton(/next \d+ years/i)).toBeInTheDocument()

    expect(() => {
      act(() => {
        fireEvent.click(year)
      })
    }).not.toThrow()

    // Keeps the month of the selected range start.
    expect(getNavButton(/january 2026/i)).toBeInTheDocument()
  })

  describe('year switcher', () => {
    // The year view opens on the page of 12 years, counted from five years
    // before the current year, that holds the year shown (2025 here).
    const first = new Date().getFullYear() - 5
    const from = first + 12 * Math.floor((2025 - first) / 12)
    const to = from + 11

    it('is a disclosure of the year view', () => {
      render(<RangeCalendar />)
      const switcher = getNavButton('January 2025')
      expect(switcher).toHaveAttribute('aria-expanded', 'false')
      expect(switcher).not.toHaveAttribute('aria-controls')

      fireEvent.click(switcher)
      expect(switcher).toHaveAttribute('aria-expanded', 'true')
      const yearView = screen.getByRole('grid', { name: `${from} - ${to}` })
      expect(switcher).toHaveAttribute('aria-controls', yearView.id)
      expect(yearView).toContainElement(
        screen.getByRole('button', { name: String(from) }),
      )

      fireEvent.click(switcher)
      expect(switcher).toHaveAttribute('aria-expanded', 'false')
      expect(switcher).not.toHaveAttribute('aria-controls')
      expect(screen.queryByRole('grid', { name: `${from} - ${to}` })).toBeNull()
    })

    it("is a grid of its own, not the day grid's", () => {
      render(<RangeCalendar />)
      fireEvent.click(getNavButton('January 2025'))

      // Named by its years, not multiselectable, not named by the month.
      expect(screen.getAllByRole('grid')).toHaveLength(1)
      const yearView = screen.getByRole('grid', { name: `${from} - ${to}` })
      expect(yearView).not.toHaveAttribute('aria-multiselectable')
      // Rows of four years.
      const rows = within(yearView).getAllByRole('row')
      expect(rows).toHaveLength(3)
      expect(within(rows[0]).getAllByRole('gridcell')).toHaveLength(4)
    })

    // The picked year is shown in the month of the selection.
    const selected = new Date(2025, 0, 20)

    it('takes the focus back when a year is picked with the keyboard', async () => {
      render(
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={new Date(2025, 0, 1)}
        />,
      )
      const user = userEvent.setup()

      getNavButton('January 2025').focus()
      await user.keyboard('{Enter}')
      // The next years, then the year view's tab stop: the year shown.
      await user.tab()
      await user.tab()
      expect(screen.getByRole('button', { name: '2025' })).toHaveFocus()
      await user.keyboard('{Control>}{Home}{/Control}')
      expect(screen.getByRole('button', { name: String(from) })).toHaveFocus()

      await user.keyboard('{Enter}')
      const switcher = getNavButton(`January ${from}`)
      expect(switcher).toHaveFocus()
      expect(switcher).toHaveAttribute('aria-expanded', 'false')
    })

    it("gives the focus to the first month's switcher with several months", async () => {
      const { container } = render(
        <Calendar
          mode="single"
          selected={selected}
          numberOfMonths={2}
          defaultMonth={new Date(2025, 0, 1)}
        />,
      )

      fireEvent.click(getNavButton('January 2025'))
      const year = screen.getByRole('button', { name: String(to) })
      year.focus()
      await act(async () => {
        fireEvent.click(year)
      })

      const switchers = Array.from(
        container.querySelectorAll('[data-slot="calendar-caption"] button'),
      ).filter((button) => button.hasAttribute('aria-expanded'))
      expect(switchers.map((button) => button.textContent)).toEqual([
        `January ${to}`,
        `February ${to}`,
      ])
      expect(switchers[0]).toHaveFocus()
      expect(document.body).not.toHaveFocus()
    })

    it('keeps the focus on the switcher of a later month', async () => {
      // The year view shows one month: the second month's switcher is gone.
      render(
        <Calendar
          mode="single"
          numberOfMonths={2}
          defaultMonth={new Date(2025, 0, 1)}
        />,
      )
      const user = userEvent.setup()
      screen.getByRole('button', { name: 'February 2025' }).focus()
      await user.keyboard('{Enter}')
      const switcher = screen.getByRole('button', { name: `${from} - ${to}` })
      expect(switcher).toHaveFocus()
      expect(switcher).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('year view keyboard (APG grid)', () => {
    const current = new Date().getFullYear()
    const from = current - 5
    const to = from + 11
    const year = (value: number) =>
      screen.getByRole('button', { name: String(value) })
    const cell = (value: number) => year(value).closest('[role="gridcell"]')

    const open = async (
      props: Pick<
        CalendarProps,
        'dir' | 'startMonth' | 'endMonth' | 'onNextClick'
      > = {},
    ) => {
      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(from + 2, 5, 1)}
          {...props}
        />,
      )
      const user = userEvent.setup()
      fireEvent.click(getNavButton(/^\w+ \d{4}$/))
      return user
    }

    it('has one tab stop, the year shown, which is selected', async () => {
      await open()
      const grid = screen.getByRole('grid', { name: `${from} - ${to}` })
      const stops = within(grid)
        .getAllByRole('button')
        .filter((button) => button.tabIndex === 0)
      expect(stops).toEqual([year(from + 2)])
      expect(cell(from + 2)).toHaveAttribute('aria-selected', 'true')
      expect(cell(from + 3)).toHaveAttribute('aria-selected', 'false')
      // The current year is marked for assistive technologies too.
      expect(cell(current)).toHaveAttribute('aria-current', 'date')
      expect(cell(from + 2)).not.toHaveAttribute('aria-current')
    })

    it('moves the focus with the arrows, Home / End and Ctrl + Home / End', async () => {
      const user = await open()
      year(from + 2).focus()

      await user.keyboard('{ArrowRight}')
      expect(year(from + 3)).toHaveFocus()
      expect(year(from + 3)).toHaveAttribute('tabindex', '0')
      expect(year(from + 2)).toHaveAttribute('tabindex', '-1')
      await user.keyboard('{ArrowDown}')
      expect(year(from + 7)).toHaveFocus()
      await user.keyboard('{ArrowLeft}')
      expect(year(from + 6)).toHaveFocus()
      await user.keyboard('{ArrowUp}')
      expect(year(from + 2)).toHaveFocus()
      await user.keyboard('{End}')
      expect(year(from + 3)).toHaveFocus()
      await user.keyboard('{Home}')
      expect(year(from)).toHaveFocus()
      await user.keyboard('{Control>}{End}{/Control}')
      expect(year(to)).toHaveFocus()
      await user.keyboard('{Control>}{Home}{/Control}')
      expect(year(from)).toHaveFocus()
    })

    it('pages past the edges and with PageUp / PageDown', async () => {
      const onNextClick = vi.fn()
      const user = await open({ onNextClick })
      year(to).focus()

      await user.keyboard('{ArrowRight}')
      expect(
        screen.getByRole('grid', { name: `${to + 1} - ${to + 12}` }),
      ).toBeInTheDocument()
      expect(year(to + 1)).toHaveFocus()
      expect(onNextClick).toHaveBeenCalledTimes(1)

      await user.keyboard('{PageUp}')
      expect(screen.getByRole('grid', { name: `${from} - ${to}` })).toBeTruthy()
      expect(year(to + 1 - 12)).toHaveFocus()
      await user.keyboard('{PageDown}')
      expect(year(to + 1)).toHaveFocus()
    })

    it('flips ArrowLeft / ArrowRight in right-to-left text', async () => {
      const user = await open({ dir: 'rtl' })
      year(from + 2).focus()
      await user.keyboard('{ArrowLeft}')
      expect(year(from + 3)).toHaveFocus()
      await user.keyboard('{ArrowRight}')
      expect(year(from + 2)).toHaveFocus()
    })

    it('leaves modified keys to the browser', async () => {
      const user = await open()
      year(from + 2).focus()
      await user.keyboard('{Alt>}{ArrowRight}{/Alt}')
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
      await user.keyboard('{Control>}{PageDown}{/Control}')
      await user.keyboard('{Meta>}{ArrowLeft}{/Meta}')
      expect(year(from + 2)).toHaveFocus()
      expect(screen.getByRole('grid', { name: `${from} - ${to}` })).toBeTruthy()
    })

    it('stops on the next page with fewer than four years', async () => {
      render(
        <Calendar
          mode="single"
          yearRange={2}
          defaultMonth={new Date(current, 0, 1)}
        />,
      )
      const user = userEvent.setup()
      fireEvent.click(getNavButton(/^\w+ \d{4}$/))
      const grid = screen.getByRole('grid')
      const [pageFrom, pageTo] = (grid.getAttribute('aria-label') ?? '')
        .split(' - ')
        .map(Number)
      year(pageFrom).focus()
      await user.keyboard('{ArrowDown}')
      // Not four years on, past the next page: the last year of the next one.
      expect(year(pageTo + 2)).toHaveFocus()
    })

    it('opens on the years of the month shown', () => {
      // Before, it opened on the current years: all after endMonth here,
      // with no tab stop.
      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2000, 5, 1)}
          endMonth={new Date(2008, 11, 1)}
        />,
      )
      fireEvent.click(getNavButton('June 2000'))
      expect(year(2000)).toBeEnabled()
      expect(year(2000)).toHaveAttribute('tabindex', '0')
      expect(getNavButton(/next \d+ years/i)).toBeDisabled()
    })

    it('reaches a year partly inside startMonth / endMonth', async () => {
      // startMonth in June: its year is enabled and one page back.
      const user = await open({ startMonth: new Date(from - 1, 5, 1) })
      year(from).focus()
      await user.keyboard('{ArrowLeft}')
      expect(year(from - 1)).toHaveFocus()
      expect(year(from - 1)).toBeEnabled()
      expect(getNavButton(/previous \d+ years/i)).toBeDisabled()
    })

    it('disables the years after endMonth, whatever its day', async () => {
      await open({ endMonth: new Date(to - 1, 11, 31) })
      expect(year(to - 1)).toBeEnabled()
      expect(year(to)).toBeDisabled()
    })

    it("doesn't move to years outside startMonth / endMonth", async () => {
      const user = await open({
        startMonth: new Date(from + 1, 0, 1),
        endMonth: new Date(to - 1, 11, 1),
      })
      expect(year(from)).toBeDisabled()
      year(from + 1).focus()
      await user.keyboard('{ArrowLeft}')
      expect(year(from + 1)).toHaveFocus()
      await user.keyboard('{Home}')
      expect(year(from + 1)).toHaveFocus()
      await user.keyboard('{Control>}{End}{/Control}')
      expect(year(to - 1)).toHaveFocus()
      await user.keyboard('{ArrowRight}')
      expect(year(to - 1)).toHaveFocus()
      await user.keyboard('{PageDown}')
      expect(year(to - 1)).toHaveFocus()
    })
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

  const firstWeekday = () =>
    screen.getAllByRole('columnheader', { hidden: true })[0]

  it('starts the week on Monday by default, whatever the locale', () => {
    const { unmount } = render(
      <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />,
    )

    const weekdays = screen.getAllByRole('columnheader', { hidden: true })
    expect(weekdays[0]).toHaveAccessibleName('Monday')
    expect(weekdays[6]).toHaveAccessibleName('Sunday')
    // 30 and 31 December 2024 fill the first week of January 2025.
    expect(screen.getAllByRole('gridcell')[0]).toHaveAttribute(
      'data-day',
      '2024-12-30',
    )
    unmount()

    // An en-US locale (Sunday first) doesn't change it.
    render(
      <SnowUIProvider locale={enUS}>
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Monday')
  })

  it('follows the locale with the provider’s weekStartsOn="locale"', () => {
    // No locale: en-US, Sunday.
    const { unmount } = render(
      <SnowUIProvider weekStartsOn="locale">
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Sunday')
    expect(screen.getAllByRole('gridcell')[0]).toHaveAttribute(
      'data-day',
      '2024-12-29',
    )
    unmount()

    // Russian, from a nested provider: Monday.
    const { unmount: unmountRu } = render(
      <SnowUIProvider weekStartsOn="locale">
        <SnowUIProvider locale={ru}>
          <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
        </SnowUIProvider>
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName(/понедельник/i)
    unmountRu()

    // The calendar's own `locale` prop counts too.
    render(
      <SnowUIProvider weekStartsOn="locale">
        <Calendar
          mode="single"
          locale={enUS}
          defaultMonth={new Date(2025, 0, 1)}
        />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Sunday')
  })

  it('takes a day from the provider; weekStartsOn wins', () => {
    const { unmount } = render(
      <SnowUIProvider weekStartsOn={0}>
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Sunday')
    unmount()

    const { unmount: unmountLocale } = render(
      <SnowUIProvider weekStartsOn="locale">
        <Calendar
          mode="single"
          weekStartsOn={1}
          defaultMonth={new Date(2025, 0, 1)}
        />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Monday')
    unmountLocale()

    render(
      <Calendar
        mode="single"
        weekStartsOn={0}
        defaultMonth={new Date(2025, 0, 1)}
      />,
    )
    expect(firstWeekday()).toHaveAccessibleName('Sunday')
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
      // In dark mode a selected day is indigo too: today has no fill there.
      'dark:not-aria-selected:[&>button]:bg-transparent',
      'dark:not-aria-selected:[&>button]:text-indigo',
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
    expect(getNavButton(/february 2026/i)).toBeInTheDocument()
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
    expect(getNavButton(/may 2024/i)).toBeInTheDocument()
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
    expect(getNavButton(/next month/i)).toBeInTheDocument()
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
