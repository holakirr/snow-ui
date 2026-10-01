'use client'

import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  currentUnselectedClassName,
  selectedForcedClassName,
  todayMarkClassName,
  todayMarkShownClassName,
} from '../Calendar/styles'

/** A choice of a picker grid: a month, a year, an hour, a minute… */
export type GridOption = {
  value: number
  /** The cell text, e.g. "Feb" or "04". */
  label: string
  /** The accessible name when the text isn't enough, e.g. "February 2026". */
  ariaLabel?: string
  selected?: boolean
  /** Now: this month or year, the system time; indigo like today. */
  current?: boolean
  disabled?: boolean
}

type OptionGridProps = {
  /** The grid's accessible name. */
  label: string
  options: GridOption[]
  columns: number
  onSelect: (value: number) => void
  /**
   * Called by the arrow keys past the first or last row and by PageUp /
   * PageDown, e.g. to page the years; the focus stays in the same column.
   * Returns `false` when there is no page there (past `minDate` or
   * `maxDate`): the focus stays.
   */
  onPage?: (delta: -1 | 1) => boolean
  /** `aria-current` of the current option. */
  currentKind?: 'date' | 'time'
  rtl?: boolean
  className?: string
}

/**
 * Day-like cells: 38px high, radius 12, 12 Regular, Black/4% on hover; the
 * selected one is Primary and the current one Secondary/Indigo, as the
 * Calendar days.
 */
const cellClassName =
  'h-[38px] w-full rounded-12 text-12 text-black tabular-nums transition-colors hover:bg-black-4 focus-ring focus-visible:relative focus-visible:z-10 disabled:text-black-20 disabled:hover:bg-transparent'

/**
 * The months, years and time grids of the date pickers: an APG grid with
 * one tab stop (roving tabindex) that the arrow keys move, Home / End to
 * the row's ends (with Ctrl or ⌘ to the grid's), Enter or Space to pick.
 */
export const OptionGrid = ({
  label,
  options,
  columns,
  onSelect,
  onPage,
  currentKind = 'date',
  rtl = false,
  className,
}: OptionGridProps) => {
  const [focused, setFocused] = useState<number>()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  // An index to focus once it is rendered (after paging).
  const pendingFocus = useRef<number>(undefined)

  useEffect(() => {
    if (pendingFocus.current === undefined) return
    const index = Math.min(pendingFocus.current, options.length - 1)
    pendingFocus.current = undefined
    const button = buttons.current[index]
    if (!button) return
    button.focus()
    setFocused(options[index]?.value)
  })

  const enabled = (index: number) =>
    options[index] !== undefined && !options[index]?.disabled
  const indexOf = (value: number | undefined) =>
    options.findIndex((option) => option.value === value)
  // The tab stop: the last focused option, else the selected one, else the
  // current one, else the first that can be picked.
  const tabStop =
    [
      indexOf(focused),
      options.findIndex((option) => option.selected),
      options.findIndex((option) => option.current),
    ].find((index) => index >= 0 && enabled(index)) ??
    options.findIndex((option) => !option.disabled)

  const focusIndex = (index: number) => {
    if (!enabled(index)) return
    setFocused(options[index]?.value)
    buttons.current[index]?.focus()
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    // Alt and Shift combinations, and Ctrl / ⌘ with anything but Home and
    // End, stay the browser's.
    if (event.altKey || event.shiftKey) return
    const ctrl = event.ctrlKey || event.metaKey
    if (ctrl && event.key !== 'Home' && event.key !== 'End') return
    const forward = rtl ? -1 : 1
    const rowStart = index - (index % columns)
    const rowEnd = Math.min(rowStart + columns, options.length) - 1
    const targets: Record<string, number> = {
      ArrowRight: index + forward,
      ArrowLeft: index - forward,
      ArrowDown: index + columns,
      ArrowUp: index - columns,
      Home: ctrl ? 0 : rowStart,
      End: ctrl ? options.length - 1 : rowEnd,
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      if (!onPage) return
      event.preventDefault()
      if (onPage(event.key === 'PageUp' ? -1 : 1)) pendingFocus.current = index
      return
    }
    const target = targets[event.key]
    if (target === undefined) return
    event.preventDefault()
    if (target < 0 || target >= options.length) {
      // Past the first or last row: the previous or next page, same column.
      if (!onPage || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) {
        return
      }
      if (onPage(target < 0 ? -1 : 1)) {
        pendingFocus.current =
          target < 0 ? target + options.length : target - options.length
      }
      return
    }
    focusIndex(target)
  }

  const rows = Array.from(
    { length: Math.ceil(options.length / columns) },
    (_, row) => options.slice(row * columns, (row + 1) * columns),
  )

  // <div>s with the grid roles, laid out as CSS grid rows.
  // biome-ignore-start lint/a11y/useSemanticElements: ARIA grid roles on a CSS grid layout
  // biome-ignore-start lint/a11y/useFocusableInteractive: the buttons in the cells take focus (roving tabIndex)
  return (
    <div
      role="grid"
      aria-label={label}
      className={twMerge('flex flex-col', className)}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={row[0]?.value}
          role="row"
          className="grid"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {row.map((option, column) => {
            const index = rowIndex * columns + column
            return (
              <div
                key={option.value}
                role="gridcell"
                aria-selected={option.selected ?? false}
                aria-current={option.current ? currentKind : undefined}
              >
                <button
                  ref={(node) => {
                    buttons.current[index] = node
                  }}
                  type="button"
                  tabIndex={index === tabStop ? 0 : -1}
                  aria-label={option.ariaLabel}
                  disabled={option.disabled}
                  data-selected={option.selected || undefined}
                  className={twMerge(
                    cellClassName,
                    option.selected &&
                      twMerge(
                        'bg-primary text-white hover:bg-primary-hover',
                        selectedForcedClassName,
                      ),
                    option.current &&
                      !option.selected &&
                      currentUnselectedClassName,
                    option.current && todayMarkClassName,
                    option.current &&
                      option.selected &&
                      todayMarkShownClassName,
                  )}
                  onClick={() => onSelect(option.value)}
                  onFocus={() => setFocused(option.value)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  {option.label}
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
  // biome-ignore-end lint/a11y/useFocusableInteractive: the buttons in the cells take focus (roving tabIndex)
  // biome-ignore-end lint/a11y/useSemanticElements: ARIA grid roles on a CSS grid layout
}
