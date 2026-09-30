'use client'

import {
  format,
  isSameDay,
  isSameMonth,
  type Locale,
  startOfDay,
} from 'date-fns'
import { type FC, useRef, useState } from 'react'
import {
  type DateRange,
  dateMatchModifiers,
  rangeContainsModifiers,
} from 'react-day-picker'
import { Calendar } from '../Calendar'
import { defaultMessages, useSnowUI } from '../SnowUIProvider'
import {
  DatePickerField,
  type DatePickerSharedProps,
  dateTimeFormat,
  disabledMatchers,
  formDateTime,
  placeholderAt,
  shortCaption,
  useOpenState,
  validDate,
  withTimeOf,
} from './field'
import { DatePickerPanel } from './panel'
import { dayPeriodLabels, localeHourCycle } from './segments'

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
   * are set; the same day twice is a one-day range) and the calendar
   * closes, and with `null` when the field is cleared. Picking the range the
   * field already has calls nothing. A form reset calls it with the range
   * the field had on mount.
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

/** A calendar session: from opening to closing. */
type Session = {
  /** The range being picked: the value once both ends are set and it closes. */
  from: Date | null
  to: Date | null
  /** The end the next day, the typed date and the time set: 0 or 1. */
  active: number
  /**
   * Nothing picked yet: the first day starts a new range. Clicking an end
   * in the top area picks that end instead, keeping the other.
   */
  fresh: boolean
  /** The day under the pointer while the end is picked: a preview. */
  hovered?: Date
  /** The value when the calendar opened: "Last selection". */
  last: DateRange | null
  /** Today, now: what an empty date in the top area shows. */
  placeholder: Date
}

/**
 * Intl's short date in the Gregorian calendar with Latin digits, as the
 * calendar grid, for its range format. `null` for a language tag Intl
 * rejects.
 */
const rangeFormats = new Map<string, Intl.DateTimeFormat | null>()
const rangeFormat = (lang: string) => {
  let formatter = rangeFormats.get(lang)
  if (formatter === undefined) {
    try {
      formatter = new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        calendar: 'gregory',
        numberingSystem: 'latn',
      })
    } catch {
      formatter = null
    }
    rangeFormats.set(lang, formatter)
  }
  return formatter
}

/**
 * A range within one month with the month and the year once, in the
 * locale's order and dash: "Feb 2 – 10, 2026", "2–10 фев. 2026 г.". Intl's
 * `formatRangeToParts` gives the order and the dash; the month is date-fns's
 * "MMM", as in the full dates ("PP") and DatePicker, so the text depends on
 * the runtime's ICU as little as it can (its dash still can: "–" or "—" in
 * Russian). Plain spaces: ICU versions differ on the thin spaces around the
 * dash (Node's and the browser's would give a hydration mismatch), as in
 * Scheduler. `undefined` where Intl can't write it: a language tag it
 * rejects, no range format, or a locale whose range repeats the month or
 * writes it in digits (Japanese, Chinese): the field then shows two dates.
 */
const monthRange = (
  from: Date,
  to: Date,
  lang: string,
  locale: Locale | undefined,
) => {
  const formatter = rangeFormat(lang)
  if (!formatter) return undefined
  let parts: Intl.DateTimeRangeFormatPart[]
  try {
    parts = formatter.formatRangeToParts(from, to)
  } catch {
    return undefined
  }
  const month = parts.find((part) => part.type === 'month')
  const year = parts.find((part) => part.type === 'year')
  if (
    month?.source !== 'shared' ||
    year?.source !== 'shared' ||
    /\d/.test(month.value)
  ) {
    return undefined
  }
  return parts
    .map((part) =>
      part.type === 'month' ? format(from, 'MMM', { locale }) : part.value,
    )
    .join('')
    .replace(/\s+/g, ' ')
}

/**
 * DateRangePicker is a field that opens the Figma DatePicker to pick a range
 * of dates (and times with `withTime`): the typed start and end at the top,
 * the one being picked in black and the other dimmed. The first click (or
 * Enter) picks the start, the second the end, and the calendar closes; while
 * the end is being picked, the range follows the pointer. Clicking a date in
 * the top area picks that end. Everything else works as in `DatePicker`.
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
  dateFormat: dateFormatProp,
  locale: localeProp,
  weekStartsOn,
  withTime: withTimeProp = false,
  withSeconds = false,
  hourCycle: hourCycleProp,
  title,
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
  const { messages, locale: providerLocale, dir } = useSnowUI()
  const locale = localeProp ?? providerLocale
  const lang = locale?.code ?? 'en-US'
  const withTime = withTimeProp || withSeconds
  const hourCycle = hourCycleProp ?? localeHourCycle(lang)
  const dateFormat =
    dateFormatProp ?? (withTime ? dateTimeFormat(hourCycle, withSeconds) : 'PP')
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
  const today = calendarProps?.today ?? new Date()
  const [open, setOpen] = useOpenState(
    openProp,
    defaultOpen,
    onOpenChange,
    disabled,
  )

  const newSession = (range: DateRange | null = value): Session => ({
    from: range?.from ?? null,
    to: range?.to ?? null,
    active: 0,
    fresh: true,
    last: value,
    placeholder: placeholderAt(today, withSeconds),
  })
  const [session, setSession] = useState(() => newSession())
  // A new range every time the calendar opens: drop a half-picked range
  // whenever the open state changes, also when a controlled `open` (or
  // `disabled`) closes it without `onOpenChange`.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    setSession(newSession())
  }
  const update = (change: Partial<Session>) =>
    setSession((current) => ({ ...current, ...change }))

  const setValue = (next: DateRange | null) => {
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  // The default text, as the kit's formats: a range within one month
  // writes the month and the year once ("Feb 2 – 10, 2026"), any other
  // range two full dates ("Feb 2, 2026 – Mar 3, 2026"), a one-day range
  // that day. A `dateFormat`, the time or a `messages.datePicker.range` of
  // your own gives two dates in the `dateFormat` joined by that message.
  const compact =
    !dateFormatProp &&
    !withTime &&
    messages.datePicker.range === defaultMessages.datePicker.range
  const formatDate = (date: Date) => format(date, dateFormat, { locale })
  const rangeText = (start: Date, end: Date | null) => {
    if (end && compact && isSameDay(start, end)) return formatDate(start)
    const once =
      end && compact && isSameMonth(start, end) && start < end
        ? monthRange(start, end, lang, locale)
        : undefined
    // A range without an end (a controlled `{ from }`) shows as
    // open-ended, "Jan 20, 2025 – …", and isn't a value a form submits.
    return (
      once ??
      messages.datePicker.range(formatDate(start), end ? formatDate(end) : '…')
    )
  }
  const text = from
    ? rangeText(from, to)
    : (placeholder ?? messages.datePicker.rangePlaceholder)
  const formValue = (date: Date) => formDateTime(date, withTime, withSeconds)

  // Without time, the ends compare by day.
  const before = (a: Date, b: Date) =>
    withTime ? a < b : startOfDay(a) < startOfDay(b)
  const ordered = (a: Date, b: Date) =>
    before(b, a) ? { from: b, to: a } : { from: a, to: b }
  const sameRange = (a: DateRange | null, b: DateRange | null) => {
    const same = (x?: Date, y?: Date) =>
      x && y
        ? withTime
          ? x.getTime() === y.getTime()
          : isSameDay(x, y)
        : x === y
    return same(a?.from, b?.from) && same(a?.to, b?.to)
  }

  // The value changes while the calendar is open (a controlled value, or the
  // range just confirmed while a controlled `open` stays true): a session
  // with nothing picked shows it, and closing doesn't bring back the old one.
  const [sessionValue, setSessionValue] = useState(value)
  if (!sameRange(sessionValue, value)) {
    setSessionValue(value)
    setSession((current) =>
      current.fresh
        ? {
            ...current,
            from: value?.from ?? null,
            to: value?.to ?? null,
            last: value,
          }
        : current,
    )
  }

  /** Whether `range` covers a day that can't be picked (`excludeDisabled`). */
  const coversDisabled = (range: { from: Date; to: Date }) =>
    excludeDisabled && rangeContainsModifiers(range, matchers)

  /** Closes the calendar with a complete range (unless it is the same). */
  const confirm = (range: { from: Date | null; to: Date | null }) => {
    if (range.from && range.to) {
      const next = { from: range.from, to: range.to }
      if (!sameRange(next, value)) setValue(next)
    }
    setOpen(false)
    // A controlled `open` may stay true: the next click starts a new range.
    setSession(
      newSession(
        range.from && range.to ? { from: range.from, to: range.to } : value,
      ),
    )
  }

  /** Both ends are set: without time the calendar closes. */
  const complete = (range: { from: Date; to: Date }) => {
    if (!withTime) {
      confirm(range)
      return
    }
    update({ ...range, active: 1, fresh: false, hovered: undefined })
  }

  const timed = (day: Date, end: Date | null) =>
    withTime ? withTimeOf(day, end ?? session.placeholder) : day

  /** A day of the calendar for the active end. */
  const pickDay = (day: Date) => {
    const { active, fresh } = session
    if (active === 0) {
      const start = timed(day, session.from)
      const end = session.to
      if (
        !fresh &&
        end &&
        !before(end, start) &&
        !coversDisabled({ from: start, to: end })
      ) {
        complete({ from: start, to: end })
        return
      }
      update({ from: start, to: null, active: 1, fresh: false })
      return
    }
    if (!session.from) {
      update({ from: timed(day, null), to: null, fresh: false })
      return
    }
    const range = ordered(session.from, timed(day, session.to))
    // With `excludeDisabled`, an end past a day that can't be picked starts
    // a new range there.
    if (coversDisabled(range)) {
      update({ from: timed(day, session.from), to: null, hovered: undefined })
      return
    }
    complete(range)
  }

  const isAllowed = (date: Date, index: number) => {
    if (dateMatchModifiers(date, matchers)) return false
    const other = index === 0 ? session.to : session.from
    if (!other) return true
    const range =
      index === 0 ? { from: date, to: other } : { from: other, to: date }
    // The start can't be after the end.
    return !before(range.to, range.from) && !coversDisabled(range)
  }

  // The calendar shows the range being picked: the start, then the range to
  // the day under the pointer.
  const selected: DateRange | undefined = session.from
    ? session.to
      ? { from: session.from, to: session.to }
      : session.active === 1 &&
          session.hovered &&
          !isSameDay(session.hovered, session.from)
        ? ordered(session.from, session.hovered)
        : { from: session.from, to: undefined }
    : undefined

  return (
    <DatePickerField
      open={open}
      setOpen={setOpen}
      onClose={(reason) =>
        reason === 'confirm' ? confirm(session) : setOpen(false)
      }
      title={title}
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
      formValue={from && to ? `${formValue(from)}/${formValue(to)}` : ''}
      onFormReset={() => {
        // A half-picked range goes too, also while a controlled `open`
        // keeps the calendar open.
        setSession(newSession(initialValue.current))
        if (!sameRange(initialValue.current, value)) {
          setValue(initialValue.current)
        }
      }}
      triggerProps={{ ...triggerProps, name, disabled }}
    >
      <DatePickerPanel
        dates={[session.from, session.to]}
        active={session.active}
        onActiveChange={(active) => update({ active, fresh: false })}
        onDateChange={(index, date) =>
          update(
            index === 0
              ? { from: date, fresh: false }
              : { to: date, fresh: false },
          )
        }
        isAllowed={isAllowed}
        labels={[messages.datePicker.startDate, messages.datePicker.endDate]}
        timeLabel={
          session.active === 0
            ? messages.datePicker.startTime
            : messages.datePicker.endTime
        }
        withTime={withTime}
        withSeconds={withSeconds}
        hourCycle={hourCycle}
        locale={locale}
        lang={lang}
        periods={dayPeriodLabels(lang)}
        // An empty end starts from the start's day.
        placeholders={[
          session.placeholder,
          session.from
            ? withTimeOf(session.from, session.placeholder)
            : session.placeholder,
        ]}
        today={today}
        minDate={minDate}
        maxDate={maxDate}
        hasLastSelection={!!session.last}
        onLastSelection={() =>
          session.last &&
          update({
            from: session.last.from ?? null,
            to: session.last.to ?? null,
            active: 0,
            fresh: true,
            hovered: undefined,
          })
        }
        onConfirm={() => confirm(session)}
        initialMonth={
          calendarProps?.month ?? calendarProps?.defaultMonth ?? from ?? today
        }
        month={calendarProps?.month}
        onMonthChange={calendarProps?.onMonthChange}
        numberOfMonths={numberOfMonths}
        rtl={(calendarProps?.dir ?? dir) === 'rtl'}
        renderCalendar={({ month, onMonthChange, components }) => (
          <Calendar
            startMonth={minDate}
            endMonth={maxDate}
            weekStartsOn={weekStartsOn}
            locale={locale}
            numberOfMonths={numberOfMonths}
            showTodayButton
            onTodayClick={(date) => pickDay(startOfDay(date))}
            lastSelection={session.last?.from}
            onLastSelectionClick={() =>
              session.last &&
              update({
                from: session.last.from ?? null,
                to: session.last.to ?? null,
                active: 0,
                fresh: true,
                hovered: undefined,
              })
            }
            // A one-day range (both ends on one day) keeps its rounded corners.
            rangeStartClassName="[&.day-range-end>button]:rounded-e-12"
            rangeEndClassName="[&.day-range-start>button]:rounded-s-12"
            {...calendarProps}
            month={month}
            onMonthChange={onMonthChange}
            formatters={{
              formatCaption: shortCaption(locale),
              ...calendarProps?.formatters,
            }}
            components={{ ...components, ...calendarProps?.components }}
            showYearSwitcher={false}
            mode="range"
            selected={selected}
            // A new range every time: the clicked day is the start, then the
            // end (react-day-picker would extend the current range instead).
            onSelect={(_, day) => pickDay(day)}
            onDayMouseEnter={(day, modifiers, event) => {
              calendarProps?.onDayMouseEnter?.(day, modifiers, event)
              if (
                session.active !== 1 ||
                !session.from ||
                session.to ||
                modifiers.disabled
              ) {
                return
              }
              update({
                hovered: coversDisabled(ordered(session.from, day))
                  ? undefined
                  : day,
              })
            }}
            disabled={matchers}
          />
        )}
      />
    </DatePickerField>
  )
}
DateRangePicker.displayName = 'DateRangePicker'

export { DateRangePicker }
