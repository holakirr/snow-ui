'use client'

import { format, isSameDay } from 'date-fns'
import { type FC, useRef, useState } from 'react'
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

/**
 * Props for the DatePicker component. Everything except the listed props
 * goes to the trigger, a `<button role="combobox">` (`id`, `aria-*`,
 * `onBlur`, `ref`…); `className` and `style` style the field.
 */
export type DatePickerProps = DatePickerSharedProps & {
  /** The picked date (controlled); `null` for none. */
  value?: Date | null
  /** The initially picked date when uncontrolled. */
  defaultValue?: Date | null
  /** Called with the picked date, and with `null` when the field is cleared. */
  onValueChange?: (value: Date | null) => void
}

/**
 * DatePicker is a field that opens a `Calendar` to pick a date: the Figma
 * Input field with the Figma DatePicker in a popover. The calendar is a
 * modal dialog; focus goes to the picked day (or today), the arrow keys
 * move between days, Enter picks one and closes it, Escape closes it without
 * a change. Localized by `SnowUIProvider` (`locale`, `messages`, `dir`).
 */
const DatePicker: FC<DatePickerProps> = ({
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
  // An Invalid Date counts as no date.
  const value = validDate(isControlled ? valueProp : innerValue)
  // What a form reset goes back to: the value on mount.
  const initialValue = useRef(value)
  const [open, setOpen] = useOpenState(
    openProp,
    defaultOpen,
    onOpenChange,
    disabled,
  )

  const setValue = (next: Date | null) => {
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  return (
    <DatePickerField
      open={open}
      setOpen={setOpen}
      text={
        value
          ? format(value, dateFormat, { locale })
          : (placeholder ?? messages.datePicker.placeholder)
      }
      hasValue={!!value}
      canClear={clearable && !disabled && !!value}
      clearLabel={clearLabel ?? messages.datePicker.clear}
      onClear={() => setValue(null)}
      dialogLabel={messages.datePicker.dialog}
      className={className}
      style={style}
      contentClassName={contentClassName}
      formValue={value ? format(value, 'yyyy-MM-dd') : ''}
      onFormReset={() => {
        if (!sameDate(initialValue.current, value)) {
          setValue(initialValue.current)
        }
      }}
      triggerProps={{ ...triggerProps, name, disabled }}
    >
      <Calendar
        defaultMonth={value ?? undefined}
        startMonth={minDate}
        endMonth={maxDate}
        weekStartsOn={weekStartsOn}
        locale={locale}
        {...calendarProps}
        mode="single"
        selected={value ?? undefined}
        // The clicked day, also when it is the picked one (react-day-picker
        // would unselect it); picking the same day again changes nothing.
        onSelect={(_, day) => {
          if (!value || !isSameDay(day, value)) setValue(day)
          setOpen(false)
        }}
        disabled={disabledMatchers(minDate, maxDate, disabledDates)}
      />
    </DatePickerField>
  )
}
DatePicker.displayName = 'DatePicker'

export { DatePicker }
