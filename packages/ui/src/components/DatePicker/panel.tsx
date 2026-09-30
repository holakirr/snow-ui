'use client'

import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import {
  addMonths,
  differenceInCalendarMonths,
  format,
  getDaysInMonth,
  type Locale,
  startOfMonth,
} from 'date-fns'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { CustomComponents } from 'react-day-picker'
import { twMerge } from '../../utils/tw-merge'
import { Button } from '../Button'
import { actionClassName, calendarSurfaceClassName } from '../Calendar/Calendar'
import { useMessages } from '../SnowUIProvider'
import { DateField } from './date-field'
import { type GridOption, OptionGrid } from './grid'
import { type HourCycle, partsOf, type Segment } from './segments'

export type PanelView =
  | 'days'
  | 'months'
  | 'years'
  | 'hours'
  | 'minutes'
  | 'seconds'

/** What the days view (the picker's `Calendar`) gets from the panel. */
export type CalendarViewProps = {
  month: Date
  onMonthChange: (month: Date) => void
  /** A plain root (the panel is the surface) and a caption to the months. */
  components: Partial<CustomComponents>
}

type DatePickerPanelProps = {
  /** One date (`DatePicker`), or the start and the end (`DateRangePicker`). */
  dates: (Date | null)[]
  /** The date the calendar, the time and the months and years edit. */
  active: number
  onActiveChange?: (index: number) => void
  /** A typed date, or one from the months, years or time views. */
  onDateChange: (index: number, date: Date) => void
  isAllowed: (date: Date, index: number) => boolean
  /** The accessible names of the date fields. */
  labels: string[]
  timeLabel: string
  withTime: boolean
  withSeconds: boolean
  hourCycle: HourCycle
  locale: Locale | undefined
  lang: string
  periods: [string, string]
  /** What an empty date shows: today, now. */
  placeholders: Date[]
  today: Date
  minDate?: Date
  maxDate?: Date
  /** Shows "Last selection" in the months, years and time views. */
  hasLastSelection: boolean
  onLastSelection: () => void
  /** Enter in the date field: the calendar closes with the dates. */
  onConfirm: () => void
  /** The month the calendar shows first, and a controlled one. */
  initialMonth: Date
  month?: Date
  onMonthChange?: (month: Date) => void
  numberOfMonths: number
  rtl: boolean
  renderCalendar: (props: CalendarViewProps) => ReactNode
}

const VIEW_OF: Record<Segment, PanelView> = {
  day: 'days',
  month: 'months',
  year: 'years',
  hour: 'hours',
  dayPeriod: 'hours',
  minute: 'minutes',
  second: 'seconds',
}

const SEGMENT_OF: Partial<Record<PanelView, Segment>> = {
  months: 'month',
  years: 'year',
  hours: 'hour',
  minutes: 'minute',
  seconds: 'second',
}

/** The years a years view shows at once, four to a row. */
const YEARS = 12

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * The popup of `DatePicker` and `DateRangePicker`, the Figma DatePicker:
 * the top area (the typed date, the end of a range, the time), then the days
 * (the `Calendar`), or the months, the years or the hours, minutes and
 * seconds, which the top area's segments open and "Back" leaves.
 */
export const DatePickerPanel = ({
  dates,
  active,
  onActiveChange,
  onDateChange,
  isAllowed,
  labels,
  timeLabel,
  withTime,
  withSeconds,
  hourCycle,
  locale,
  lang,
  periods,
  placeholders,
  today,
  minDate,
  maxDate,
  hasLastSelection,
  onLastSelection,
  onConfirm,
  initialMonth,
  month: monthProp,
  onMonthChange,
  numberOfMonths,
  rtl,
  renderCalendar,
}: DatePickerPanelProps) => {
  const messages = useMessages()
  const [view, setView] = useState<PanelView>('days')
  const [innerMonth, setInnerMonth] = useState(() => startOfMonth(initialMonth))
  const month = monthProp ? startOfMonth(monthProp) : innerMonth
  const [yearsFrom, setYearsFrom] = useState(() => today.getFullYear() - 5)
  const body = useRef<HTMLDivElement>(null)
  // Focus the new view's tab stop once it is rendered.
  const focusView = useRef(false)

  useLayoutEffect(() => {
    if (!focusView.current) return
    focusView.current = false
    body.current
      ?.querySelector<HTMLElement>('[role="grid"] button[tabindex="0"]')
      ?.focus()
  })

  const activeDate = dates[active] ?? null
  const width = 344 * numberOfMonths + 16

  const goToMonth = (date: Date) => {
    const next = startOfMonth(date)
    if (!monthProp) setInnerMonth(next)
    onMonthChange?.(next)
  }

  const showDate = (date: Date) => {
    const offset = differenceInCalendarMonths(date, month)
    if (offset < 0 || offset >= numberOfMonths) goToMonth(date)
  }

  const pageOf = (year: number) =>
    yearsFrom + Math.floor((year - yearsFrom) / YEARS) * YEARS

  const switchView = (next: PanelView, focus: boolean) => {
    if (next === 'years') setYearsFrom(pageOf(month.getFullYear()))
    focusView.current = focus
    setView(next)
  }

  const change = (index: number, date: Date) => {
    if (!isAllowed(date, index)) return false
    onDateChange(index, date)
    if (index === active) showDate(date)
    return true
  }

  /** A month or a year for the active date (the day kept in the month). */
  const pickMonth = (year: number, monthIndex: number) => {
    if (activeDate) {
      const next = new Date(activeDate)
      next.setFullYear(
        year,
        monthIndex,
        Math.min(
          activeDate.getDate(),
          getDaysInMonth(new Date(year, monthIndex, 1)),
        ),
      )
      change(active, next)
    }
    goToMonth(new Date(year, monthIndex, 1))
    switchView('days', true)
  }

  /** A time for the active date (or today, while it is empty). */
  const pickTime = (set: (date: Date) => void) => {
    const next = new Date(activeDate ?? (placeholders[active] as Date))
    set(next)
    if (!withSeconds) next.setSeconds(0, 0)
    change(active, next)
  }

  const activeParts = activeDate ? partsOf(activeDate) : null
  const placeholderParts = partsOf(placeholders[active] as Date)
  const hour24 = (activeParts ?? placeholderParts).hour
  const pm = hour24 >= 12
  const now = new Date()

  const toolbar = (actions: ReactNode, nav?: ReactNode) => (
    <div className="flex h-7 items-center justify-between gap-2 text-12">
      <div className="flex items-center gap-2">
        {actions}
        {hasLastSelection && (
          <button
            type="button"
            className={actionClassName}
            onClick={onLastSelection}
          >
            {messages.calendar.lastSelection}
          </button>
        )}
      </div>
      {nav}
    </div>
  )

  const chip = (label: string, onClick: () => void) => (
    <button type="button" className={actionClassName} onClick={onClick}>
      {label}
    </button>
  )

  const arrows = (
    previous: { label: string; onClick: () => void; disabled?: boolean },
    next: { label: string; onClick: () => void; disabled?: boolean },
    label?: ReactNode,
  ) => (
    <nav
      aria-label={messages.calendar.navigation}
      className="ms-auto flex items-center gap-2"
    >
      <Button
        variant="borderless"
        size="sm"
        disabled={previous.disabled}
        aria-label={previous.label}
        onClick={previous.onClick}
        startContent={
          <ArrowLineLeftIcon size={16} className="rtl:-scale-x-100" />
        }
      />
      {label}
      <Button
        variant="borderless"
        size="sm"
        disabled={next.disabled}
        aria-label={next.label}
        onClick={next.onClick}
        startContent={
          <ArrowLineRightIcon size={16} className="rtl:-scale-x-100" />
        }
      />
    </nav>
  )

  const back = (
    <div className="mt-auto flex justify-end">
      <Button
        variant="bare"
        size="sm"
        label={messages.datePicker.back}
        startContent={
          <ArrowLineLeftIcon size={16} className="rtl:-scale-x-100" />
        }
        onClick={() => switchView('days', true)}
      />
    </div>
  )

  const yearOutOfRange = (year: number) =>
    Boolean(
      (minDate && year < minDate.getFullYear()) ||
        (maxDate && year > maxDate.getFullYear()),
    )
  const monthOutOfRange = (year: number, monthIndex: number) =>
    Boolean(
      (minDate &&
        new Date(year, monthIndex + 1, 0) <
          new Date(minDate.getFullYear(), minDate.getMonth(), 1)) ||
        (maxDate &&
          new Date(year, monthIndex, 1) >
            new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0)),
    )

  const renderView = () => {
    const shownYear = month.getFullYear()
    if (view === 'months') {
      const options: GridOption[] = Array.from({ length: 12 }, (_, m) => {
        const date = new Date(shownYear, m, 1)
        return {
          value: m,
          label: format(date, 'LLL', { locale }),
          ariaLabel: format(date, 'LLLL y', { locale }),
          selected:
            activeDate?.getFullYear() === shownYear &&
            activeDate.getMonth() === m,
          current: today.getFullYear() === shownYear && today.getMonth() === m,
          disabled: monthOutOfRange(shownYear, m),
        }
      })
      return (
        <>
          {toolbar(
            chip(messages.datePicker.thisMonth, () =>
              pickMonth(today.getFullYear(), today.getMonth()),
            ),
            arrows(
              {
                label: messages.datePicker.previousYear,
                disabled: yearOutOfRange(shownYear - 1),
                onClick: () => goToMonth(addMonths(month, -12)),
              },
              {
                label: messages.datePicker.nextYear,
                disabled: yearOutOfRange(shownYear + 1),
                onClick: () => goToMonth(addMonths(month, 12)),
              },
              <button
                type="button"
                aria-label={messages.datePicker.chooseYear(String(shownYear))}
                className="h-7 rounded-8 px-1 transition-colors hover:bg-black-4 focus-ring"
                onClick={() => switchView('years', true)}
              >
                {shownYear}
              </button>,
            ),
          )}
          <OptionGrid
            label={String(shownYear)}
            options={options}
            columns={4}
            rtl={rtl}
            onSelect={(m) => pickMonth(shownYear, m)}
            onPage={(delta) => goToMonth(addMonths(month, delta * 12))}
          />
        </>
      )
    }
    if (view === 'years') {
      const years = Array.from({ length: YEARS }, (_, i) => yearsFrom + i)
      const options: GridOption[] = years.map((year) => ({
        value: year,
        label: String(year),
        selected: (activeDate ?? month).getFullYear() === year,
        current: today.getFullYear() === year,
        disabled: yearOutOfRange(year),
      }))
      const page = (delta: -1 | 1) =>
        setYearsFrom((from) => from + delta * YEARS)
      const pickYear = (year: number) =>
        pickMonth(year, (activeDate ?? month).getMonth())
      return (
        <>
          {toolbar(
            chip(messages.datePicker.thisYear, () =>
              pickYear(today.getFullYear()),
            ),
            arrows(
              {
                label: messages.calendar.previousYears(YEARS),
                disabled: yearOutOfRange(yearsFrom - 1),
                onClick: () => page(-1),
              },
              {
                label: messages.calendar.nextYears(YEARS),
                disabled: yearOutOfRange(yearsFrom + YEARS),
                onClick: () => page(1),
              },
            ),
          )}
          <OptionGrid
            label={`${yearsFrom} – ${yearsFrom + YEARS - 1}`}
            options={options}
            columns={4}
            rtl={rtl}
            onSelect={pickYear}
            onPage={page}
          />
        </>
      )
    }
    // The time views: hours, then minutes (then seconds).
    const segment = SEGMENT_OF[view] as 'hour' | 'minute' | 'second'
    const values =
      segment === 'hour'
        ? hourCycle === 12
          ? Array.from({ length: 12 }, (_, i) => i + 1)
          : Array.from({ length: 24 }, (_, i) => i)
        : Array.from({ length: 60 }, (_, i) => i)
    const displayed = (date: Date) =>
      segment === 'hour'
        ? hourCycle === 12
          ? date.getHours() % 12 || 12
          : date.getHours()
        : segment === 'minute'
          ? date.getMinutes()
          : date.getSeconds()
    const options: GridOption[] = values.map((value) => ({
      value,
      label: pad(value),
      selected: activeDate ? displayed(activeDate) === value : false,
      current:
        displayed(now) === value &&
        (segment !== 'hour' || hourCycle === 24 || now.getHours() >= 12 === pm),
    }))
    const pick = (value: number) => {
      pickTime((date) => {
        if (segment === 'hour') {
          date.setHours(hourCycle === 12 ? (value % 12) + (pm ? 12 : 0) : value)
        } else if (segment === 'minute') date.setMinutes(value)
        else date.setSeconds(value)
      })
      if (segment === 'hour') switchView('minutes', true)
      else if (segment === 'minute' && withSeconds) switchView('seconds', true)
    }
    return (
      <>
        {toolbar(
          chip(messages.datePicker.systemTime, () =>
            pickTime((date) => {
              const current = new Date()
              date.setHours(
                current.getHours(),
                current.getMinutes(),
                current.getSeconds(),
                0,
              )
            }),
          ),
          hourCycle === 12 && (
            // biome-ignore lint/a11y/useSemanticElements: two toggle buttons, as a segmented control
            <div
              role="group"
              aria-label={messages.datePicker.dayPeriod}
              className="ms-auto flex items-center gap-1"
            >
              {periods.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={pm === (index === 1)}
                  className={twMerge(
                    actionClassName,
                    'bg-transparent aria-pressed:bg-black-4',
                  )}
                  onClick={() =>
                    pickTime((date) =>
                      date.setHours((date.getHours() % 12) + index * 12),
                    )
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          ),
        )}
        <TimeScroller>
          <OptionGrid
            label={messages.datePicker[segment]}
            options={options}
            columns={6}
            currentKind="time"
            rtl={rtl}
            onSelect={pick}
          />
        </TimeScroller>
      </>
    )
  }

  return (
    <OpenMonths.Provider value={() => switchView('months', true)}>
      <div
        data-slot="date-picker-panel"
        className={twMerge(calendarSurfaceClassName, 'flex flex-col')}
      >
        <DateField
          dates={dates}
          placeholders={placeholders}
          active={active}
          onActiveChange={onActiveChange}
          onDateChange={(index, date) => {
            onDateChange(index, date)
            if (index === active) showDate(date)
          }}
          isAllowed={isAllowed}
          labels={labels}
          timeLabel={timeLabel}
          withTime={withTime}
          withSeconds={withSeconds}
          hourCycle={hourCycle}
          lang={lang}
          periods={periods}
          viewSegment={SEGMENT_OF[view]}
          onSegmentPointer={(index, segment) => {
            if (index !== active) onActiveChange?.(index)
            const date = dates[index]
            if (date) showDate(date)
            switchView(VIEW_OF[segment], false)
          }}
          onBlankPointer={() => switchView('days', false)}
          onEnter={onConfirm}
          rtl={rtl}
        />
        <div ref={body} data-slot="date-picker-view" data-view={view}>
          {view === 'days' ? (
            renderCalendar({
              month,
              onMonthChange: goToMonth,
              components: { Root: PlainRoot, CaptionLabel },
            })
          ) : (
            <div
              key={view}
              className="flex min-h-[304px] flex-col gap-4 p-4"
              style={{ width }}
            >
              {renderView()}
              {back}
            </div>
          )}
        </div>
      </div>
    </OpenMonths.Provider>
  )
}

/** Opens the months view: the days view's caption. */
const OpenMonths = createContext<() => void>(() => {})

/** The shown month ("Feb"): a button to the months view. */
const CaptionLabel: CustomComponents['CaptionLabel'] = ({
  children,
  className,
}) => {
  const messages = useMessages()
  const openMonths = useContext(OpenMonths)
  return (
    <button
      type="button"
      aria-label={messages.datePicker.chooseMonth(String(children))}
      className={twMerge(
        'h-7 rounded-8 px-1 transition-colors hover:bg-black-4 focus-ring',
        className,
      )}
      onClick={openMonths}
    >
      {children}
    </button>
  )
}

/** The calendar's root without the surface, which the panel draws. */
const PlainRoot: CustomComponents['Root'] = ({
  rootRef,
  className,
  ...props
}) => <div ref={rootRef} className={twMerge('w-fit', className)} {...props} />

/** Minutes and seconds scroll, like the Figma "Choose minutes" frame. */
const TimeScroller = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  // The picked value in view.
  useEffect(() => {
    ref.current
      ?.querySelector<HTMLElement>('[data-selected]')
      ?.scrollIntoView?.({ block: 'nearest' })
  }, [])
  return (
    <div ref={ref} className="max-h-[228px] overflow-y-auto">
      {children}
    </div>
  )
}
