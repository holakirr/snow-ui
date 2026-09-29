'use client'

import { XCircleIcon } from '@holakirr/snow-ui-icons'
import { CalendarBlank } from '@phosphor-icons/react/dist/csr/CalendarBlank'
import { useComposedRefs } from '@radix-ui/react-compose-refs'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { Locale } from 'date-fns'
import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import type { Matcher } from 'react-day-picker'
import { twMerge } from '../../utils/tw-merge'
import type { CalendarProps } from '../Calendar'
import { popoverAnimationClasses } from '../Popover/surface'
import { useSnowUI } from '../SnowUIProvider'

/**
 * Calendar props a date picker passes on. The selection (`mode`,
 * `selected`, `onSelect`, `required`) and the disabled days (`disabled`) are
 * the picker's own.
 */
export type DatePickerCalendarProps = Omit<
  CalendarProps,
  'mode' | 'selected' | 'onSelect' | 'required' | 'disabled'
>

/**
 * Props shared by `DatePicker` and `DateRangePicker`. Everything else goes
 * to the trigger (`id`, `aria-*`, `onBlur`, `ref`…); `className` and `style`
 * style the field.
 */
export type DatePickerSharedProps = Omit<
  ComponentProps<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'type'
> & {
  /** Marks the field required for assistive technology (`aria-required`). */
  required?: boolean

  /** Controlled open state of the calendar. */
  open?: boolean
  /** Initial open state of the calendar when uncontrolled. */
  defaultOpen?: boolean
  /** Called when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void

  /**
   * The field's text while it has no value.
   * @default messages.datePicker.placeholder: "Pick a date" (`DatePicker`),
   * messages.datePicker.rangePlaceholder: "Pick a date range" (`DateRangePicker`)
   */
  placeholder?: string

  /** The earliest day that can be picked; the calendar doesn't go before its month. */
  minDate?: Date
  /** The latest day that can be picked; the calendar doesn't go past its month. */
  maxDate?: Date
  /**
   * More days that can't be picked: react-day-picker matchers, e.g.
   * `{ dayOfWeek: [0, 6] }` for weekends or an array of dates.
   */
  disabledDates?: Matcher | Matcher[]

  /**
   * How the field shows a date: a date-fns `format` pattern, localized with
   * the `locale`.
   * @default "PP" (e.g. "Jan 20, 2025"; "20 янв. 2025 г." in Russian)
   */
  dateFormat?: string

  /**
   * The date-fns (or react-day-picker) locale of the field text and the
   * calendar. Wins over `SnowUIProvider`'s.
   */
  locale?: Locale

  /**
   * The first day of the week in the calendar: 0 for Sunday, 1 for Monday.
   * Pass `locale.options?.weekStartsOn` to follow the locale.
   * @default 1 (as `Calendar`)
   */
  weekStartsOn?: CalendarProps['weekStartsOn']

  /**
   * Shows a clear button while the field has a value; Backspace and Delete
   * on the field also clear it.
   * @default true
   */
  clearable?: boolean
  /**
   * Accessible name of the clear button.
   * @default messages.datePicker.clear: "Clear date"
   */
  clearLabel?: string

  /**
   * More `Calendar` props, e.g. `captionLayout="dropdown"`,
   * `showTodayButton` or `today`.
   */
  calendarProps?: DatePickerCalendarProps

  /** Class name for the popover around the calendar. */
  contentClassName?: string
}

/** The open state: controlled (`open`) or not (`defaultOpen`). */
export const useOpenState = (
  openProp: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined,
  disabled: boolean,
) => {
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = (openProp ?? innerOpen) && !disabled
  const setOpen = (next: boolean) => {
    if (next === open || (next && disabled)) return
    if (openProp === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }
  return [open, setOpen] as const
}

/** `minDate`, `maxDate` and `disabledDates` as react-day-picker matchers. */
export const disabledMatchers = (
  minDate: Date | undefined,
  maxDate: Date | undefined,
  disabledDates: Matcher | Matcher[] | undefined,
): Matcher[] => [
  ...(minDate ? [{ before: minDate }] : []),
  ...(maxDate ? [{ after: maxDate }] : []),
  ...(disabledDates === undefined
    ? []
    : Array.isArray(disabledDates)
      ? disabledDates
      : [disabledDates]),
]

type TriggerProps = Omit<
  DatePickerSharedProps,
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'placeholder'
  | 'minDate'
  | 'maxDate'
  | 'disabledDates'
  | 'dateFormat'
  | 'locale'
  | 'weekStartsOn'
  | 'clearable'
  | 'clearLabel'
  | 'calendarProps'
  | 'contentClassName'
  | 'className'
  | 'style'
>

type DatePickerFieldProps = {
  open: boolean
  setOpen: (open: boolean) => void
  /** The field's text: the formatted value, or the placeholder. */
  text: string
  hasValue: boolean
  canClear: boolean
  clearLabel: string
  onClear: () => void
  /** The popover's accessible name. */
  dialogLabel: string
  className?: string
  style?: CSSProperties
  contentClassName?: string
  /** Hidden inputs for native form submission. */
  hiddenInputs?: ReactNode
  /** The calendar. */
  children: ReactNode
  triggerProps: TriggerProps
}

/**
 * The field and the popover of `DatePicker` and `DateRangePicker`. The field
 * looks like the Select trigger (the Figma Input field, with a 16px calendar
 * icon at the end); it is a `<button role="combobox">` that opens the
 * calendar in a modal Radix Popover (`aria-haspopup="dialog"`).
 */
export const DatePickerField = ({
  open,
  setOpen,
  text,
  hasValue,
  canClear,
  clearLabel,
  onClear,
  dialogLabel,
  className,
  style,
  contentClassName,
  hiddenInputs,
  children,
  triggerProps: {
    disabled,
    required,
    onKeyDown,
    ref,
    'aria-invalid': ariaInvalid,
    ...triggerProps
  },
}: DatePickerFieldProps) => {
  const { dir } = useSnowUI()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const setTriggerRef = useComposedRefs(triggerRef, ref)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const clear = () => {
    onClear()
    triggerRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) return
    // Like a combobox: ↓ (or Alt+↓) opens the calendar.
    if (event.key === 'ArrowDown' && !open) {
      event.preventDefault()
      setOpen(true)
    } else if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      canClear
    ) {
      event.preventDefault()
      clear()
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal>
      <PopoverPrimitive.Anchor asChild>
        <div
          className={twMerge(
            // The Figma Input field, as `SelectTrigger`: 12/16 padding, a
            // 16px radius, Surface/1 with a 0.5px Black/20% inside stroke
            // (Black/40% on hover and while open, with the 4px Focus ring).
            'group/date-picker relative flex w-full rounded-16 bg-surface-1 text-14 text-black inset-ring-[0.5px] inset-ring-black-20 transition-all hover:inset-ring-black-40',
            'data-[state=open]:inset-ring-black-40 data-[state=open]:ring-4 data-[state=open]:ring-focus',
            // Invalid, while the trigger has `aria-invalid="true"`: the 1px
            // Red stroke of `Input`, also while the calendar is open.
            'has-aria-invalid:inset-ring has-aria-invalid:inset-ring-red has-aria-invalid:data-[state=open]:inset-ring-red',
            // The disabled look (the design has no Disabled state).
            'data-disabled:bg-black-4 data-disabled:text-black-20 data-disabled:inset-ring-0 data-disabled:hover:inset-ring-0',
            className,
          )}
          style={style}
          data-slot="date-picker"
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
        >
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              {...triggerProps}
              ref={setTriggerRef}
              // A select-only combobox: the label names it, the text is its
              // value. Radix adds aria-haspopup="dialog" and aria-controls.
              role="combobox"
              aria-expanded={open}
              aria-invalid={ariaInvalid}
              aria-required={required || undefined}
              disabled={disabled}
              data-slot="date-picker-trigger"
              data-placeholder={hasValue ? undefined : ''}
              onKeyDown={handleKeyDown}
              className={twMerge(
                'flex min-h-11 w-full min-w-0 cursor-pointer items-center rounded-16 py-3 ps-4 text-start focus-ring disabled:cursor-not-allowed data-[placeholder]:text-secondary group-data-disabled/date-picker:text-black-20',
                canClear ? 'pe-16' : 'pe-10',
              )}
            >
              <span className="truncate">{text}</span>
            </button>
          </PopoverPrimitive.Trigger>
          {canClear && (
            <button
              type="button"
              aria-label={clearLabel}
              title={clearLabel}
              onClick={clear}
              // As in `Search`: 60% opacity meets the 3:1 of a control's icon.
              className="absolute end-10 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-black opacity-60 outline-none transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:ring-2 focus-visible:ring-black-20"
            >
              <XCircleIcon weight="fill" size={16} />
            </button>
          )}
          <CalendarBlank
            aria-hidden
            size={16}
            className="pointer-events-none absolute end-4 top-1/2 shrink-0 -translate-y-1/2 text-black-40 group-data-disabled/date-picker:text-black-20"
          />
          {hiddenInputs}
        </div>
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          dir={dir}
          align="start"
          sideOffset={4}
          collisionPadding={8}
          aria-label={dialogLabel}
          // Focus goes to the selected day (or today, or the first day of the
          // month): react-day-picker's roving tab stop, not the first button.
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            contentRef.current
              ?.querySelector<HTMLElement>('[role="grid"] button[tabindex="0"]')
              ?.focus()
          }}
          className={twMerge(
            'z-50 outline-none',
            popoverAnimationClasses,
            contentClassName,
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
