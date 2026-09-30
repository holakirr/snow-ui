import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { useState } from 'react'
import { ru } from 'react-day-picker/locale'
import { userEvent } from 'storybook/test'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Input'
import { SnowUIProvider } from '../SnowUIProvider'
import { DatePicker, type DatePickerProps } from './DatePicker'
import {
  type DateRange,
  DateRangePicker,
  type DateRangePickerProps,
} from './DateRangePicker'

beforeAll(() => {
  // Radix positions the popover with ResizeObserver; jsdom has none.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const TODAY = new Date(2025, 0, 15, 10, 30)

const renderPicker = (props: Partial<DatePickerProps> = {}) =>
  render(
    <DatePicker
      aria-label="Due"
      defaultOpen
      calendarProps={{ today: TODAY }}
      {...props}
    />,
  )

const renderRange = (props: Partial<DateRangePickerProps> = {}) =>
  render(
    <DateRangePicker
      aria-label="Stay"
      defaultOpen
      calendarProps={{ today: TODAY }}
      {...props}
    />,
  )

const field = () => screen.getByRole('combobox', { hidden: true })
const segment = (name: string, group?: string) =>
  within(
    group ? screen.getByRole('group', { name: group }) : document.body,
  ).getByRole('spinbutton', { name })
const day = (name: RegExp) => screen.getByRole('button', { name })
const press = (element: HTMLElement, ...keys: string[]) => {
  act(() => element.focus())
  for (const key of keys)
    fireEvent.keyDown(document.activeElement ?? element, { key })
}

describe('DatePicker popup', () => {
  it('shows the date in the top area, in the order of the locale', () => {
    const { unmount } = renderPicker({ defaultValue: new Date(2025, 0, 20) })
    const date = screen.getByRole('group', { name: 'Date' })
    const parts = within(date).getAllByRole('spinbutton')
    expect(parts.map((part) => part.getAttribute('aria-label'))).toEqual([
      'Month',
      'Day',
      'Year',
    ])
    expect(parts.map((part) => part.textContent)).toEqual(['01', '20', '2025'])
    expect(parts[0]).toHaveAttribute('aria-valuetext', '01 – January')
    expect(parts[1]).toHaveAttribute('aria-valuemax', '31')
    unmount()

    render(
      <SnowUIProvider locale={ru}>
        <DatePicker
          aria-label="Срок"
          defaultOpen
          defaultValue={new Date(2025, 0, 20)}
        />
      </SnowUIProvider>,
    )
    expect(
      screen.getAllByRole('spinbutton').map((part) => part.textContent),
    ).toEqual(['20', '01', '2025'])
  })

  it('shows today, dimmed, without a value; editing starts from it', () => {
    const onValueChange = vi.fn()
    renderPicker({ onValueChange })
    const month = segment('Month')
    expect(month).toHaveAttribute('aria-valuetext', 'Empty')
    expect(month).toHaveTextContent('01')
    expect(month).toHaveAttribute('data-placeholder')

    press(segment('Day'), 'ArrowUp')
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '15')
    expect(segment('Year')).toHaveAttribute('aria-valuenow', '2025')
    expect(segment('Year')).not.toHaveAttribute('data-placeholder')
    press(segment('Day'), 'Enter')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 0, 15))
  })

  it('positions the calendar as you type; Enter confirms', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: new Date(2025, 0, 20), onValueChange })
    press(segment('Month'), '3')
    expect(screen.getByRole('grid', { name: 'March 2025' })).toBeInTheDocument()
    // The focus moved on to the day.
    expect(segment('Day')).toHaveFocus()
    expect(onValueChange).not.toHaveBeenCalled()
    press(segment('Day'), 'Enter')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 2, 20))
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps the value when Escape closes it; a click outside confirms', async () => {
    const onValueChange = vi.fn()
    const { unmount } = renderPicker({
      defaultValue: new Date(2025, 0, 20),
      onValueChange,
    })
    press(segment('Day'), '2', '2')
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' })
    await waitFor(() =>
      expect(field()).toHaveAttribute('aria-expanded', 'false'),
    )
    expect(onValueChange).not.toHaveBeenCalled()
    unmount()

    renderPicker({ defaultValue: new Date(2025, 0, 20), onValueChange })
    press(segment('Day'), '2', '2')
    // The modal popover takes the pointer off <body>: click the page.
    await userEvent.click(document.documentElement)
    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 0, 22)),
    )
  })

  it("doesn't take a typed date that can't be picked", () => {
    const onValueChange = vi.fn()
    renderPicker({
      defaultValue: new Date(2025, 0, 20),
      minDate: new Date(2025, 0, 10),
      onValueChange,
    })
    press(segment('Day'), '0', '5')
    expect(screen.getByRole('group', { name: 'Date' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    press(segment('Year'), 'Enter')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('empties a segment with Backspace; leaving keeps the valid date', () => {
    renderPicker({ defaultValue: new Date(2025, 0, 20) })
    press(segment('Day'), 'Backspace')
    expect(segment('Day')).toHaveAttribute('aria-valuetext', 'Empty')
    act(() => day(/January 20th, 2025/).focus())
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '20')
  })

  it('opens the months and years from the top area; Back returns', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: new Date(2025, 0, 20), onValueChange })
    fireEvent.pointerDown(segment('Month'))
    const months = screen.getByRole('grid', { name: '2025' })
    expect(
      within(months).getByRole('button', { name: 'January 2025' }),
    ).toHaveAttribute('data-selected')
    fireEvent.click(within(months).getByRole('button', { name: 'March 2025' }))
    // Back to the days, in March; the date is March 20.
    expect(screen.getByRole('grid', { name: 'March 2025' })).toBeInTheDocument()
    expect(segment('Month')).toHaveAttribute('aria-valuenow', '3')

    fireEvent.pointerDown(segment('Year'))
    const years = screen.getByRole('grid', { name: '2020 – 2031' })
    expect(within(years).getByRole('button', { name: '2025' })).toHaveAttribute(
      'data-selected',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('grid', { name: 'March 2025' })).toBeInTheDocument()

    press(segment('Year'), 'Enter')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 2, 20))
  })

  it('opens the months from the caption, with the focus on the month', async () => {
    renderPicker({ defaultValue: new Date(2025, 0, 20) })
    fireEvent.click(screen.getByRole('button', { name: 'Jan, choose a month' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'January 2025' }),
      ).toHaveFocus(),
    )
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: 'ArrowRight',
    })
    expect(screen.getByRole('button', { name: 'February 2025' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: '2025, choose a year' }))
    expect(
      screen.getByRole('grid', { name: '2020 – 2031' }),
    ).toBeInTheDocument()
  })

  it('picks with "Today" and "Last selection" without closing', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: new Date(2025, 0, 20), onValueChange })
    fireEvent.click(screen.getByRole('button', { name: 'Today' }))
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '15')
    expect(field()).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Last selection' }))
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '20')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("doesn't page the months or the years past maxDate", async () => {
    renderPicker({ maxDate: new Date(2025, 11, 31) })
    fireEvent.click(screen.getByRole('button', { name: 'Jan, choose a month' }))
    const january = screen.getByRole('button', { name: 'January 2025' })
    await waitFor(() => expect(january).toHaveFocus())
    // There is no 2026: PageDown, and ↓ from the last row, stay in 2025.
    const september = screen.getByRole('button', { name: 'September 2025' })
    act(() => september.focus())
    fireEvent.keyDown(september, { key: 'PageDown' })
    fireEvent.keyDown(september, { key: 'ArrowDown' })
    expect(screen.getByRole('grid', { name: '2025' })).toBeInTheDocument()
    expect(september).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: '2025, choose a year' }))
    const years = screen.getByRole('grid', { name: '2020 – 2031' })
    const year = within(years).getByRole('button', { name: '2025' })
    await waitFor(() => expect(year).toHaveFocus())
    fireEvent.keyDown(year, { key: 'PageDown' })
    expect(screen.getByRole('grid', { name: '2020 – 2031' })).toBe(years)
    expect(year).toHaveFocus()
  })

  it('follows a value changed while it is open; closing keeps it', async () => {
    const onValueChange = vi.fn()
    let setOuter: (date: Date | null) => void = () => {}
    const Controlled = () => {
      const [value, setValue] = useState<Date | null>(new Date(2025, 0, 20))
      setOuter = setValue
      return (
        <DatePicker
          aria-label="Due"
          defaultOpen
          calendarProps={{ today: TODAY }}
          value={value}
          onValueChange={onValueChange}
        />
      )
    }
    render(<Controlled />)
    act(() => setOuter(new Date(2025, 0, 25)))
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '25')
    await userEvent.click(document.documentElement)
    await waitFor(() =>
      expect(field()).toHaveAttribute('aria-expanded', 'false'),
    )
    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveTextContent('Jan 25, 2025')
  })

  it('shows the picked day while a controlled open stays true', () => {
    const Controlled = () => {
      const [value, setValue] = useState<Date | null>(new Date(2025, 0, 20))
      return (
        <DatePicker
          aria-label="Due"
          open
          calendarProps={{ today: TODAY }}
          value={value}
          onValueChange={setValue}
        />
      )
    }
    render(<Controlled />)
    fireEvent.click(day(/January 22nd, 2025/))
    expect(field()).toHaveTextContent('Jan 22, 2025')
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '22')
    expect(
      day(/January 22nd, 2025/).closest('[role="gridcell"]'),
    ).toHaveAttribute('aria-selected', 'true')
  })

  it('shows the short month in the caption', () => {
    renderPicker({ defaultValue: new Date(2025, 1, 20) })
    expect(
      screen.getByRole('button', { name: 'Feb, choose a month' }),
    ).toHaveTextContent('Feb')
  })
})

describe('DatePicker withTime', () => {
  it('keeps the calendar open and the time when a day is picked', () => {
    const onValueChange = vi.fn()
    renderPicker({
      defaultValue: new Date(2025, 0, 20, 16, 8),
      withTime: true,
      onValueChange,
    })
    const time = screen.getByRole('group', { name: 'Time' })
    expect(
      within(time)
        .getAllByRole('spinbutton')
        .map((part) => part.textContent),
    ).toEqual(['04', '08', 'PM'])

    fireEvent.click(day(/January 22nd, 2025/))
    expect(field()).toHaveAttribute('aria-expanded', 'true')
    expect(segment('Day')).toHaveAttribute('aria-valuenow', '22')
    expect(onValueChange).not.toHaveBeenCalled()
    // The picked day again confirms.
    fireEvent.click(day(/January 22nd, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 0, 22, 16, 8))
  })

  it('keeps PM when the hour is erased and typed again', () => {
    const onValueChange = vi.fn()
    renderPicker({
      defaultValue: new Date(2025, 0, 20, 16, 8),
      withTime: true,
      hourCycle: 12,
      onValueChange,
    })
    press(segment('Hour'), 'Backspace')
    expect(segment('Hour')).toHaveAttribute('aria-valuetext', 'Empty')
    expect(segment('AM/PM')).toHaveAttribute('aria-valuetext', 'PM')
    press(segment('Hour'), '0', '5', 'Enter')
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 0, 20, 17, 8))
  })

  it('switches a typed 13 to 01 PM', () => {
    renderPicker({ defaultValue: new Date(2025, 0, 20, 4, 8), withTime: true })
    expect(segment('AM/PM')).toHaveAttribute('aria-valuetext', 'AM')
    press(segment('Hour'), '1', '3')
    expect(segment('Hour')).toHaveTextContent('01')
    expect(segment('AM/PM')).toHaveAttribute('aria-valuetext', 'PM')
    expect(segment('Minute')).toHaveFocus()
    press(segment('AM/PM'), 'a')
    expect(segment('AM/PM')).toHaveAttribute('aria-valuetext', 'AM')
  })

  it('picks the hour, then the minute; the form gets date and time', () => {
    const { container } = render(
      <form>
        <DatePicker
          aria-label="Due"
          name="due"
          defaultOpen
          withTime
          defaultValue={new Date(2025, 0, 20, 16, 8)}
          calendarProps={{ today: TODAY }}
        />
      </form>,
    )
    fireEvent.pointerDown(segment('Hour'))
    const hours = screen.getByRole('grid', { name: 'Hour' })
    fireEvent.click(within(hours).getByRole('button', { name: '09' }))
    const minutes = screen.getByRole('grid', { name: 'Minute' })
    fireEvent.click(within(minutes).getByRole('button', { name: '30' }))
    press(segment('Minute'), 'Enter')
    const form = container.querySelector('form') as HTMLFormElement
    expect(new FormData(form).get('due')).toBe('2025-01-20T21:30')
    expect(field()).toHaveTextContent('Jan 20, 2025, 9:30 PM')
  })

  it('has 24-hour time in a 24-hour locale, or with hourCycle', () => {
    const { unmount } = render(
      <SnowUIProvider locale={ru}>
        <DatePicker
          aria-label="Срок"
          defaultOpen
          withSeconds
          defaultValue={new Date(2025, 0, 20, 16, 8, 12)}
        />
      </SnowUIProvider>,
    )
    const time = screen.getByRole('group', { name: 'Time' })
    expect(
      within(time)
        .getAllByRole('spinbutton')
        .map((part) => part.textContent),
    ).toEqual(['16', '08', '12'])
    unmount()

    renderPicker({
      defaultValue: new Date(2025, 0, 20, 16, 8),
      withTime: true,
      hourCycle: 24,
    })
    expect(segment('Hour')).toHaveTextContent('16')
    expect(screen.queryByRole('spinbutton', { name: 'AM/PM' })).toBeNull()
  })

  it('"System time" picks the current time', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2025, 0, 15, 11, 45))
    try {
      renderPicker({
        defaultValue: new Date(2025, 0, 20, 16, 8),
        withTime: true,
      })
      fireEvent.pointerDown(segment('Minute'))
      fireEvent.click(screen.getByRole('button', { name: 'System time' }))
      expect(segment('Hour')).toHaveAttribute('aria-valuenow', '11')
      expect(segment('Minute')).toHaveAttribute('aria-valuenow', '45')
      expect(segment('Day')).toHaveAttribute('aria-valuenow', '20')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('DateRangePicker popup', () => {
  it('shows the start and the end; the start is picked first', () => {
    const onValueChange = vi.fn()
    renderRange({
      defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) },
      onValueChange,
    })
    const start = screen.getByRole('group', { name: 'Start date' })
    const end = screen.getByRole('group', { name: 'End date' })
    expect(start).toHaveAttribute('aria-current', 'true')
    expect(end).not.toHaveAttribute('aria-current')

    fireEvent.click(day(/January 20th, 2025/))
    expect(end).toHaveAttribute('aria-current', 'true')
    expect(segment('Day', 'Start date')).toHaveAttribute('aria-valuenow', '20')
    expect(segment('Day', 'End date')).toHaveAttribute(
      'aria-valuetext',
      'Empty',
    )
    fireEvent.click(day(/January 24th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2025, 0, 20),
      to: new Date(2025, 0, 24),
    })
  })

  it('picks the end clicked in the top area, keeping the start', () => {
    const onValueChange = vi.fn()
    renderRange({
      defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) },
      onValueChange,
    })
    fireEvent.pointerDown(segment('Day', 'End date'))
    fireEvent.click(day(/January 20th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2025, 0, 13),
      to: new Date(2025, 0, 20),
    })
  })

  it('follows a range changed while it is open; closing keeps it', async () => {
    const onValueChange = vi.fn()
    let setOuter: (range: DateRange | null) => void = () => {}
    const Controlled = () => {
      const [value, setValue] = useState<DateRange | null>({
        from: new Date(2025, 0, 13),
        to: new Date(2025, 0, 16),
      })
      setOuter = setValue
      return (
        <DateRangePicker
          aria-label="Stay"
          defaultOpen
          calendarProps={{ today: TODAY }}
          value={value}
          onValueChange={onValueChange}
        />
      )
    }
    render(<Controlled />)
    act(() =>
      setOuter({ from: new Date(2025, 0, 20), to: new Date(2025, 0, 24) }),
    )
    expect(segment('Day', 'Start date')).toHaveAttribute('aria-valuenow', '20')
    await userEvent.click(document.documentElement)
    await waitFor(() =>
      expect(field()).toHaveAttribute('aria-expanded', 'false'),
    )
    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveTextContent('Jan 20, 2025 – Jan 24, 2025')
  })

  it("doesn't take a typed end before the start", () => {
    renderRange({
      defaultValue: { from: new Date(2025, 0, 13), to: new Date(2025, 0, 16) },
    })
    press(segment('Day', 'End date'), '1', '0')
    expect(screen.getByRole('group', { name: 'End date' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('with time, the time is the one of the date being picked', () => {
    const onValueChange = vi.fn()
    renderRange({
      defaultValue: {
        from: new Date(2025, 0, 13, 9, 30),
        to: new Date(2025, 0, 16, 18, 0),
      },
      withTime: true,
      onValueChange,
    })
    expect(segment('Hour', 'Start time')).toHaveTextContent('09')
    fireEvent.pointerDown(segment('Day', 'End date'))
    expect(segment('Hour', 'End time')).toHaveTextContent('06')
    press(segment('Hour', 'End time'), '2', '0')
    press(segment('Minute', 'End time'), 'Enter')
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2025, 0, 13, 9, 30),
      to: new Date(2025, 0, 16, 20, 0),
    })
  })
})

describe('title', () => {
  it('names the date pickers and SelectTrigger, above the value', () => {
    render(
      <>
        <DatePicker title="Due date" defaultValue={new Date(2026, 1, 1)} />
        <DateRangePicker title="Stay" />
        <Select defaultValue="gpt-4">
          <SelectTrigger title="Model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
          </SelectContent>
        </Select>
      </>,
    )
    expect(
      screen.getByRole('combobox', { name: 'Due date' }),
    ).toHaveTextContent('Feb 1, 2026')
    expect(screen.getByRole('combobox', { name: 'Stay' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveTextContent(
      'GPT-4',
    )
  })
})
