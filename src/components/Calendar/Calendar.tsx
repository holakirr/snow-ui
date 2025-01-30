'use client'

import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { differenceInCalendarDays } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import {
  DayPicker,
  type DayPickerProps,
  labelNext,
  labelPrevious,
  useDayPicker,
} from 'react-day-picker'
import 'react-day-picker/style.css'
import { twMerge } from 'tailwind-merge'
import { Button, buttonVariants } from '../Button'

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

  monthsClassName?: string
  monthCaptionClassName?: string
  weekdaysClassName?: string
  weekdayClassName?: string
  monthClassName?: string
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

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  showWeekNumber,
  yearRange = 12,
  numberOfMonths,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = useState<'days' | 'years'>('days')
  const [displayYears, setDisplayYears] = useState<{
    from: number
    to: number
  }>(
    useMemo(() => {
      const currentYear = new Date().getFullYear()
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      }
    }, [yearRange]),
  )

  const { onNextClick, onPrevClick, startMonth, endMonth } = props

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths

  const _monthsClassName = twMerge('relative flex', props.monthsClassName)
  const _monthCaptionClassName = twMerge(
    'relative flex items-center justify-center',
    props.monthCaptionClassName,
  )
  const _weekdaysClassName = twMerge(
    'grid grid-cols-7 h-[38px] items-center',
    props.weekdaysClassName,
  )
  const _weekdayClassName = twMerge(
    'w-full text-sm font-normal text-muted-foreground',
    props.weekdayClassName,
  )
  const _monthClassName = twMerge('w-full', props.monthClassName)
  const _captionClassName = twMerge(
    'relative flex items-center justify-center pt-1',
    props.captionClassName,
  )
  const _captionLabelClassName = twMerge(
    'truncate text-sm font-medium flex items-center justify-center hover:bg-black/10',
    props.captionLabelClassName,
  )
  const buttonNavClassName = buttonVariants({
    variant: 'outline',
    className:
      'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  })
  const _buttonNextClassName = twMerge(
    buttonNavClassName,
    'right-0',
    props.buttonNextClassName,
  )
  const _buttonPreviousClassName = twMerge(
    buttonNavClassName,
    'left-0',
    props.buttonPreviousClassName,
  )
  const _navClassName = twMerge('flex items-start', props.navClassName)
  const _monthGridClassName = twMerge(
    'mt-4 w-[328px]',
    props.monthGridClassName,
  )
  const _weekClassName = twMerge('grid grid-cols-7', props.weekClassName)
  const _dayClassName = twMerge(
    'flex w-full items-center justify-center p-0 text-sm',
    props.dayClassName,
  )
  const _dayButtonClassName = twMerge(
    buttonVariants(),
    'h-[38px] w-full rounded-xl p-0 font-normal transition-none aria-selected:opacity-100',
    props.dayButtonClassName,
  )
  const buttonRangeClassName =
    'bg-accent [&>button]:bg-black [&>button]:text-white [&>button]:hover:bg-black/80 [&>button]:hover:text-white'
  const _rangeStartClassName = twMerge(
    buttonRangeClassName,
    'day-range-start [&>button]:rounded-r-none',
    props.rangeStartClassName,
  )
  const _rangeEndClassName = twMerge(
    buttonRangeClassName,
    'day-range-end [&>button]:rounded-l-none',
    props.rangeEndClassName,
  )
  const _rangeMiddleClassName = twMerge(
    'bg-black !text-white [&>button]:bg-transparent [&>button]:!text-white [&>button]:hover:bg-black/80 [&>button]:hover:!text-white',
    props.rangeMiddleClassName,
  )
  const _selectedClassName = twMerge(
    '[&>button]:bg-black [&>button]:text-white [&>button]:hover:bg-black/80 [&>button]:hover:text-white',
    props.selectedClassName,
  )
  const _todayClassName = twMerge(
    '[&>button]:bg-indigo [&>button]:text-white [&>button]:hover:text-white [&>button]:hover:bg-indigo/80',
    props.todayClassName,
  )
  const _outsideClassName = twMerge(
    'day-outside text-black/80 opacity-50 aria-selected:bg-accent/50 aria-selected:text-black/80 aria-selected:opacity-30',
    props.outsideClassName,
  )
  const _disabledClassName = twMerge(
    'text-black/80 opacity-50',
    props.disabledClassName,
  )
  const _hiddenClassName = twMerge('invisible flex-1', props.hiddenClassName)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      showWeekNumber={false}
      className={twMerge('p-3', className)}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon =
            orientation === 'left' ? ArrowLineLeftIcon : ArrowLineRightIcon
          return <Icon className="h-4 w-4" />
        },
        Nav: ({ className }) => {
          const { nextMonth, previousMonth, goToMonth } = useDayPicker()

          const isPreviousDisabled = (() => {
            if (navView === 'years') {
              return (
                (startMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.from - 1, 0, 1),
                    startMonth,
                  ) < 0) ||
                (endMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.from - 1, 0, 1),
                    endMonth,
                  ) > 0)
              )
            }
            return !previousMonth
          })()

          const isNextDisabled = (() => {
            if (navView === 'years') {
              return (
                (startMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.to + 1, 0, 1),
                    startMonth,
                  ) < 0) ||
                (endMonth &&
                  differenceInCalendarDays(
                    new Date(displayYears.to + 1, 0, 1),
                    endMonth,
                  ) > 0)
              )
            }
            return !nextMonth
          })()

          const handlePreviousClick = useCallback(() => {
            if (!previousMonth) return
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
            goToMonth(previousMonth)
            onPrevClick?.(previousMonth)
          }, [previousMonth, goToMonth])

          const handleNextClick = useCallback(() => {
            if (!nextMonth) return
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
            goToMonth(nextMonth)
            onNextClick?.(nextMonth)
          }, [goToMonth, nextMonth])
          return (
            <nav className={twMerge('flex items-center', className)}>
              <Button
                variant="outline"
                className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isPreviousDisabled ? undefined : -1}
                disabled={isPreviousDisabled}
                aria-label={
                  navView === 'years'
                    ? `Go to the previous ${
                        displayYears.to - displayYears.from + 1
                      } years`
                    : labelPrevious(previousMonth)
                }
                onClick={handlePreviousClick}
              >
                <ArrowLineLeftIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isNextDisabled ? undefined : -1}
                disabled={isNextDisabled}
                aria-label={
                  navView === 'years'
                    ? `Go to the next ${
                        displayYears.to - displayYears.from + 1
                      } years`
                    : labelNext(nextMonth)
                }
                onClick={handleNextClick}
              >
                <ArrowLineRightIcon className="h-4 w-4" />
              </Button>
            </nav>
          )
        },
        CaptionLabel: ({ children, ...props }) => {
          if (!showYearSwitcher) return <span {...props}>{children}</span>
          return (
            <Button
              className="h-7 w-full truncate text-sm font-medium"
              size="sm"
              onClick={() =>
                setNavView((prev) => (prev === 'days' ? 'years' : 'days'))
              }
            >
              {navView === 'days'
                ? children
                : `${displayYears.from} - ${displayYears.to}`}
            </Button>
          )
        },
        MonthGrid: ({ className, children, ...props }) => {
          const { goToMonth, selected } = useDayPicker()
          if (navView === 'years') {
            return (
              <div
                className={twMerge('grid grid-cols-4 gap-y-2', className)}
                {...props}
              >
                {Array.from(
                  { length: displayYears.to - displayYears.from + 1 },
                  (_, i) => {
                    const isBefore =
                      differenceInCalendarDays(
                        new Date(displayYears.from + i, 11, 31),
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        startMonth!,
                      ) < 0

                    const isAfter =
                      differenceInCalendarDays(
                        new Date(displayYears.from + i, 0, 0),
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        endMonth!,
                      ) > 0

                    const isDisabled = isBefore || isAfter
                    return (
                      <Button
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        key={i}
                        className={twMerge(
                          'h-7 w-full text-sm font-normal text-foreground',
                          displayYears.from + i === new Date().getFullYear() &&
                            'bg-accent font-medium text-accent-foreground',
                        )}
                        variant="outline"
                        onClick={() => {
                          setNavView('days')
                          goToMonth(
                            new Date(
                              displayYears.from + i,
                              (selected as Date | undefined)?.getMonth() ?? 0,
                            ),
                          )
                        }}
                        disabled={navView === 'years' ? isDisabled : undefined}
                      >
                        {displayYears.from + i}
                      </Button>
                    )
                  },
                )}
              </div>
            )
          }
          return (
            <table className={className} {...props}>
              {children}
            </table>
          )
        },
        Root: ({ className, ...props }) => (
          <div className={twMerge(className, 'p-4 rounded-2xl')} {...props} />
        ),
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
