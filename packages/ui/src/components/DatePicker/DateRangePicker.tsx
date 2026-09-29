'use client'

import { format, isSameDay } from 'date-fns'
import { type FC, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '../Calendar'
import { useSnowUI } from '../SnowUIProvider'
import {
  DatePickerField,
  type DatePickerSharedProps,
  disabledMatchers,
  useOpenState,
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
   * the field is cleared.
   */
  onValueChange?: (value: DateRange | null) => void
  /**
   * The number of months the calendar shows side by side.
   * @default 1
   */
  numberOfMonths?: number
}

const ordered = (a: Date, b: Date): DateRange =>
  a <= b ? { from: a, to: b } : { from: b, to: a }

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
  const value = isControlled ? valueProp : innerValue
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
  const text = value?.from
    ? messages.datePicker
        .range(formatDate(value.from), value.to ? formatDate(value.to) : '')
        .trim()
    : (placeholder ?? messages.datePicker.rangePlaceholder)
  const iso = (date: Date | undefined) =>
    date ? format(date, 'yyyy-MM-dd') : ''

  return (
    <DatePickerField
      open={open}
      setOpen={setOpen}
      text={text}
      hasValue={!!value?.from}
      canClear={clearable && !disabled && !!value?.from}
      clearLabel={clearLabel ?? messages.datePicker.clear}
      onClear={() => setValue(null)}
      dialogLabel={messages.datePicker.rangeDialog}
      className={className}
      style={style}
      contentClassName={contentClassName}
      hiddenInputs={
        name !== undefined && (
          // An ISO 8601 interval: "2025-01-20/2025-01-27".
          <input
            type="hidden"
            name={name}
            value={value?.from ? `${iso(value.from)}/${iso(value.to)}` : ''}
          />
        )
      }
      triggerProps={{ ...triggerProps, disabled }}
    >
      <Calendar
        defaultMonth={value?.from}
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
        // (react-day-picker would extend the current range instead).
        onSelect={(_, day) => {
          if (!start) {
            setStart(day)
            return
          }
          setValue(ordered(start, day))
          setOpen(false)
        }}
        onDayMouseEnter={(day, modifiers, event) => {
          calendarProps?.onDayMouseEnter?.(day, modifiers, event)
          if (start && !modifiers.disabled) setHovered(day)
        }}
        disabled={disabledMatchers(minDate, maxDate, disabledDates)}
      />
    </DatePickerField>
  )
}
DateRangePicker.displayName = 'DateRangePicker'

export { DateRangePicker }
