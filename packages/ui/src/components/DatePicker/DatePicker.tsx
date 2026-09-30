'use client'

import { format, isSameDay, startOfDay } from 'date-fns'
import { type FC, useRef, useState } from 'react'
import { dateMatchModifiers } from 'react-day-picker'
import { Calendar } from '../Calendar'
import { useSnowUI } from '../SnowUIProvider'
import {
  DatePickerField,
  type DatePickerSharedProps,
  dateTimeFormat,
  disabledMatchers,
  formDateTime,
  placeholderAt,
  sameDate,
  shortCaption,
  useOpenState,
  validDate,
  withTimeOf,
} from './field'
import { DatePickerPanel } from './panel'
import { dayPeriodLabels, localeHourCycle } from './segments'

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
  /**
   * Called with the picked date when the calendar closes with a new one,
   * and with `null` when the field is cleared.
   */
  onValueChange?: (value: Date | null) => void
}

/** A calendar session: from opening to closing. */
type Session = {
  /** The date being picked: the value once the calendar closes. */
  draft: Date | null
  /** The value when the calendar opened: "Last selection". */
  last: Date | null
  /** Today, now: what the empty top area shows. */
  placeholder: Date
}

/**
 * DatePicker is a field that opens the Figma DatePicker to pick a date (and
 * a time with `withTime`): the typed date at the top, "Today" and "Last
 * selection", the days, and the months and years that its parts open. The
 * popover is a modal dialog; focus goes to the picked day (or today), the
 * arrow keys move between days, Enter picks one and closes it, Escape closes
 * it without a change. Localized by `SnowUIProvider` (`locale`, `messages`,
 * `dir`).
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
  dateFormat: dateFormatProp,
  locale: localeProp,
  weekStartsOn,
  withTime: withTimeProp = false,
  withSeconds = false,
  hourCycle: hourCycleProp,
  title,
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
  const { messages, locale: providerLocale, dir } = useSnowUI()
  const locale = localeProp ?? providerLocale
  const lang = locale?.code ?? 'en-US'
  const withTime = withTimeProp || withSeconds
  const hourCycle = hourCycleProp ?? localeHourCycle(lang)
  const dateFormat =
    dateFormatProp ?? (withTime ? dateTimeFormat(hourCycle, withSeconds) : 'PP')
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
  const matchers = disabledMatchers(minDate, maxDate, disabledDates)
  const today = calendarProps?.today ?? new Date()

  const newSession = (): Session => ({
    draft: value,
    last: value,
    placeholder: placeholderAt(today, withSeconds),
  })
  const [session, setSession] = useState(newSession)
  // A new session every time the calendar opens or closes.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    setSession(newSession())
  }
  // The value changes while the calendar is open (a controlled value, or the
  // date just confirmed while a controlled `open` stays true): a session
  // with nothing picked shows it, and closing doesn't bring back the old one.
  const [sessionValue, setSessionValue] = useState(value)
  if (!sameDate(sessionValue, value)) {
    setSessionValue(value)
    setSession((current) =>
      sameDate(current.draft, current.last)
        ? { ...current, draft: value, last: value }
        : current,
    )
  }
  const setDraft = (draft: Date | null) =>
    setSession((current) => ({ ...current, draft }))

  const setValue = (next: Date | null) => {
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  // Without time, the same day is the same date.
  const same = (a: Date, b: Date) =>
    withTime ? sameDate(a, b) : isSameDay(a, b)

  /** Closes the calendar with `next` as the value (unless it is the same). */
  const confirm = (next: Date | null) => {
    if (next && !(value && same(next, value))) setValue(next)
    setOpen(false)
    setSession(newSession())
  }

  const isAllowed = (date: Date) => !dateMatchModifiers(date, matchers)

  /** A day of the calendar: the date, keeping the time. */
  const pickDay = (day: Date) => {
    if (!withTime) {
      confirm(day)
      return
    }
    // Picking the picked day again confirms, like Enter in the top area.
    if (session.draft && isSameDay(day, session.draft)) {
      confirm(session.draft)
      return
    }
    setDraft(withTimeOf(day, session.draft ?? session.placeholder))
  }

  /** "Today" and "Last selection": the date, without closing. */
  const choose = (date: Date) =>
    setDraft(
      withTime
        ? withTimeOf(date, session.draft ?? session.placeholder)
        : startOfDay(date),
    )

  return (
    <DatePickerField
      open={open}
      setOpen={setOpen}
      onClose={(reason) =>
        reason === 'confirm' ? confirm(session.draft) : setOpen(false)
      }
      title={title}
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
      formValue={value ? formDateTime(value, withTime, withSeconds) : ''}
      onFormReset={() => {
        setSession(newSession())
        if (!sameDate(initialValue.current, value)) {
          setValue(initialValue.current)
        }
      }}
      triggerProps={{ ...triggerProps, name, disabled }}
    >
      <DatePickerPanel
        dates={[session.draft]}
        active={0}
        onDateChange={(_, date) => setDraft(date)}
        isAllowed={isAllowed}
        labels={[messages.datePicker.date]}
        timeLabel={messages.datePicker.time}
        withTime={withTime}
        withSeconds={withSeconds}
        hourCycle={hourCycle}
        locale={locale}
        lang={lang}
        periods={dayPeriodLabels(lang)}
        placeholders={[session.placeholder]}
        today={today}
        minDate={minDate}
        maxDate={maxDate}
        hasLastSelection={!!session.last}
        onLastSelection={() => session.last && choose(session.last)}
        onConfirm={() => confirm(session.draft)}
        initialMonth={
          calendarProps?.month ?? calendarProps?.defaultMonth ?? value ?? today
        }
        month={calendarProps?.month}
        onMonthChange={calendarProps?.onMonthChange}
        numberOfMonths={calendarProps?.numberOfMonths ?? 1}
        rtl={(calendarProps?.dir ?? dir) === 'rtl'}
        renderCalendar={({ month, onMonthChange, components }) => (
          <Calendar
            startMonth={minDate}
            endMonth={maxDate}
            weekStartsOn={weekStartsOn}
            locale={locale}
            showTodayButton
            onTodayClick={choose}
            lastSelection={session.last ?? undefined}
            onLastSelectionClick={choose}
            {...calendarProps}
            month={month}
            onMonthChange={onMonthChange}
            // The Figma caption: the short month ("Feb"); the year is in the
            // top area. It opens the months.
            formatters={{
              formatCaption: shortCaption(locale),
              ...calendarProps?.formatters,
            }}
            components={{ ...components, ...calendarProps?.components }}
            showYearSwitcher={false}
            mode="single"
            selected={session.draft ?? undefined}
            // The clicked day, also when it is the picked one (react-day-picker
            // would unselect it); picking the same day again changes nothing.
            onSelect={(_, day) => pickDay(day)}
            disabled={matchers}
          />
        )}
      />
    </DatePickerField>
  )
}
DatePicker.displayName = 'DatePicker'

export { DatePicker }
