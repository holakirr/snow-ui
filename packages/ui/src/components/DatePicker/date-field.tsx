'use client'

import {
  type FocusEvent,
  Fragment,
  type KeyboardEvent,
  type PointerEvent,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import {
  composeDate,
  type DateParts,
  dayPeriodForKey,
  fieldLayout,
  type HourCycle,
  partsOf,
  type Segment,
  segmentRange,
  segmentText,
  segmentValue,
  setSegment,
  stepSegment,
  typeDigit,
} from './segments'

type EditState = {
  parts: DateParts
  /**
   * The date the parts came from, or the last one they gave: when the date
   * changes to another (a picked day), the field shows it instead.
   */
  base: number | null
  /** The digits typed into `segment` so far. */
  buffer: string
  segment: Segment | null
  /** Complete, but a date that can't be picked (`minDate`…). */
  invalid: boolean
}

const keyOf = (date: Date | null | undefined) => date?.getTime() ?? null

export type DateFieldProps = {
  /** One date (`DatePicker`), or the start and the end (`DateRangePicker`). */
  dates: (Date | null)[]
  /** What an empty date shows, dimmed: today, at the time the calendar opened. */
  placeholders: Date[]
  /** The date the calendar and the time field edit. */
  active: number
  onActiveChange?: (index: number) => void
  /** A typed date that is complete and can be picked. */
  onDateChange: (index: number, date: Date) => void
  isAllowed: (date: Date, index: number) => boolean
  /** The accessible name of each date's group. */
  labels: string[]
  timeLabel: string
  withTime: boolean
  withSeconds: boolean
  hourCycle: HourCycle
  /** The BCP 47 language of the order, the separators and AM / PM. */
  lang: string
  periods: [string, string]
  /** The segment whose view the calendar shows (the months for `month`…). */
  viewSegment?: Segment
  /** A pointer on a segment: its view. */
  onSegmentPointer: (index: number, segment: Segment) => void
  /** A pointer on the rest of the area: the whole field, and the days. */
  onBlankPointer: () => void
  /** Enter: the calendar closes with the date. */
  onEnter: () => void
  rtl: boolean
}

/**
 * The Figma DatePicker's top area: the date ("10 / 22 / 2026", in the
 * locale's order), the end date of a range ("– 10 / 22 / 2026", dimmed while
 * the start is active) and the time ("04 : 08 AM"). As React Aria's
 * DateField, each part is a spinbutton: the arrow keys step it, digits fill
 * it and move on, Backspace empties it, ← / → go to the next part. An empty
 * date shows today, dimmed; editing it starts from today.
 */
export const DateField = ({
  dates,
  placeholders,
  active,
  onActiveChange,
  onDateChange,
  isAllowed,
  labels,
  timeLabel,
  withTime,
  withSeconds,
  hourCycle,
  lang,
  periods,
  viewSegment,
  onSegmentPointer,
  onBlankPointer,
  onEnter,
  rtl,
}: DateFieldProps) => {
  const messages = useMessages().datePicker
  const layout = fieldLayout(lang, hourCycle, withSeconds)
  const container = useRef<HTMLDivElement>(null)
  const [edits, setEdits] = useState<(EditState | null)[]>(() =>
    dates.map(() => null),
  )

  // A date changed from outside (a picked day, a chip): show it.
  if (edits.some((edit, i) => edit && edit.base !== keyOf(dates[i]))) {
    setEdits(
      edits.map((edit, i) =>
        edit && edit.base !== keyOf(dates[i]) ? null : edit,
      ),
    )
  }

  const partsFor = (index: number): DateParts | null => {
    const edit = edits[index]
    if (edit) return edit.parts
    const date = dates[index]
    return date ? partsOf(date) : null
  }

  const segmentsIn = () =>
    Array.from(
      container.current?.querySelectorAll<HTMLElement>('[role="spinbutton"]') ??
        [],
    )

  const focusSibling = (from: HTMLElement, delta: number) => {
    const all = segmentsIn()
    all[all.indexOf(from) + delta]?.focus()
  }

  const update = (
    index: number,
    segment: Segment,
    change: (
      parts: DateParts,
      buffer: string,
    ) => { parts: DateParts; buffer?: string; done?: boolean },
    element: HTMLElement,
  ) => {
    const date = dates[index] ?? null
    const current: EditState = edits[index] ?? {
      // An empty date starts from the placeholder: today.
      parts: partsOf(date ?? (placeholders[index] as Date)),
      base: keyOf(date),
      buffer: '',
      segment: null,
      invalid: false,
    }
    const result = change(
      current.parts,
      current.segment === segment ? current.buffer : '',
    )
    const next: EditState = {
      ...current,
      parts: result.parts,
      buffer: result.buffer ?? '',
      segment,
      invalid: false,
    }
    const composed = composeDate(result.parts, withTime, withSeconds)
    // A year still being typed isn't a date yet.
    const typingYear = segment === 'year' && next.buffer !== ''
    if (composed && !typingYear && keyOf(composed) !== current.base) {
      if (isAllowed(composed, index)) {
        next.base = keyOf(composed)
        onDateChange(index, composed)
      } else {
        next.invalid = true
      }
    } else if (composed && keyOf(composed) === current.base) {
      next.invalid = false
    }
    setEdits((prev) => prev.map((edit, i) => (i === index ? next : edit)))
    if (result.done) focusSibling(element, 1)
  }

  const onSegmentKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    index: number,
    segment: Segment,
  ) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const element = event.currentTarget
    const { key } = event
    const forward: -1 | 1 = rtl ? -1 : 1
    if (/^\d$/.test(key)) {
      event.preventDefault()
      update(
        index,
        segment,
        (parts, buffer) => typeDigit(parts, segment, buffer, key, hourCycle),
        element,
      )
      return
    }
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault()
        update(
          index,
          segment,
          (parts) => ({
            parts:
              segmentValue(parts, segment, hourCycle) === undefined
                ? setSegment(
                    parts,
                    segment,
                    segmentValue(
                      partsOf(placeholders[index] as Date),
                      segment,
                      hourCycle,
                    ) ?? 0,
                    hourCycle,
                  )
                : stepSegment(
                    parts,
                    segment,
                    key === 'ArrowUp' ? 1 : -1,
                    hourCycle,
                  ),
          }),
          element,
        )
        return
      case 'Home':
      case 'End':
        event.preventDefault()
        update(
          index,
          segment,
          (parts) => {
            const [min, max] = segmentRange(segment, parts, hourCycle)
            return {
              parts: setSegment(
                parts,
                segment,
                key === 'Home' ? min : max,
                hourCycle,
              ),
            }
          },
          element,
        )
        return
      case 'Backspace':
      case 'Delete':
        event.preventDefault()
        if (segment === 'dayPeriod') return
        update(
          index,
          segment,
          (parts) => ({
            parts: {
              ...parts,
              [segment]: undefined,
              // The 12-hour hour keeps its AM / PM in `hour`.
            },
          }),
          element,
        )
        return
      case 'ArrowRight':
      case 'ArrowLeft':
        event.preventDefault()
        focusSibling(element, key === 'ArrowRight' ? forward : -forward)
        return
      case 'Enter':
        event.preventDefault()
        onEnter()
        return
      default:
        if (segment === 'dayPeriod') {
          const period = dayPeriodForKey(key, periods)
          if (period === undefined) return
          event.preventDefault()
          update(
            index,
            segment,
            (parts) => ({
              parts: setSegment(
                parts.hour === undefined
                  ? {
                      ...parts,
                      hour: partsOf(placeholders[index] as Date).hour,
                    }
                  : parts,
                'dayPeriod',
                period,
                hourCycle,
              ),
              done: true,
            }),
            element,
          )
        }
    }
  }

  const renderSegment = (
    index: number,
    segment: Segment,
    className: string | false,
  ) => {
    const parts = partsFor(index)
    const placeholder = partsOf(placeholders[index] as Date)
    const value = parts ? segmentValue(parts, segment, hourCycle) : undefined
    const empty = value === undefined
    const shown =
      value ?? (segmentValue(placeholder, segment, hourCycle) as number)
    const edit = edits[index]
    const typing =
      edit?.segment === segment && edit.buffer !== '' && segment === 'year'
    const text = typing ? edit.buffer : segmentText(segment, shown, periods)
    const [min, max] = segmentRange(segment, parts ?? placeholder, hourCycle)
    const monthName =
      segment === 'month' && !empty
        ? new Intl.DateTimeFormat(lang, { month: 'long' }).format(
            new Date(2026, shown - 1, 1),
          )
        : undefined

    return (
      <span
        key={segment}
        role="spinbutton"
        tabIndex={0}
        aria-label={messages[segment]}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={empty ? undefined : shown}
        aria-valuetext={
          empty ? messages.empty : monthName ? `${text} – ${monthName}` : text
        }
        data-segment={segment}
        data-placeholder={empty || undefined}
        data-active={(index === active && segment === viewSegment) || undefined}
        className={twMerge(
          // 24px high and at least 24px wide: the Figma click ranges, as
          // targets (WCAG 2.5.8).
          'inline-flex h-6 min-w-6 cursor-default items-center justify-center rounded-4 px-1 tabular-nums whitespace-nowrap caret-transparent outline-none transition-colors select-none hover:bg-black-4 focus:bg-black-4 focus-ring data-active:bg-black-4',
          className,
          empty && 'text-secondary',
        )}
        onPointerDown={() => onSegmentPointer(index, segment)}
        onFocus={() => {
          // Typing starts over in each segment.
          if (edit?.buffer) {
            setEdits((prev) =>
              prev.map((item, i) =>
                i === index && item ? { ...item, buffer: '' } : item,
              ),
            )
          }
        }}
        onKeyDown={(event) => onSegmentKeyDown(event, index, segment)}
      >
        {text}
      </span>
    )
  }

  const separator = (text: string, key: string) => (
    <span key={key} aria-hidden className="text-secondary">
      {text}
    </span>
  )

  const renderDate = (index: number) => {
    const invalid = edits[index]?.invalid ?? false
    // A range's inactive date is dimmed (Figma: Black/20%).
    const dim = dates.length > 1 && index !== active
    return (
      // biome-ignore lint/a11y/useSemanticElements: a group of spinbuttons, as React Aria's DateField
      <div
        key={`date-${index}`}
        role="group"
        aria-label={labels[index]}
        aria-invalid={invalid || undefined}
        aria-current={dates.length > 1 && index === active ? 'true' : undefined}
        data-slot="date-field"
        className="flex items-center"
        onFocus={() => {
          if (index !== active) onActiveChange?.(index)
        }}
      >
        {layout.date.map((segment, i) => (
          <Fragment key={segment}>
            {i > 0 && separator(layout.dateSeparator, `sep-${segment}`)}
            {renderSegment(
              index,
              segment,
              twMerge(dim && 'text-secondary', invalid && 'text-red-text'),
            )}
          </Fragment>
        ))}
      </div>
    )
  }

  const renderTime = () => {
    const invalid = edits[active]?.invalid ?? false
    return (
      // biome-ignore lint/a11y/useSemanticElements: a group of spinbuttons, as React Aria's TimeField
      <div
        role="group"
        aria-label={timeLabel}
        aria-invalid={invalid || undefined}
        data-slot="time-field"
        className="ms-auto flex items-center"
      >
        {layout.time.map((segment, i) => {
          const previous = layout.time[i - 1]
          const colon =
            i > 0 && segment !== 'dayPeriod' && previous !== 'dayPeriod'
          return (
            <Fragment key={segment}>
              {colon && separator(layout.timeSeparator, `sep-${segment}`)}
              {renderSegment(active, segment, invalid && 'text-red-text')}
            </Fragment>
          )
        })}
      </div>
    )
  }

  return (
    // The area around the segments activates the whole field (Figma:
    // "Input status"); the segments open their views.
    // biome-ignore lint/a11y/noStaticElementInteractions: a pointer shortcut; the segments are the keyboard targets
    <div
      ref={container}
      data-slot="date-picker-top-area"
      className="flex min-h-13 items-center gap-1 border-b-[0.5px] border-black-10 px-4 py-3.5 text-14"
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        if ((event.target as Element).closest('[role="spinbutton"]')) return
        event.preventDefault()
        const group = container.current?.querySelectorAll<HTMLElement>(
          '[data-slot="date-field"]',
        )[active]
        group?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus()
        onBlankPointer()
      }}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        // Leaving the field keeps what is valid: the dates as they are.
        if (container.current?.contains(event.relatedTarget as Node)) return
        if (edits.some(Boolean)) setEdits(dates.map(() => null))
      }}
    >
      {renderDate(0)}
      {dates.length > 1 && (
        <>
          <span aria-hidden className="px-1 text-secondary">
            –
          </span>
          {renderDate(1)}
        </>
      )}
      {withTime && renderTime()}
    </div>
  )
}
