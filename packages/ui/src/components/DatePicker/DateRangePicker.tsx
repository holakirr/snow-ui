'use client'

import { format, isSameDay } from 'date-fns'
import { type FC, useRef, useState } from 'react'
import { type DateRange, rangeContainsModifiers } from 'react-day-picker'
import { Calendar } from '../Calendar'
import { useSnowUI } from '../SnowUIProvider'
import {
  DatePickerField,
  type DatePickerSharedProps,
  disabledMatchers,
  sameDate,
  useOpenState,
  validDate,
} from './field'

export type { DateRange } from 'react-day-picker'

/**
 * Props for the DateRangePicker component. Everything except the listed
 * props goes to the trigger, a `<button role="combobox">` (`id`, `aria-*`,
 * `onBlur`, `ref`…); `className` and `style` style the field.
 */
export type DateRangePickerProps = DatePickerSharedProps & {
  /** The picked range (controlled); `null` for none. */
  value?: DateRange | null
  /** The initially picked range when uncontrolled. */
  defaultValue?: DateRange | null
  /**
   * Called with the picked range once both ends are picked (`from` and `to`
   * are set; the same day twice is a one-day range), and with `null` when
   * the field is cleared. Picking the range the field already has calls
   * nothing.
   */
  onValueChange?: (value: DateRange | null) => void
  /**
   * A range can't include a day that can't be picked (`minDate`, `maxDate`,
   * `disabledDates`): an end that would cover one starts a new range there
   * instead, as react-day-picker's `excludeDisabled` does. Use it for
   * bookings, where a taken night splits the calendar.
   * @default false
   */
  excludeDisabled?: boolean
  /**
   * The number of months the calendar shows side by side.
   * @default 1
   */
  numberOfMonths?: number
}

const ordered = (a: Date, b: Date): { from: Date; to: Date } =>
  a <= b ? { from: a, to: b } : { from: b, to: a }

/** Whether two ranges (or `null`s) have the same ends. */
const sameRange = (a: DateRange | null, b: DateRange | null) =>
  sameDate(a?.from ?? null, b?.from ?? null) &&
  sameDate(a?.to ?? null, b?.to ?? null)

/**
 * DateRangePicker is a field that opens a `Calendar` to pick a range of
 * dates. The first click (or Enter) picks the start, the second the end,
 * and the calendar closes; while the end is being picked, the range follows
 * the pointer. Everything else works as in `DatePicker`.
 */
const DateRangePicker: FC<DateRangePickerProps> = ({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder,
  minDate,
  maxDate,
  disabledDates,
  dateFormat = 'PP',
  locale: localeProp,
  weekStartsOn,
  numberOfMonths = 1,
  excludeDisabled = false,
  clearable = true,
  clearLabel,
  calendarProps,
  className,
  style,
  contentClassName,
  name,
  disabled = false,
  ...triggerProps
}) => {
  const { messages, locale: providerLocale } = useSnowUI()
  const locale = localeProp ?? providerLocale
  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = useState(defaultValue)
  const raw = isControlled ? valueProp : innerValue
  // An Invalid Date counts as no date; a range without a valid start is none.
  const from = validDate(raw?.from)
  const to = from ? validDate(raw?.to) : null
  const value: DateRange | null = from ? { from, to: to ?? undefined } : null
  // What a form reset goes back to: the range on mount.
  const initialValue = useRef(value)
  const matchers = disabledMatchers(minDate, maxDate, disabledDates)
  // The start picked since the calendar opened, and the day under the
  // pointer, which previews the end.
  const [start, setStart] = useState<Date>()
  const [hovered, setHovered] = useState<Date>()
  const [open, setOpen] = useOpenState(
    openProp,
    defaultOpen,
    onOpenChange,
    disabled,
  )

  // A new range every time the calendar opens: drop a half-picked range
  // whenever the open state changes, also when a controlled `open` (or
  // `disabled`) closes it without `onOpenChange`.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    setStart(undefined)
    setHovered(undefined)
  }

  const setValue = (next: DateRange | null) => {
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  const formatDate = (date: Date) => format(date, dateFormat, { locale })
  // A range without an end (a controlled `{ from }`) shows as open-ended,
  // "Jan 20, 2025 – …", and isn't a value a form submits.
  const text = from
    ? messages.datePicker.range(formatDate(from), to ? formatDate(to) : '…')
    : (placeholder ?? messages.datePicker.rangePlaceholder)
  const iso = (date: Date) => format(date, 'yyyy-MM-dd')

  /** The end of a range: a new value (unless it's the same), and it closes. */
  const pickEnd = (range: { from: Date; to: Date }) => {
    setStart(undefined)
    setHovered(undefined)
    if (!sameRange(range, value)) setValue(range)
    setOpen(false)
  }

  /** Whether `range` covers a day that can't be picked (`excludeDisabled`). */
  const coversDisabled = (range: { from: Date; to: Date }) =>
    excludeDisabled && rangeContainsModifiers(range, matchers)

  return (
    <DatePickerField
      open={open}
      setOpen={setOpen}
      text={text}
      hasValue={!!from}
      canClear={clearable && !disabled && !!from}
      clearLabel={clearLabel ?? messages.datePicker.clear}
      onClear={() => setValue(null)}
      dialogLabel={messages.datePicker.rangeDialog}
      className={className}
      style={style}
      contentClassName={contentClassName}
      // An ISO 8601 interval, "2025-01-20/2025-01-27"; nothing without an end.
      formValue={from && to ? `${iso(from)}/${iso(to)}` : ''}
      onFormReset={() => {
        if (!sameRange(initialValue.current, value)) {
          setValue(initialValue.current)
        }
      }}
      triggerProps={{ ...triggerProps, name, disabled }}
    >
      <Calendar
        defaultMonth={from ?? undefined}
        startMonth={minDate}
        endMonth={maxDate}
        weekStartsOn={weekStartsOn}
        locale={locale}
        numberOfMonths={numberOfMonths}
        // A one-day range (both ends on one day) keeps its rounded corners.
        rangeStartClassName="[&.day-range-end>button]:rounded-e-12"
        rangeEndClassName="[&.day-range-start>button]:rounded-s-12"
        {...calendarProps}
        mode="range"
        selected={
          start
            ? hovered && !isSameDay(hovered, start)
              ? ordered(start, hovered)
              : { from: start, to: undefined }
            : (value ?? undefined)
        }
        // A new range every time: the clicked day is the start, then the end
        // (react-day-picker would extend the current range instead). With
        // `excludeDisabled`, an end past a day that can't be picked starts
        // a new range there.
        onSelect={(_, day) => {
          if (!start || coversDisabled(ordered(start, day))) {
            setStart(day)
            setHovered(undefined)
            return
          }
          pickEnd(ordered(start, day))
        }}
        onDayMouseEnter={(day, modifiers, event) => {
          calendarProps?.onDayMouseEnter?.(day, modifiers, event)
          if (!start || modifiers.disabled) return
          setHovered(coversDisabled(ordered(start, day)) ? undefined : day)
        }}
        disabled={matchers}
      />
    </DatePickerField>
  )
}
DateRangePicker.displayName = 'DateRangePicker'

export { DateRangePicker }
