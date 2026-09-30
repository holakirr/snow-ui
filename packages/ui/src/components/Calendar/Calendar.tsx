'use client'

import {
  ArrowLineDownIcon,
  ArrowLineLeftIcon,
  ArrowLineRightIcon,
  ArrowLineUpIcon,
} from '@holakirr/snow-ui-icons'
import { differenceInCalendarDays } from 'date-fns'
import {
  type ComponentProps,
  createContext,
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  type ChevronProps,
  type ClassNames,
  type CustomComponents,
  DayPicker,
  type DayPickerProps,
  getDefaultClassNames,
  useDayPicker,
} from 'react-day-picker'
import { resolveWeekStart } from '../../utils/date'
import { twMerge } from '../../utils/tw-merge'
import { Button } from '../Button'
import {
  defaultMessages,
  type Messages,
  useMessages,
  useSnowUI,
} from '../SnowUIProvider'
import { actionClassName, calendarSurfaceClassName } from './styles'

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean

  /**
   * Show the days of the previous and next months in the first and last
   * weeks.
   * @default true for one month, false for several months
   */
  showOutsideDays?: boolean

  /**
   * The first day of the week: 0 for Sunday, 1 for Monday. The Figma
   * DatePicker starts on Monday. Without it, `SnowUIProvider`'s
   * `weekStartsOn` (`'locale'` follows the locale), else Monday.
   * @default 1, or the provider's `weekStartsOn`
   */
  weekStartsOn?: DayPickerProps['weekStartsOn']

  /**
   * Content above the toolbar, e.g. a date input: the Figma DatePicker's
   * top row. It gets padding 16 and a 0.5px Black/10% line below.
   */
  header?: ReactNode

  /**
   * Shows the Figma "Today" action in the toolbar. It shows the current month
   * and calls `onTodayClick`, e.g. to select today.
   * @default false
   */
  showTodayButton?: boolean
  /** Called by the "Today" action with today's date. */
  onTodayClick?: (today: Date) => void
  /**
   * The last confirmed selection. When set, the toolbar shows the Figma
   * "Last selection" action, which shows that date's month and calls
   * `onLastSelectionClick`.
   */
  lastSelection?: Date
  /** Called by the "Last selection" action with `lastSelection`. */
  onLastSelectionClick?: (date: Date) => void
  /** @default messages.calendar.today: "Today" */
  todayLabel?: string
  /** @default messages.calendar.lastSelection: "Last selection" */
  lastSelectionLabel?: string

  monthsClassName?: string
  monthCaptionClassName?: string
  weekdaysClassName?: string
  weekdayClassName?: string
  monthClassName?: string
  /**
   * @deprecated Use `monthCaptionClassName`. react-day-picker has no separate
   * `caption` slot (v9 ignored it, v10 removed it), so this is merged into the
   * month caption.
   */
  captionClassName?: string
  captionLabelClassName?: string
  buttonNextClassName?: string
  buttonPreviousClassName?: string
  navClassName?: string
  monthGridClassName?: string
  weekClassName?: string
  dayClassName?: string
  dayButtonClassName?: string
  rangeStartClassName?: string
  rangeEndClassName?: string
  selectedClassName?: string
  todayClassName?: string
  outsideClassName?: string
  disabledClassName?: string
  rangeMiddleClassName?: string
  hiddenClassName?: string
}

type NavView = 'days' | 'years'

type DisplayYears = {
  from: number
  to: number
}

type CalendarContextValue = {
  navView: NavView
  setNavView: Dispatch<SetStateAction<NavView>>
  displayYears: DisplayYears
  setDisplayYears: Dispatch<SetStateAction<DisplayYears>>
  showYearSwitcher: boolean
  /** The id of the year view, which the year switcher controls. */
  yearViewId: string
  /**
   * Set when a year is picked: the year buttons are gone after the
   * re-render, so the year switcher takes the focus back.
   */
  focusYearSwitcher: RefObject<boolean>
  startMonth?: Date
  endMonth?: Date
  onPrevClick?: (month: Date) => void
  onNextClick?: (month: Date) => void
  hideNavigation?: boolean
  numberOfMonths: number
  today?: Date
  showTodayButton: boolean
  onTodayClick?: (today: Date) => void
  lastSelection?: Date
  onLastSelectionClick?: (date: Date) => void
  todayLabel: string
  lastSelectionLabel: string
  header?: ReactNode
  navClassName?: string
  buttonPreviousClassName?: string
  buttonNextClassName?: string
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

const useCalendarContext = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('Calendar components must be used within a Calendar.')
  }
  return context
}

const getSelectedMonth = (value: unknown): number => {
  if (value instanceof Date) return value.getMonth()
  if (Array.isArray(value) && value[0] instanceof Date) {
    return value[0].getMonth()
  }
  if (
    value &&
    typeof value === 'object' &&
    'from' in value &&
    value.from instanceof Date
  ) {
    return value.from.getMonth()
  }
  return new Date().getMonth()
}

const CHEVRONS = {
  left: ArrowLineLeftIcon,
  right: ArrowLineRightIcon,
  up: ArrowLineUpIcon,
  down: ArrowLineDownIcon,
}

/** The dropdown caption's chevron (react-day-picker's `Chevron`). */
const CalendarChevron = ({ orientation = 'left', className }: ChevronProps) => {
  const Icon = CHEVRONS[orientation]
  return (
    <Icon
      size={16}
      aria-hidden
      className={twMerge(
        'shrink-0',
        // Left / right mean previous / next: mirrored in right-to-left text.
        (orientation === 'left' || orientation === 'right') &&
          'rtl:-scale-x-100',
        className,
      )}
    />
  )
}

/*
 * react-day-picker's own classes for the dropdown caption: its stylesheet
 * lays the native <select> transparently over the label, so these must stay.
 */
const rdpClassNames = getDefaultClassNames()

/** Previous / next buttons; in the year view they page through the years. */
const useCalendarNav = () => {
  const {
    navView,
    displayYears,
    setDisplayYears,
    startMonth,
    endMonth,
    onPrevClick,
    onNextClick,
  } = useCalendarContext()
  const { nextMonth, previousMonth, goToMonth, labels } = useDayPicker()
  const messages = useMessages()

  const yearsCount = displayYears.to - displayYears.from + 1

  // In the year view, the previous years are out of reach when all of them
  // are before `startMonth`, the next ones when all are after `endMonth`:
  // from years past `endMonth` you can still go back.
  const isPreviousDisabled =
    navView === 'years'
      ? Boolean(
          startMonth &&
            differenceInCalendarDays(
              new Date(displayYears.from - 1, 11, 31),
              startMonth,
            ) < 0,
        )
      : !previousMonth

  const isNextDisabled =
    navView === 'years'
      ? Boolean(
          endMonth &&
            differenceInCalendarDays(
              new Date(displayYears.to + 1, 0, 1),
              endMonth,
            ) > 0,
        )
      : !nextMonth

  const handlePreviousClick = useCallback(() => {
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }))
      onPrevClick?.(
        new Date(
          displayYears.from - (displayYears.to - displayYears.from),
          0,
          1,
        ),
      )
      return
    }
    if (!previousMonth) return
    goToMonth(previousMonth)
    onPrevClick?.(previousMonth)
  }, [
    navView,
    previousMonth,
    goToMonth,
    onPrevClick,
    displayYears,
    setDisplayYears,
  ])

  const handleNextClick = useCallback(() => {
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }))
      onNextClick?.(
        new Date(
          displayYears.from + (displayYears.to - displayYears.from),
          0,
          1,
        ),
      )
      return
    }
    if (!nextMonth) return
    goToMonth(nextMonth)
    onNextClick?.(nextMonth)
  }, [
    navView,
    nextMonth,
    goToMonth,
    onNextClick,
    displayYears,
    setDisplayYears,
  ])

  return {
    previous: {
      disabled: isPreviousDisabled,
      label:
        navView === 'years'
          ? messages.calendar.previousYears(yearsCount)
          : labels.labelPrevious(previousMonth),
      onClick: handlePreviousClick,
    },
    next: {
      disabled: isNextDisabled,
      label:
        navView === 'years'
          ? messages.calendar.nextYears(yearsCount)
          : labels.labelNext(nextMonth),
      onClick: handleNextClick,
    },
  }
}

/** The Figma toolbar actions: "Today" and "Last selection". */
const CalendarActions = () => {
  const {
    setNavView,
    today,
    showTodayButton,
    onTodayClick,
    lastSelection,
    onLastSelectionClick,
    todayLabel,
    lastSelectionLabel,
  } = useCalendarContext()
  const { goToMonth } = useDayPicker()

  if (!showTodayButton && !lastSelection) return null

  const show = (date: Date) => {
    setNavView('days')
    goToMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

  return (
    <div className="flex items-center gap-2">
      {showTodayButton && (
        <button
          type="button"
          className={actionClassName}
          onClick={() => {
            const date = today ?? new Date()
            show(date)
            onTodayClick?.(date)
          }}
        >
          {todayLabel}
        </button>
      )}
      {lastSelection && (
        <button
          type="button"
          className={actionClassName}
          onClick={() => {
            show(lastSelection)
            onLastSelectionClick?.(lastSelection)
          }}
        >
          {lastSelectionLabel}
        </button>
      )}
    </div>
  )
}

/**
 * The Figma toolbar: the actions on the left, "‹ month ›" on the right. The
 * navigation lives here instead of react-day-picker's `Nav`.
 */
const CalendarMonthCaption: CustomComponents['MonthCaption'] = ({
  calendarMonth: _calendarMonth,
  displayIndex,
  className,
  children,
  ...props
}) => {
  const {
    hideNavigation,
    numberOfMonths,
    navClassName,
    buttonPreviousClassName,
    buttonNextClassName,
  } = useCalendarContext()
  const { previous, next } = useCalendarNav()
  const navLabel = useDayPicker().labels.labelNav()
  const showPrevious = !hideNavigation && displayIndex === 0
  const showNext = !hideNavigation && displayIndex === numberOfMonths - 1
  // One navigation landmark: the first caption's nav holds Previous (and Next
  // for a single month); later captions render Next without a landmark.
  const Group = showPrevious ? 'nav' : 'div'

  return (
    <div data-slot="calendar-caption" className={className} {...props}>
      {displayIndex === 0 && <CalendarActions />}
      <Group
        aria-label={showPrevious ? navLabel : undefined}
        className={twMerge('ms-auto flex items-center gap-2', navClassName)}
      >
        {/* Figma: Button Small "Borderless" icon buttons. The arrows point to
            the start / end side, so they flip in right-to-left text. */}
        {showPrevious && (
          <Button
            variant="borderless"
            size="sm"
            className={buttonPreviousClassName}
            disabled={previous.disabled}
            aria-label={previous.label}
            onClick={previous.onClick}
            startContent={
              <ArrowLineLeftIcon size={16} className="rtl:-scale-x-100" />
            }
          />
        )}
        {children}
        {showNext && (
          <Button
            variant="borderless"
            size="sm"
            className={buttonNextClassName}
            disabled={next.disabled}
            aria-label={next.label}
            onClick={next.onClick}
            startContent={
              <ArrowLineRightIcon size={16} className="rtl:-scale-x-100" />
            }
          />
        )}
      </Group>
    </div>
  )
}

const CalendarCaptionLabel: CustomComponents['CaptionLabel'] = ({
  children,
  className,
  ...props
}) => {
  const {
    navView,
    setNavView,
    displayYears,
    setDisplayYears,
    showYearSwitcher,
    yearViewId,
    focusYearSwitcher,
  } = useCalendarContext()
  const { months } = useDayPicker()
  const ref = useRef<HTMLButtonElement>(null)

  // After a year is picked, focus comes back here instead of falling to
  // <body> with the removed year button; and after the switcher toggles the
  // view, as the year view shows one month: a later month's switcher is
  // removed. With several months, the first month's switcher runs its
  // effect first and takes it.
  useEffect(() => {
    if (!focusYearSwitcher.current || !ref.current) return
    focusYearSwitcher.current = false
    ref.current.focus()
  })

  if (!showYearSwitcher) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    )
  }

  // A disclosure: it shows and hides the year view.
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={navView === 'years'}
      aria-controls={navView === 'years' ? yearViewId : undefined}
      className={twMerge(
        'h-7 rounded-8 px-1 transition-colors hover:bg-black-4 focus-ring',
        className,
      )}
      onClick={() => {
        focusYearSwitcher.current = true
        // Open on the page of years that holds the year shown.
        const shown = months[0]?.date.getFullYear()
        if (navView === 'days' && shown !== undefined) {
          setDisplayYears((prev) => {
            const count = prev.to - prev.from + 1
            const pages = Math.floor((shown - prev.from) / count)
            if (pages === 0) return prev
            return {
              from: prev.from + pages * count,
              to: prev.to + pages * count,
            }
          })
        }
        setNavView((prev) => (prev === 'days' ? 'years' : 'days'))
      }}
    >
      {navView === 'days'
        ? children
        : `${displayYears.from} - ${displayYears.to}`}
    </button>
  )
}

const CalendarMonthGrid: CustomComponents['MonthGrid'] = ({
  className,
  children,
  ...props
}) => {
  const { navView } = useCalendarContext()

  if (navView !== 'years') {
    return (
      <table className={className} {...props}>
        {children}
      </table>
    )
  }

  // The day grid's `aria-multiselectable` and month name don't fit the year
  // view, which has its own.
  const {
    role: _role,
    'aria-multiselectable': _multiselectable,
    'aria-label': _monthLabel,
    ...yearViewProps
  } = props

  return <CalendarYearGrid className={className} {...yearViewProps} />
}

/** The years in a row of the year view. */
const YEARS_PER_ROW = 4

/**
 * The year view: an APG grid of the years, four to a row, with one tab stop
 * (roving tabindex) that the arrow keys move. Its value is the year shown
 * in the days view (`aria-selected`); the current year is `aria-current`.
 */
const CalendarYearGrid = ({
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'children'>) => {
  const {
    setNavView,
    displayYears,
    startMonth,
    endMonth,
    yearViewId,
    focusYearSwitcher,
  } = useCalendarContext()
  const { goToMonth, selected, months, dayPickerProps } = useDayPicker()
  const { previous, next } = useCalendarNav()
  const [focusedYear, setFocusedYear] = useState<number>()
  const buttons = useRef(new Map<number, HTMLButtonElement>())
  // A year to focus once it is rendered (after paging).
  const pendingFocus = useRef<number>(undefined)

  useEffect(() => {
    if (pendingFocus.current === undefined) return
    buttons.current.get(pendingFocus.current)?.focus()
    pendingFocus.current = undefined
  })

  const { from, to } = displayYears
  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const isDisabled = (year: number) =>
    Boolean(
      (startMonth &&
        differenceInCalendarDays(new Date(year, 11, 31), startMonth) < 0) ||
        (endMonth &&
          differenceInCalendarDays(new Date(year, 0, 1), endMonth) > 0),
    )
  const isEnabled = (year: number) =>
    year >= from && year <= to && !isDisabled(year)
  const currentYear = new Date().getFullYear()
  const shownYear = months[0]?.date.getFullYear()

  // The tab stop: the last focused year, else the year shown, else the
  // current year, else the first enabled one.
  const tabStop =
    [focusedYear, shownYear, currentYear].find(
      (year): year is number => year !== undefined && isEnabled(year),
    ) ?? years.find((year) => !isDisabled(year))

  const moveTo = (target: number) => {
    // At most to the page before or after (with fewer than four years a
    // row move would skip one).
    const year = Math.min(
      Math.max(target, from - years.length),
      to + years.length,
    )
    if (isDisabled(year)) return
    if (year < from) previous.onClick()
    else if (year > to) next.onClick()
    setFocusedYear(year)
    pendingFocus.current = year
    if (year >= from && year <= to) buttons.current.get(year)?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, year: number) => {
    const forward = dayPickerProps.dir === 'rtl' ? -1 : 1
    const column = (year - from) % YEARS_PER_ROW
    const rowStart = year - column
    const rowEnd = Math.min(rowStart + YEARS_PER_ROW - 1, to)
    const firstIn = (a: number, b: number) =>
      Array.from({ length: b - a + 1 }, (_, i) => a + i).find(isEnabled)
    const lastIn = (a: number, b: number) =>
      Array.from({ length: b - a + 1 }, (_, i) => b - i).find(isEnabled)
    // Alt and Shift combinations, and Ctrl / ⌘ with anything but Home and
    // End, stay the browser's (tabs, history).
    if (event.altKey || event.shiftKey) return
    const ctrl = event.ctrlKey || event.metaKey
    if (ctrl && event.key !== 'Home' && event.key !== 'End') return
    const targets: Record<string, number | undefined> = {
      ArrowRight: year + forward,
      ArrowLeft: year - forward,
      ArrowDown: year + YEARS_PER_ROW,
      ArrowUp: year - YEARS_PER_ROW,
      PageDown: year + years.length,
      PageUp: year - years.length,
      Home: ctrl ? firstIn(from, to) : firstIn(rowStart, rowEnd),
      End: ctrl ? lastIn(from, to) : lastIn(rowStart, rowEnd),
    }
    if (!(event.key in targets)) return
    event.preventDefault()
    const target = targets[event.key]
    if (target !== undefined && target !== year) moveTo(target)
  }

  const rows = Array.from(
    { length: Math.ceil(years.length / YEARS_PER_ROW) },
    (_, row) => years.slice(row * YEARS_PER_ROW, (row + 1) * YEARS_PER_ROW),
  )

  // <div>s with the grid roles, laid out as the Figma four columns.
  // biome-ignore-start lint/a11y/useSemanticElements: ARIA grid roles on a flex / CSS grid layout
  // biome-ignore-start lint/a11y/useFocusableInteractive: the year buttons in the cells take focus (roving tabIndex)
  return (
    <div
      id={yearViewId}
      role="grid"
      aria-label={`${from} - ${to}`}
      className={twMerge('flex flex-col gap-y-2', className)}
      {...props}
    >
      {rows.map((row) => (
        <div key={row[0]} role="row" className="grid grid-cols-4">
          {row.map((year) => (
            <div
              key={year}
              role="gridcell"
              aria-selected={year === shownYear}
              aria-current={year === currentYear ? 'date' : undefined}
            >
              <button
                ref={(node) => {
                  if (node) buttons.current.set(year, node)
                  else buttons.current.delete(year)
                }}
                type="button"
                tabIndex={year === tabStop ? 0 : -1}
                className={twMerge(
                  'h-10 w-full rounded-12 text-12 text-black transition-colors hover:bg-black-4 focus-ring disabled:text-black-20 disabled:hover:bg-transparent',
                  year === currentYear && 'bg-black-4',
                )}
                onClick={() => {
                  focusYearSwitcher.current = true
                  setNavView('days')
                  goToMonth(new Date(year, getSelectedMonth(selected)))
                }}
                onFocus={() => setFocusedYear(year)}
                onKeyDown={(event) => onKeyDown(event, year)}
                disabled={isDisabled(year)}
              >
                {year}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
  // biome-ignore-end lint/a11y/useFocusableInteractive: the year buttons in the cells take focus (roving tabIndex)
  // biome-ignore-end lint/a11y/useSemanticElements: ARIA grid roles on a flex / CSS grid layout
}

/**
 * The Figma DatePicker surface: Background/3 with the "Glass 2" effect, a
 * 1px Surface/1 stroke inside and radius 16. `header` renders above the
 * months.
 */
const CalendarRoot: CustomComponents['Root'] = ({
  className,
  rootRef,
  children,
  ...props
}) => {
  const { header } = useCalendarContext()

  return (
    <div
      ref={rootRef}
      className={twMerge(calendarSurfaceClassName, className)}
      {...props}
    >
      {header && (
        <div
          data-slot="calendar-header"
          className="flex items-center gap-2 border-b-[0.5px] border-black-10 p-4"
        >
          {header}
        </div>
      )}
      {children}
    </div>
  )
}

type DayPickerLabels = NonNullable<DayPickerProps['labels']>

/**
 * The navigation labels from the messages, as react-day-picker `labels`: the
 * landmark and the previous / next month buttons. A translated message wins
 * over a react-day-picker locale's own label, the English default gives way
 * to it, so a date-fns locale gets the messages and `react-day-picker/locale`
 * keeps its translations. The `labels` prop wins over both.
 */
const messageLabels = (
  messages: Messages['calendar'],
  locale: DayPickerProps['locale'],
): DayPickerLabels => {
  const own: Partial<Record<keyof DayPickerLabels, unknown>> =
    locale?.labels ?? {}
  const english = defaultMessages.calendar
  const labels: DayPickerLabels = {}

  if (messages.navigation !== english.navigation || !own.labelNav) {
    labels.labelNav = () => messages.navigation
  }
  if (messages.previousMonth !== english.previousMonth || !own.labelPrevious) {
    labels.labelPrevious = () => messages.previousMonth
  }
  if (messages.nextMonth !== english.nextMonth || !own.labelNext) {
    labels.labelNext = () => messages.nextMonth
  }
  return labels
}

/** Merges the user's `classNames` into the defaults slot by slot. */
const mergeClassNames = (
  defaults: Partial<ClassNames>,
  overrides: Partial<ClassNames> = {},
): Partial<ClassNames> => {
  const merged: Partial<ClassNames> = { ...defaults }
  for (const [slot, value] of Object.entries(overrides) as [
    keyof ClassNames,
    string | undefined,
  ][]) {
    merged[slot] = twMerge(defaults[slot], value)
  }
  return merged
}

/**
 * A calendar built on react-day-picker, styled like the Figma DatePicker:
 * the week starts on Monday, the selected day is Primary, today is
 * Secondary/Indigo with a dot under the number (in dark mode a selected day
 * is indigo too) and days outside the month are `text-secondary` (Figma:
 * Black/40%, 2.85:1).
 *
 * Localized by `SnowUIProvider`: its `locale` (a date-fns or
 * react-day-picker locale) names the months and weekdays; its `weekStartsOn`
 * sets the first day of the week (`'locale'`: the locale's); its `messages`
 * name the toolbar ("Today", "Last selection", the previous / next month
 * buttons and their "Month navigation" landmark; the English defaults of the
 * last three give way to a react-day-picker locale's own labels); its `dir`
 * flips the arrows and the arrow keys. The `locale`, `weekStartsOn`, `dir`,
 * `labels`, `todayLabel` and `lastSelectionLabel` props win over the
 * provider.
 */
function Calendar({
  className,
  showOutsideDays,
  showYearSwitcher = true,
  showWeekNumber,
  yearRange = 12,
  numberOfMonths,
  weekStartsOn,
  header,
  showTodayButton = false,
  onTodayClick,
  lastSelection,
  onLastSelectionClick,
  todayLabel,
  lastSelectionLabel,
  locale: localeProp,
  dir,
  labels,
  hideNavigation,
  classNames,
  components,
  monthsClassName,
  monthCaptionClassName,
  weekdaysClassName,
  weekdayClassName,
  monthClassName,
  captionClassName,
  captionLabelClassName,
  buttonNextClassName,
  buttonPreviousClassName,
  navClassName,
  monthGridClassName,
  weekClassName,
  dayClassName,
  dayButtonClassName,
  rangeStartClassName,
  rangeEndClassName,
  selectedClassName,
  todayClassName,
  outsideClassName,
  disabledClassName,
  rangeMiddleClassName,
  hiddenClassName,
  ...props
}: CalendarProps) {
  const snowUI = useSnowUI()
  const locale = localeProp ?? snowUI.locale
  const [navView, setNavView] = useState<NavView>('days')
  const yearViewId = useId()
  const focusYearSwitcher = useRef(false)
  const [displayYears, setDisplayYears] = useState<DisplayYears>(() => {
    const currentYear = new Date().getFullYear()
    return {
      from: currentYear - Math.floor(yearRange / 2 - 1),
      to: currentYear + Math.ceil(yearRange / 2),
    }
  })

  const { onNextClick, onPrevClick, startMonth, endMonth, today } = props

  const columnsDisplayed = navView === 'years' ? 1 : (numberOfMonths ?? 1)

  // Selected days are Primary (black; indigo in dark mode), like the Figma
  // "Selected state"; ranges are one Primary band with rounded ends. With
  // forced colours, the system Highlight (`selectedForcedClassName`).
  const selectedButton =
    '[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary-hover forced-colors:[&>button]:bg-[Highlight] forced-colors:[&>button]:text-[HighlightText] forced-colors:[&>button]:hover:bg-[Highlight]'

  return (
    <CalendarContext.Provider
      value={{
        navView,
        setNavView,
        displayYears,
        setDisplayYears,
        showYearSwitcher,
        yearViewId,
        focusYearSwitcher,
        startMonth,
        endMonth,
        onPrevClick,
        onNextClick,
        hideNavigation,
        numberOfMonths: columnsDisplayed,
        today,
        showTodayButton,
        onTodayClick,
        lastSelection,
        onLastSelectionClick,
        todayLabel: todayLabel ?? snowUI.messages.calendar.today,
        lastSelectionLabel:
          lastSelectionLabel ?? snowUI.messages.calendar.lastSelection,
        header,
        navClassName,
        buttonPreviousClassName,
        buttonNextClassName,
      }}
    >
      <DayPicker
        // Outside days are shown for one month; with several months they
        // would repeat the neighbouring month's dates.
        showOutsideDays={showOutsideDays ?? columnsDisplayed === 1}
        showWeekNumber={showWeekNumber}
        // Monday unless `weekStartsOn`, or the provider's, says otherwise.
        weekStartsOn={
          weekStartsOn ?? resolveWeekStart(snowUI.weekStartsOn, locale)
        }
        locale={locale}
        dir={dir ?? snowUI.dir}
        labels={{
          ...messageLabels(snowUI.messages.calendar, locale),
          ...labels,
        }}
        className={className}
        classNames={mergeClassNames(
          {
            months: twMerge('relative flex gap-4 p-4', monthsClassName),
            month: twMerge('flex w-full flex-col', monthClassName),
            month_caption: twMerge(
              'flex h-7 items-center justify-between gap-2 text-12',
              captionClassName,
              monthCaptionClassName,
            ),
            caption_label: twMerge(
              'inline-flex items-center gap-1 whitespace-nowrap text-12 font-normal',
              captionLabelClassName,
            ),
            // captionLayout="dropdown": each dropdown is a pointer-cursor chip
            // with a Black/4% hover, like the Figma borderless buttons.
            dropdowns: twMerge(rdpClassNames.dropdowns, 'gap-1'),
            dropdown_root: twMerge(
              rdpClassNames.dropdown_root,
              // The select is transparent, so the chip draws the
              // focus-ring look (ring plus outline) for it.
              'h-7 cursor-pointer rounded-8 px-1 transition-colors hover:bg-black-4 has-focus-visible:ring-4 has-focus-visible:ring-focus has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black-80',
            ),
            dropdown: twMerge(rdpClassNames.dropdown, 'cursor-pointer'),
            // Replaces rdp-chevron, whose accent fill would make it blue.
            chevron: 'fill-current',
            month_grid: twMerge('mt-4 w-[328px]', monthGridClassName),
            weekdays: twMerge(
              'grid grid-cols-7 h-[38px] items-center',
              weekdaysClassName,
            ),
            weekday: twMerge(
              'w-full text-12 font-normal text-secondary',
              weekdayClassName,
            ),
            week: twMerge('grid grid-cols-7', weekClassName),
            day: twMerge(
              'flex w-full items-center justify-center p-0 text-12',
              dayClassName,
            ),
            // Figma: Button Medium "Borderless" days, 38px high, radius 12,
            // 12 Regular, Black/4% on hover.
            day_button: twMerge(
              'h-[38px] w-full rounded-12 p-0 font-normal text-inherit transition-colors hover:bg-black-4 focus-ring focus-visible:relative focus-visible:z-10 disabled:hover:bg-transparent',
              dayButtonClassName,
            ),
            selected: twMerge(selectedButton, selectedClassName),
            range_start: twMerge(
              selectedButton,
              'day-range-start [&>button]:rounded-e-none',
              rangeStartClassName,
            ),
            range_middle: twMerge(
              selectedButton,
              '[&>button]:rounded-none',
              rangeMiddleClassName,
            ),
            range_end: twMerge(
              selectedButton,
              'day-range-end [&>button]:rounded-s-none',
              rangeEndClassName,
            ),
            // Figma "Today": Secondary/Indigo, unless selected. The text is
            // static black (10:1) instead of Figma's white (2.07:1). Plus the
            // dot of `todayMarkClassName`, selected or not: in dark mode a
            // selected day is indigo too.
            today: twMerge(
              'not-aria-selected:[&>button]:bg-indigo not-aria-selected:[&>button]:text-static-black not-aria-selected:[&>button]:hover:bg-indigo/80',
              '[&>button]:relative [&>button]:after:pointer-events-none [&>button]:after:absolute [&>button]:after:inset-x-0 [&>button]:after:bottom-[5px] [&>button]:after:mx-auto [&>button]:after:size-1 [&>button]:after:rounded-full [&>button]:after:bg-current forced-colors:[&>button]:after:forced-color-adjust-none',
              todayClassName,
            ),
            outside: twMerge('day-outside text-secondary', outsideClassName),
            disabled: twMerge('text-black-20', disabledClassName),
            hidden: twMerge('invisible flex-1', hiddenClassName),
            footer: 'px-4 pb-4 text-12 text-black-80',
          },
          classNames,
        )}
        components={{
          Chevron: CalendarChevron,
          MonthCaption: CalendarMonthCaption,
          CaptionLabel: CalendarCaptionLabel,
          MonthGrid: CalendarMonthGrid,
          Root: CalendarRoot,
          ...components,
        }}
        numberOfMonths={columnsDisplayed}
        {...props}
        // The navigation is rendered in the month caption (the Figma toolbar).
        hideNavigation
      />
    </CalendarContext.Provider>
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
