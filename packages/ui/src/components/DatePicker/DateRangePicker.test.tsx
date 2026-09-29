import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
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

const january = (from: number, to: number): DateRange => ({
  from: new Date(2025, 0, from),
  to: new Date(2025, 0, to),
})

const renderPicker = (props: Partial<DateRangePickerProps> = {}) =>
  render(<DateRangePicker aria-label="Stay" {...props} />)

const field = () => screen.getByRole('combobox')
const day = (name: RegExp) => screen.getByRole('button', { name })
const cell = (name: RegExp) => day(name).closest('[role="gridcell"]')

describe('DateRangePicker', () => {
  it('shows the range, or the placeholder', () => {
    const { unmount } = renderPicker()
    expect(field()).toHaveTextContent('Pick a date range')
    unmount()

    renderPicker({ defaultValue: january(13, 16) })
    expect(field()).toHaveTextContent('Jan 13, 2025 – Jan 16, 2025')
  })

  it('shows a range without an end', () => {
    renderPicker({ value: { from: new Date(2025, 0, 13), to: undefined } })
    expect(field()).toHaveTextContent('Jan 13, 2025 –')
  })

  it('picks a new range with two clicks, then closes', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: january(13, 16), onValueChange })
    const trigger = field()

    fireEvent.click(trigger)
    expect(
      screen.getByRole('dialog', { name: 'Choose a date range' }),
    ).toBeVisible()
    expect(cell(/January 14th, 2025/)).toHaveAttribute('aria-selected', 'true')

    fireEvent.click(day(/January 20th, 2025/))
    // A new range starts: the old one is gone.
    expect(cell(/January 14th, 2025/)).not.toHaveAttribute('aria-selected')
    expect(cell(/January 20th, 2025/)).toHaveAttribute('aria-selected', 'true')
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.click(day(/January 23rd, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(january(20, 23))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent('Jan 20, 2025 – Jan 23, 2025')
  })

  it('orders the ends when the end is picked first', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: january(13, 16), onValueChange })

    fireEvent.click(field())
    fireEvent.click(day(/January 23rd, 2025/))
    fireEvent.click(day(/January 20th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(january(20, 23))
  })

  it('picks a one-day range with the same day twice', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: january(13, 16), onValueChange })

    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    fireEvent.click(day(/January 20th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(january(20, 20))
  })

  it('previews the range under the pointer', () => {
    renderPicker({ defaultValue: january(13, 16) })

    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    fireEvent.mouseEnter(day(/January 23rd, 2025/))
    expect(cell(/January 22nd, 2025/)).toHaveAttribute('aria-selected', 'true')

    // Back on the start: only the start is picked.
    fireEvent.mouseEnter(day(/January 20th, 2025/))
    expect(cell(/January 22nd, 2025/)).not.toHaveAttribute('aria-selected')
  })

  it('keeps the old range when it closes after one day', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: january(13, 16), onValueChange })

    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveTextContent('Jan 13, 2025 – Jan 16, 2025')

    // Opening again starts over.
    fireEvent.click(field())
    expect(cell(/January 20th, 2025/)).not.toHaveAttribute('aria-selected')
    expect(cell(/January 14th, 2025/)).toHaveAttribute('aria-selected', 'true')
  })

  it('starts over when a controlled open state closes it', () => {
    const onValueChange = vi.fn()
    const props = {
      'aria-label': 'Stay',
      defaultValue: january(13, 16),
      onValueChange,
    }
    const { rerender } = render(<DateRangePicker {...props} open />)
    fireEvent.click(day(/January 20th, 2025/))
    expect(cell(/January 20th, 2025/)).toHaveAttribute('aria-selected', 'true')

    // The parent closes and reopens it without onOpenChange.
    rerender(<DateRangePicker {...props} open={false} />)
    rerender(<DateRangePicker {...props} open />)
    expect(cell(/January 20th, 2025/)).not.toHaveAttribute('aria-selected')

    // The next click is a new start, not the end of the old half-range.
    fireEvent.click(day(/January 22nd, 2025/))
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.click(day(/January 23rd, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(january(22, 23))
  })

  it('starts over after being disabled while open', () => {
    const onValueChange = vi.fn()
    const props = {
      'aria-label': 'Stay',
      defaultValue: january(13, 16),
      defaultOpen: true,
      onValueChange,
    }
    const { rerender } = render(<DateRangePicker {...props} />)
    fireEvent.click(day(/January 20th, 2025/))

    rerender(<DateRangePicker {...props} disabled />)
    rerender(<DateRangePicker {...props} />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(cell(/January 20th, 2025/)).not.toHaveAttribute('aria-selected')
    fireEvent.click(day(/January 22nd, 2025/))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('shows several months with numberOfMonths', () => {
    renderPicker({
      defaultValue: january(27, 31),
      numberOfMonths: 2,
      defaultOpen: true,
    })
    expect(screen.getAllByRole('grid')).toHaveLength(2)
  })

  it('works controlled and clears', () => {
    const Controlled = () => {
      const [value, setValue] = useState<DateRange | null>(january(13, 16))
      return (
        <>
          <DateRangePicker
            aria-label="Stay"
            value={value}
            onValueChange={setValue}
          />
          <output>
            {value ? `${value.from?.getDate()}-${value.to?.getDate()}` : 'none'}
          </output>
        </>
      )
    }
    render(<Controlled />)

    fireEvent.click(field())
    fireEvent.click(day(/January 2nd, 2025/))
    fireEvent.click(day(/January 4th, 2025/))
    expect(screen.getByText('2-4')).toBeInTheDocument()

    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(screen.getByText('none')).toBeInTheDocument()
    expect(field()).toHaveTextContent('Pick a date range')
  })

  it('skips disabled days in the preview', () => {
    renderPicker({
      defaultValue: january(13, 16),
      disabledDates: new Date(2025, 0, 24),
    })

    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    fireEvent.mouseEnter(day(/January 22nd, 2025/))
    fireEvent.mouseEnter(day(/January 24th, 2025/))
    // Still previewing up to the 22nd.
    expect(cell(/January 21st, 2025/)).toHaveAttribute('aria-selected', 'true')
    expect(cell(/January 23rd, 2025/)).not.toHaveAttribute('aria-selected')
  })

  it('submits an ISO 8601 interval with a hidden input', () => {
    const { container } = renderPicker({
      name: 'stay',
      defaultValue: january(13, 16),
    })
    expect(container.querySelector('input[type="hidden"]')).toHaveValue(
      '2025-01-13/2025-01-16',
    )
  })

  it('leaves a disabled field out of the form data', () => {
    const { container } = render(
      <form>
        <DateRangePicker
          aria-label="Stay"
          name="stay"
          defaultValue={january(13, 16)}
        />
        <DateRangePicker
          aria-label="Trip"
          name="trip"
          defaultValue={january(13, 16)}
          disabled
        />
      </form>,
    )
    const data = new FormData(
      container.querySelector('form') as HTMLFormElement,
    )
    expect(data.get('stay')).toBe('2025-01-13/2025-01-16')
    expect(data.has('trip')).toBe(false)
  })

  it('is localized by SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{
          datePicker: {
            rangePlaceholder: 'Выберите период',
            range: (start, end) => `с ${start} по ${end}`,
          },
        }}
      >
        <DateRangePicker aria-label="Период" />
        <DateRangePicker
          aria-label="Отпуск"
          defaultValue={january(13, 16)}
          dateFormat="d.MM"
        />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('combobox', { name: 'Период' })).toHaveTextContent(
      'Выберите период',
    )
    expect(screen.getByRole('combobox', { name: 'Отпуск' })).toHaveTextContent(
      'с 13.01 по 16.01',
    )
  })
})

describe('DateRangePicker edge cases', () => {
  const formOf = (container: HTMLElement) =>
    container.querySelector('form') as HTMLFormElement

  it('starts every range anew while a controlled open stays true', () => {
    const onValueChange = vi.fn()
    render(
      <DateRangePicker
        aria-label="Stay"
        open
        onOpenChange={() => {}}
        defaultValue={january(1, 2)}
        onValueChange={onValueChange}
      />,
    )
    fireEvent.click(day(/January 10th, 2025/))
    fireEvent.click(day(/January 12th, 2025/))
    fireEvent.click(day(/January 20th, 2025/))
    fireEvent.click(day(/January 22nd, 2025/))
    expect(onValueChange.mock.calls).toEqual([
      [january(10, 12)],
      [january(20, 22)],
    ])
  })

  it('shows a range without an end as open-ended and submits nothing', () => {
    const { container } = render(
      <form>
        <DateRangePicker
          aria-label="Stay"
          name="stay"
          value={{ from: new Date(2025, 0, 20), to: undefined }}
        />
      </form>,
    )
    expect(field()).toHaveTextContent('Jan 20, 2025 – …')
    expect(new FormData(formOf(container)).get('stay')).toBe('')
  })

  it('treats an Invalid Date as no range', () => {
    renderPicker({ value: { from: new Date(''), to: new Date(2025, 0, 2) } })
    expect(field()).toHaveTextContent('Pick a date range')
  })

  it('with excludeDisabled, an end past a disabled day starts a new range', () => {
    const onValueChange = vi.fn()
    renderPicker({
      defaultValue: january(13, 16),
      disabledDates: new Date(2025, 0, 24),
      excludeDisabled: true,
      onValueChange,
    })
    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    // The preview doesn't cover the 24th either.
    fireEvent.mouseEnter(day(/January 25th, 2025/))
    expect(cell(/January 22nd, 2025/)).not.toHaveAttribute('aria-selected')

    fireEvent.click(day(/January 25th, 2025/))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(cell(/January 25th, 2025/)).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(day(/January 27th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(january(25, 27))
  })

  it('covers disabled days without excludeDisabled', () => {
    const onValueChange = vi.fn()
    renderPicker({
      defaultValue: january(13, 16),
      disabledDates: new Date(2025, 0, 24),
      onValueChange,
    })
    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    fireEvent.click(day(/January 25th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(january(20, 25))
  })

  it('calls nothing when the same range is picked again', () => {
    const onValueChange = vi.fn()
    renderPicker({ defaultValue: january(13, 16), onValueChange })
    fireEvent.click(field())
    fireEvent.click(day(/January 13th, 2025/))
    fireEvent.click(day(/January 16th, 2025/))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('goes back to its initial range when the form resets', () => {
    const { container } = render(
      <form>
        <DateRangePicker
          aria-label="Stay"
          name="stay"
          defaultValue={january(13, 16)}
        />
      </form>,
    )
    const form = formOf(container)
    fireEvent.keyDown(field(), { key: 'Delete' })
    expect(new FormData(form).get('stay')).toBe('')
    act(() => form.reset())
    expect(new FormData(form).get('stay')).toBe('2025-01-13/2025-01-16')
  })

  it('blocks the form while required and empty (or without an end)', () => {
    const { container, rerender } = render(
      <form>
        <DateRangePicker aria-label="Stay" required value={null} />
      </form>,
    )
    expect(formOf(container).checkValidity()).toBe(false)
    rerender(
      <form>
        <DateRangePicker
          aria-label="Stay"
          required
          value={{ from: new Date(2025, 0, 13), to: undefined }}
        />
      </form>,
    )
    expect(formOf(container).checkValidity()).toBe(false)
    rerender(
      <form>
        <DateRangePicker aria-label="Stay" required value={january(13, 16)} />
      </form>,
    )
    expect(formOf(container).checkValidity()).toBe(true)
  })
})
