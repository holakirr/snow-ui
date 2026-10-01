import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { ru } from 'react-day-picker/locale'
import { useForm } from 'react-hook-form'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../react-hook-form'
import { getByRoleAndLabel } from '../../test/queries'
import { SnowUIProvider } from '../SnowUIProvider'
import { DatePicker, type DatePickerProps } from './DatePicker'

beforeAll(() => {
  // Radix positions the popover with ResizeObserver; jsdom has none.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const renderDatePicker = (props: Partial<DatePickerProps> = {}) =>
  render(
    <>
      <label htmlFor="due">Due date</label>
      <DatePicker id="due" {...props} />
    </>,
  )

const field = () => screen.getByRole('combobox')
const day = (name: RegExp) => getByRoleAndLabel('button', name)

describe('DatePicker', () => {
  it('is a labelled combobox that opens a dialog', () => {
    renderDatePicker()

    expect(field()).toHaveAccessibleName('Due date')
    expect(field().tagName).toBe('BUTTON')
    expect(field()).toHaveAttribute('aria-haspopup', 'dialog')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(field()).toHaveTextContent('Pick a date')
    expect(field()).toHaveAttribute('data-placeholder')
  })

  it('shows the value in the date-fns format', () => {
    const { rerender } = render(
      <DatePicker aria-label="Due" defaultValue={new Date(2025, 0, 20)} />,
    )
    expect(field()).toHaveTextContent('Jan 20, 2025')
    expect(field()).not.toHaveAttribute('data-placeholder')

    rerender(
      <DatePicker
        aria-label="Due"
        defaultValue={new Date(2025, 0, 20)}
        dateFormat="dd/MM/yyyy"
        key="format"
      />,
    )
    expect(field()).toHaveTextContent('20/01/2025')
  })

  it('opens on the picked day and picks another with a click', async () => {
    const onValueChange = vi.fn()
    renderDatePicker({ defaultValue: new Date(2025, 0, 20), onValueChange })

    // While the modal calendar is open, the rest of the page is aria-hidden.
    const trigger = field()
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Choose a date' })).toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute(
      'aria-controls',
      screen.getByRole('dialog').id,
    )
    await waitFor(() => expect(day(/January 20th, 2025/)).toHaveFocus())

    fireEvent.click(day(/January 9th, 2025/))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 0, 9))
    expect(field()).toHaveTextContent('Jan 9, 2025')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(field()).toHaveFocus())
  })

  it('keeps the date when its day is clicked again, without onValueChange', () => {
    const onValueChange = vi.fn()
    renderDatePicker({ defaultValue: new Date(2025, 0, 20), onValueChange })

    fireEvent.click(field())
    fireEvent.click(day(/January 20th, 2025/))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveTextContent('Jan 20, 2025')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens with ↓ and clears with Backspace or Delete', () => {
    const onValueChange = vi.fn()
    renderDatePicker({ defaultValue: new Date(2025, 0, 20), onValueChange })

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(field()).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(field(), { key: 'Delete' })
    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(field()).toHaveTextContent('Pick a date')

    // Nothing to clear.
    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('clears with the clear button and refocuses the field', () => {
    const onValueChange = vi.fn()
    renderDatePicker({ defaultValue: new Date(2025, 0, 20), onValueChange })

    fireEvent.click(screen.getByRole('button', { name: 'Clear date' }))
    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(field()).toHaveFocus()
    expect(
      screen.queryByRole('button', { name: 'Clear date' }),
    ).not.toBeInTheDocument()
  })

  it('has no clear button when clearable is false', () => {
    renderDatePicker({
      defaultValue: new Date(2025, 0, 20),
      clearable: false,
    })
    expect(
      screen.queryByRole('button', { name: 'Clear date' }),
    ).not.toBeInTheDocument()
    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(field()).toHaveTextContent('Jan 20, 2025')
  })

  it('limits the days with minDate, maxDate and disabledDates', () => {
    renderDatePicker({
      defaultValue: new Date(2025, 0, 15),
      minDate: new Date(2025, 0, 6),
      maxDate: new Date(2025, 0, 24),
      disabledDates: [new Date(2025, 0, 10), { dayOfWeek: [0] }],
      defaultOpen: true,
    })

    expect(day(/January 5th, 2025/)).toBeDisabled()
    expect(day(/January 25th, 2025/)).toBeDisabled()
    expect(day(/January 10th, 2025/)).toBeDisabled()
    expect(day(/January 12th, 2025/)).toBeDisabled()
    expect(day(/January 13th, 2025/)).toBeEnabled()
    // The calendar stays in the allowed months.
    expect(
      screen.getByRole('button', { name: /previous month/i }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: /next month/i })).toBeDisabled()
  })

  it('starts the week on Monday; the provider can follow the locale', () => {
    // react-day-picker hides the weekday row from assistive technology.
    const firstWeekday = () =>
      screen.getAllByRole('columnheader', { hidden: true })[0]
    const open = { defaultValue: new Date(2025, 0, 15), defaultOpen: true }

    // Monday by default, whatever the locale.
    const { unmount } = render(<DatePicker aria-label="Due" {...open} />)
    expect(firstWeekday()).toHaveAccessibleName('Monday')
    unmount()

    // The provider's `weekStartsOn="locale"`: Sunday in en-US …
    const { unmount: unmountLocale } = render(
      <SnowUIProvider weekStartsOn="locale">
        <DatePicker aria-label="Due" {...open} />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Sunday')
    unmountLocale()

    // … Monday in Russian.
    const { unmount: unmountRu } = render(
      <SnowUIProvider locale={ru} weekStartsOn="locale">
        <DatePicker aria-label="Срок" {...open} />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName(/понедельник/i)
    unmountRu()

    // The prop wins over the provider.
    render(
      <SnowUIProvider weekStartsOn="locale">
        <DatePicker aria-label="Due" weekStartsOn={1} {...open} />
      </SnowUIProvider>,
    )
    expect(firstWeekday()).toHaveAccessibleName('Monday')
  })

  it('passes calendarProps to the calendar', () => {
    renderDatePicker({
      defaultValue: new Date(2025, 0, 15),
      defaultOpen: true,
      calendarProps: { showTodayButton: true },
    })
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument()
  })

  it('works controlled', () => {
    const Controlled = () => {
      const [value, setValue] = useState<Date | null>(null)
      return (
        <>
          <DatePicker
            aria-label="Due"
            value={value}
            onValueChange={setValue}
            calendarProps={{ defaultMonth: new Date(2025, 0, 1) }}
          />
          <output>{value?.toDateString() ?? 'none'}</output>
        </>
      )
    }
    render(<Controlled />)

    fireEvent.click(field())
    fireEvent.click(day(/January 3rd, 2025/))
    expect(screen.getByText('Fri Jan 03 2025')).toBeInTheDocument()
  })

  it('works with a controlled open state', () => {
    const onOpenChange = vi.fn()
    render(
      <DatePicker aria-label="Due" open={false} onOpenChange={onOpenChange} />,
    )
    fireEvent.click(field())
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('stays closed while disabled', () => {
    renderDatePicker({ disabled: true, defaultValue: new Date(2025, 0, 20) })

    expect(field()).toBeDisabled()
    fireEvent.click(field())
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Clear date' }),
    ).not.toBeInTheDocument()
    expect(field().closest('[data-slot="date-picker"]')).toHaveAttribute(
      'data-disabled',
      'true',
    )
  })

  it('submits an ISO date with a hidden input', () => {
    const { container } = renderDatePicker({
      name: 'due',
      defaultValue: new Date(2025, 0, 20),
    })
    const hidden = container.querySelector('input[type="hidden"]')
    expect(hidden).toHaveAttribute('name', 'due')
    expect(hidden).toHaveValue('2025-01-20')
  })

  it('leaves a disabled field out of the form data', () => {
    const { container } = render(
      <form>
        <DatePicker
          aria-label="Due"
          name="due"
          defaultValue={new Date(2025, 0, 20)}
        />
        <DatePicker
          aria-label="Start"
          name="start"
          defaultValue={new Date(2025, 0, 20)}
          disabled
        />
      </form>,
    )
    const data = new FormData(
      container.querySelector('form') as HTMLFormElement,
    )
    expect(data.get('due')).toBe('2025-01-20')
    expect(data.has('start')).toBe(false)
  })

  it('shows the red stroke while invalid; marks the field required', () => {
    renderDatePicker({ 'aria-invalid': true, required: true })
    expect(field()).toBeInvalid()
    expect(field()).toHaveAttribute('aria-required', 'true')
    expect(field().closest('[data-slot="date-picker"]')).toHaveClass(
      'inset-ring-control-border',
      'contrast-more:inset-ring-1',
      'has-aria-invalid:inset-ring',
      'has-aria-invalid:inset-ring-control-border-invalid',
    )
  })

  it('is localized by SnowUIProvider; the locale prop wins', () => {
    const { unmount } = render(
      <SnowUIProvider
        locale={ru}
        messages={{
          datePicker: {
            placeholder: 'Выберите дату',
            clear: 'Очистить дату',
            dialog: 'Выбор даты',
          },
        }}
      >
        <DatePicker aria-label="Срок" defaultValue={new Date(2025, 0, 20)} />
        <DatePicker aria-label="Начало" />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('combobox', { name: 'Срок' })).toHaveTextContent(
      '20 янв. 2025 г.',
    )
    expect(screen.getByRole('combobox', { name: 'Начало' })).toHaveTextContent(
      'Выберите дату',
    )
    expect(
      screen.getByRole('button', { name: 'Очистить дату' }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('combobox', { name: 'Срок' }))
    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeVisible()
    unmount()

    render(
      <DatePicker
        aria-label="Due"
        locale={ru}
        defaultValue={new Date(2025, 0, 20)}
      />,
    )
    expect(field()).toHaveTextContent('20 янв. 2025 г.')
  })

  it('forwards the ref to the trigger for react-hook-form', async () => {
    let setFocus: (name: 'due') => void = () => {}
    const TestForm = () => {
      const form = useForm<{ due: Date | null }>({
        defaultValues: { due: null },
      })
      setFocus = form.setFocus
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="due"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Due date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={value}
                    onValueChange={onChange}
                    {...rest}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      )
    }
    render(<TestForm />)

    // react-hook-form focuses the field's ref in a timeout.
    act(() => setFocus('due'))
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Due date' })).toHaveFocus(),
    )
  })
})

describe('DatePicker in a form', () => {
  const formOf = (container: HTMLElement) =>
    container.querySelector('form') as HTMLFormElement

  it('treats an Invalid Date as no date instead of crashing', () => {
    const { container } = render(
      <form>
        <DatePicker aria-label="Due" name="due" value={new Date('')} />
      </form>,
    )
    expect(field()).toHaveTextContent('Pick a date')
    expect(new FormData(formOf(container)).get('due')).toBe('')
  })

  it('goes back to its initial date when the form resets', async () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <form>
        <DatePicker
          aria-label="Due"
          name="due"
          defaultValue={new Date(2025, 0, 20)}
          onOpenChange={onOpenChange}
        />
      </form>,
    )
    const form = formOf(container)
    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(new FormData(form).get('due')).toBe('')

    await act(async () => form.reset())
    expect(new FormData(form).get('due')).toBe('2025-01-20')
    expect(field()).toHaveTextContent('Jan 20, 2025')
  })

  it('submits and resets with a form outside it (form="id")', async () => {
    render(
      <>
        <form id="task" data-testid="form" />
        <DatePicker
          aria-label="Due"
          name="due"
          form="task"
          defaultValue={new Date(2025, 0, 20)}
        />
      </>,
    )
    const form = screen.getByTestId('form') as HTMLFormElement
    expect(new FormData(form).get('due')).toBe('2025-01-20')
    fireEvent.keyDown(field(), { key: 'Delete' })
    await act(async () => form.reset())
    expect(new FormData(form).get('due')).toBe('2025-01-20')
  })

  it('blocks the form while required and empty; focus goes to the field', () => {
    const onInvalid = vi.fn()
    const { container } = render(
      <form>
        <DatePicker
          aria-label="Due"
          name="due"
          required
          onInvalid={onInvalid}
          calendarProps={{ defaultMonth: new Date(2025, 0, 1) }}
        />
      </form>,
    )
    const form = formOf(container)
    expect(field()).toHaveAttribute('aria-required', 'true')
    expect(form.checkValidity()).toBe(false)
    // The `invalid` event fires on the stand-in and reaches `onInvalid`.
    expect(onInvalid).toHaveBeenCalledTimes(1)

    // The browser focuses the invalid stand-in; the focus moves on.
    const proxy = container.querySelector(
      '[data-slot="required-proxy"]',
    ) as HTMLInputElement
    expect(proxy).toHaveAttribute('aria-hidden', 'true')
    act(() => proxy.focus())
    expect(field()).toHaveFocus()

    fireEvent.click(field())
    fireEvent.click(day(/January 9th, 2025/))
    expect(form.checkValidity()).toBe(true)
  })

  it('focuses the month navigation when no day can be picked', async () => {
    renderDatePicker({
      defaultValue: new Date(2025, 0, 20),
      disabledDates: { from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) },
    })
    fireEvent.click(field())
    const dialog = screen.getByRole('dialog')
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    )
  })

  it('tells the parent it closed when it is disabled while open', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <DatePicker aria-label="Due" onOpenChange={onOpenChange} />,
    )
    fireEvent.click(field())
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    rerender(
      <DatePicker aria-label="Due" onOpenChange={onOpenChange} disabled />,
    )
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
