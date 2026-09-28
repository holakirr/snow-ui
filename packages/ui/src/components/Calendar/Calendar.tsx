'use client'

import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { differenceInCalendarDays } from 'date-fns'
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react'
import {
  type ChevronProps,
  type ClassNames,
  type CustomComponents,
  DayPicker,
  type DayPickerProps,
  useDayPicker,
} from 'react-day-picker'
import { twMerge } from '../../utils/tw-merge'

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
   * The first day of the week: 0 for Sunday, 1 for Monday. The Figma
   * DatePicker starts on Monday. It wins over the `locale`'s week start.
   * @default 1
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
  /** @default 'Today' */
  todayLabel?: string
  /** @default 'Last selection' */
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
  navLabel: string
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

const isYearOutOfRange = (
  date: Date,
  startMonth?: Date,
  endMonth?: Date,
): boolean =>
  Boolean(
    (startMonth && differenceInCalendarDays(date, startMonth) < 0) ||
      (endMonth && differenceInCalendarDays(date, endMonth) > 0),
  )

const CalendarChevron = ({ orientation }: ChevronProps) => {
  const Icon = orientation === 'left' ? ArrowLineLeftIcon : ArrowLineRightIcon
  return <Icon size={20} />
}

// Figma: Button Small "Borderless" icon buttons, 28×28, radius 8.
const navButtonClassName =
  'inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-8 text-black transition-colors hover:bg-black-4 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-focus disabled:cursor-not-allowed disabled:text-black-20 disabled:hover:bg-transparent'

// Figma: "Today" / "Last selection" tags, Black/4%, padding 2/4, radius 8.
const actionClassName =
  'inline-flex h-5 cursor-pointer items-center rounded-8 bg-black-4 px-1 text-12 text-black transition-colors hover:bg-black-10 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-focus'

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

  const yearsCount = displayYears.to - displayYears.from + 1

  const isPreviousDisabled =
    navView === 'years'
      ? isYearOutOfRange(
          new Date(displayYears.from - 1, 0, 1),
          startMonth,
          endMonth,
        )
      : !previousMonth

  const isNextDisabled =
    navView === 'years'
      ? isYearOutOfRange(
          new Date(displayYears.to + 1, 0, 1),
          startMonth,
          endMonth,
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
          ? `Go to the previous ${yearsCount} years`
          : labels.labelPrevious(previousMonth),
      onClick: handlePreviousClick,
    },
    next: {
      disabled: isNextDisabled,
      label:
        navView === 'years'
          ? `Go to the next ${yearsCount} years`
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
    navLabel,
    navClassName,
    buttonPreviousClassName,
    buttonNextClassName,
  } = useCalendarContext()
  const { previous, next } = useCalendarNav()
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
        className={twMerge('ml-auto flex items-center gap-2', navClassName)}
      >
        {showPrevious && (
          <button
            type="button"
            className={twMerge(navButtonClassName, buttonPreviousClassName)}
            disabled={previous.disabled}
            aria-label={previous.label}
            onClick={previous.onClick}
          >
            <ArrowLineLeftIcon size={20} />
          </button>
        )}
        {children}
        {showNext && (
          <button
            type="button"
            className={twMerge(navButtonClassName, buttonNextClassName)}
            disabled={next.disabled}
            aria-label={next.label}
            onClick={next.onClick}
          >
            <ArrowLineRightIcon size={20} />
          </button>
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
  const { navView, setNavView, displayYears, showYearSwitcher } =
    useCalendarContext()

  if (!showYearSwitcher) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={twMerge(
        'h-7 cursor-pointer rounded-8 px-1 transition-colors hover:bg-black-4 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-focus',
        className,
      )}
      onClick={() => setNavView((prev) => (prev === 'days' ? 'years' : 'days'))}
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
  const { navView, setNavView, displayYears, startMonth, endMonth } =
    useCalendarContext()
  const { goToMonth, selected } = useDayPicker()

  if (navView !== 'years') {
    return (
      <table className={className} {...props}>
        {children}
      </table>
    )
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className={twMerge('grid grid-cols-4 gap-y-2', className)} {...props}>
      {Array.from(
        { length: displayYears.to - displayYears.from + 1 },
        (_, i) => {
          const year = displayYears.from + i
          const isBefore = Boolean(
            startMonth &&
              differenceInCalendarDays(new Date(year, 11, 31), startMonth) < 0,
          )
          const isAfter = Boolean(
            endMonth &&
              differenceInCalendarDays(new Date(year, 0, 0), endMonth) > 0,
          )

          return (
            <button
              type="button"
              key={year}
              className={twMerge(
                'h-10 w-full cursor-pointer rounded-12 text-12 text-black transition-colors hover:bg-black-4 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-focus disabled:cursor-not-allowed disabled:text-black-20 disabled:hover:bg-transparent',
                year === currentYear && 'bg-black-4',
              )}
              onClick={() => {
                setNavView('days')
                goToMonth(new Date(year, getSelectedMonth(selected)))
              }}
              disabled={isBefore || isAfter}
            >
              {year}
            </button>
          )
        },
      )}
    </div>
  )
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
      className={twMerge(
        'w-fit rounded-16 text-black glass-2 inset-ring inset-ring-surface-1',
        className,
      )}
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
 * Secondary/Indigo and days outside the month are Black/40%.
 *
 * The previous / next buttons sit in one navigation landmark labelled
 * "Month navigation"; translate it with `labels={{ labelNav: () => '…' }}`.
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  showWeekNumber,
  yearRange = 12,
  numberOfMonths,
  weekStartsOn = 1,
  header,
  showTodayButton = false,
  onTodayClick,
  lastSelection,
  onLastSelectionClick,
  todayLabel = 'Today',
  lastSelectionLabel = 'Last selection',
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
  const [navView, setNavView] = useState<NavView>('days')
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
  // "Selected state"; ranges are one Primary band with rounded ends.
  const selectedButton =
    '[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary-hover'

  return (
    <CalendarContext.Provider
      value={{
        navView,
        setNavView,
        displayYears,
        setDisplayYears,
        showYearSwitcher,
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
        todayLabel,
        lastSelectionLabel,
        header,
        navLabel: props.labels?.labelNav?.() ?? 'Month navigation',
        navClassName,
        buttonPreviousClassName,
        buttonNextClassName,
      }}
    >
      <DayPicker
        showOutsideDays={showOutsideDays}
        showWeekNumber={showWeekNumber}
        weekStartsOn={weekStartsOn}
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
              'truncate text-12 font-normal',
              captionLabelClassName,
            ),
            month_grid: twMerge('mt-4 w-[328px]', monthGridClassName),
            weekdays: twMerge(
              'grid grid-cols-7 h-[38px] items-center',
              weekdaysClassName,
            ),
            weekday: twMerge(
              'w-full text-12 font-normal text-black-40',
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
              'h-[38px] w-full cursor-pointer rounded-12 p-0 font-normal text-inherit transition-colors hover:bg-black-4 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-focus disabled:cursor-not-allowed disabled:hover:bg-transparent',
              dayButtonClassName,
            ),
            selected: twMerge(selectedButton, selectedClassName),
            range_start: twMerge(
              selectedButton,
              'day-range-start [&>button]:rounded-r-none',
              rangeStartClassName,
            ),
            range_middle: twMerge(
              selectedButton,
              '[&>button]:rounded-none',
              rangeMiddleClassName,
            ),
            range_end: twMerge(
              selectedButton,
              'day-range-end [&>button]:rounded-l-none',
              rangeEndClassName,
            ),
            // Figma "Today": Secondary/Indigo, unless selected. The text is
            // static black (10:1) instead of Figma's white (2.07:1).
            today: twMerge(
              'not-aria-selected:[&>button]:bg-indigo not-aria-selected:[&>button]:text-static-black not-aria-selected:[&>button]:hover:bg-indigo/80',
              todayClassName,
            ),
            outside: twMerge('day-outside text-black-40', outsideClassName),
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
