'use client'

import { XCircleIcon } from '@holakirr/snow-ui-icons'
import { useComposedRefs } from '@radix-ui/react-compose-refs'
import {
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
  type FC,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useFormReset } from '../../utils/form-field'
import { setNativeValue } from '../../utils/native-value'
import { twMerge } from '../../utils/tw-merge'
import { Label } from '../Label'
import { useMessages } from '../SnowUIProvider'
import { LoadingRing } from '../Spinner/ring'
import { CheckGlyph, WarningGlyph } from './fieldIcons'

// The class strings the text fields share live in a module without
// 'use client', so a server component (Textarea) can read them; re-exported
// here for code that imports them from this file.
export {
  basicInputClasses,
  disabledInputClasses,
  focusInputClasses,
  invalidInputClasses,
  staticInputClasses,
} from './inputClasses'

// The field shell: the same look, driven by the inner <input>. Focus is the
// Figma "Focus" state: Black/40% stroke + the 4px Focus ring, while the
// <input> is focused (by mouse or keyboard, like the design); a 2px stroke
// with more contrast, as `focusInputClasses`.
const fieldClasses =
  'group/input relative flex w-full cursor-text items-center gap-2 rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-control-border transition-all hover:inset-ring-control-border-strong focus-within:inset-ring-control-border-strong has-[input:focus]:ring-4 has-[input:focus]:ring-focus contrast-more:inset-ring-1 contrast-more:has-[input:focus]:inset-ring-2'

const fieldStaticClasses =
  'hover:inset-ring-control-border focus-within:inset-ring-control-border'

// Invalid: the `invalidInputClasses` stroke, while the <input> is invalid.
const fieldInvalidClasses =
  'has-aria-invalid:inset-ring has-aria-invalid:inset-ring-control-border-invalid'

const fieldDisabledClasses =
  'cursor-not-allowed bg-black-4 text-black-20 inset-ring-0 hover:inset-ring-0'

const adornmentClasses =
  'flex shrink-0 items-center text-black-40 [&>svg]:size-4 [&>svg]:shrink-0'

// The kit's status icons at the end of the field (Component state): 16px,
// after the end content, 16px from the edge (the field's padding) and
// centred in its height, in the 2 row layouts too.
const statusIconClasses = 'flex shrink-0 items-center [&>svg]:size-4'

// The kit's Error icon (`showErrorIcon`), while the <input> is invalid: the
// Warning in the stroke's colour, `control-border-invalid` (Secondary/Red,
// `red-text` with more contrast). `data-error-icon` keeps an invalid
// `FormLabel` grey, as the kit's title.
const errorIconClasses =
  'hidden text-control-border-invalid group-has-aria-invalid/input:flex'

// The kit's clear button (Focus): a 16px XCircle Fill in Black/100% at the
// end of the field, shown while the field has focus (the input, or the
// button itself) and a value. `hit-area` makes it a 24px target (WCAG
// 2.5.8); keyboard focus gets the `focus-ring` outline.
const clearButtonClasses =
  'relative hidden shrink-0 cursor-pointer items-center justify-center rounded-full text-black hit-area focus-ring group-focus-within/input:flex [&>svg]:size-4'

// The kit's In progress icon: the turning ring of Spinner (Loading A), in
// Black/100%, as the kit draws it. It stops turning for reduced motion.
const progressIconClasses = 'text-black'

// The kit's Done icon: a Check in Secondary/Green (1.69:1 on white), hidden
// while the field is invalid. With more contrast it is green mixed with 40%
// of `black` (white in dark mode), Alert's success icon: 4.4:1 on white.
const successIconClasses =
  'text-green group-has-aria-invalid/input:hidden contrast-more:text-[color:color-mix(in_srgb,var(--color-green),var(--color-black)_40%)]'

/**
 * The kit's field states "In progress" (a check of the value is running)
 * and "Done" (it passed). Added in 5.2.
 */
type InputStatus = 'progress' | 'success'

/** Whether a field value is not empty. */
const hasText = (value: ComponentProps<'input'>['value']) =>
  value != null && String(value) !== ''

type InputProps = Omit<ComponentProps<'input'>, 'title'> & {
  /**
   * The Figma "2 row" title: a 12/16 label in `text-secondary` (Figma:
   * Black/40%, 2.85:1), above the value or before it (`titleLayout`).
   */
  title?: string

  /**
   * Where the `title` goes: `vertical` above the value (Figma "2 row
   * vertical", 68px high), `horizontal` at the start of the one 44px row with
   * the value at the end (Figma "2 row horizontal").
   * @default "vertical"
   */
  titleLayout?: 'vertical' | 'horizontal'

  /**
   * Content before the value, e.g. a 16px icon.
   */
  startContent?: ReactNode

  /**
   * Content after the value, e.g. a 16px icon, a button or a `KBD`.
   */
  endContent?: ReactNode

  /**
   * Shows the kit's Error icon while the input is invalid (`aria-invalid`,
   * which `FormControl` of Form sets): a 16px `Warning` at the end of the
   * field, in the red of the stroke. An invalid `FormLabel` then stays grey,
   * as the kit's title does. The icon is decorative: `aria-invalid` and the
   * error text (`FormMessage`) tell the error. Off by default in 5.x.
   * Added in 5.2.
   * @default false
   */
  showErrorIcon?: boolean

  /**
   * Shows the kit's clear button (an `XCircle`) at the end of the field
   * while it has focus and a value, unless it is disabled or read-only.
   * Clearing goes through the input's `onChange` (an `input` event), so a
   * controlled field, an uncontrolled one and react-hook-form all get the
   * empty value; focus returns to the input. Off by default. Added in 5.2.
   * @default false
   */
  clearable?: boolean

  /**
   * Accessible name of the clear button.
   * @default messages.input.clear: "Clear"
   */
  clearLabel?: string

  /**
   * Called after the clear button cleared the field (after `onChange`).
   */
  onClear?: () => void

  /**
   * The kit's In progress and Done states, for a value the app checks (the
   * kit checks when the field loses focus): `progress` shows a turning ring
   * at the end of the field (instead of the Error icon) and sets
   * `aria-busy` on the input; `success` shows a green check (hidden while
   * the field is invalid). A status region announces the change: `progress`
   * as "Checking", `success` as "Valid" (`statusLabel`, or
   * `messages.input`). Added in 5.2.
   */
  status?: InputStatus

  /**
   * What the status region announces for the current `status`, e.g.
   * "Checking the username" or "Username available".
   * @default messages.input.progress: "Checking", messages.input.success: "Valid"
   */
  statusLabel?: string

  /**
   * Class names for the `<input>` element. `className` styles the field.
   */
  inputClassName?: string

  /**
   * Inline styles for the `<input>` element. `style` styles the field.
   */
  inputStyle?: CSSProperties
}

/**
 * Input component: the Figma Input (1 row, or 2 rows with a `title`: above
 * the value, or beside it with `titleLayout="horizontal"`), with optional
 * leading and trailing content. `readOnly` gives the Figma "Static" state;
 * `aria-invalid` the kit's Error stroke, and its `Warning` icon with
 * `showErrorIcon`.
 */
const Input: FC<InputProps> = ({
  className,
  inputClassName,
  style,
  inputStyle,
  id,
  title,
  titleLayout = 'vertical',
  startContent,
  endContent,
  showErrorIcon = false,
  clearable = false,
  clearLabel,
  onClear,
  status,
  statusLabel,
  value,
  defaultValue,
  onChange,
  onFocus,
  disabled,
  readOnly,
  ref,
  ...props
}) => {
  const messages = useMessages()
  const generatedId = useId()
  const inputId = id ?? (title ? generatedId : undefined)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setRef = useComposedRefs(inputRef, ref)
  const horizontal = !!title && titleLayout === 'horizontal'

  // Whether the field has a value, for the clear button. A controlled value
  // is read from the prop (`value={null}` leaves the field uncontrolled, as
  // React does); an uncontrolled one follows typing, and is read again from
  // the element on focus (the button only shows on focus) and after a
  // reset of the form, which change the value without `onChange`
  // (react-hook-form's `reset`, a value set through the ref).
  const [ownFilled, setOwnFilled] = useState(() => hasText(defaultValue))
  const filled = value != null ? hasText(value) : ownFilled
  const canClear = clearable && filled && !disabled && !readOnly
  const syncFilled = () => {
    if (clearable && inputRef.current) {
      setOwnFilled(inputRef.current.value !== '')
    }
  }
  useFormReset(inputRef, syncFilled)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (clearable) setOwnFilled(event.target.value !== '')
    onChange?.(event)
  }

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    syncFilled()
    onFocus?.(event)
  }

  // The status region is in the DOM while the field has a status, and its
  // text changes after the region is there (an effect): a region added with
  // its text isn't announced by every screen reader. A status the field
  // starts with isn't announced.
  const statusText =
    status === 'progress'
      ? (statusLabel ?? messages.input.progress)
      : status === 'success'
        ? (statusLabel ?? messages.input.success)
        : ''
  const [announced, setAnnounced] = useState(statusText)
  useEffect(() => {
    setAnnounced(statusText)
  }, [statusText])

  const clear = () => {
    const input = inputRef.current
    if (!input) return
    setNativeValue(input, '')
    input.focus()
    onClear?.()
  }

  // Clicks on the padding or the adornments focus the input.
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (disabled || target === inputRef.current || target.closest('label')) {
      return
    }
    if (target.closest('button, a, input, select, textarea')) {
      return
    }
    event.preventDefault()
    inputRef.current?.focus()
  }

  return (
    <div
      className={twMerge(
        fieldClasses,
        fieldInvalidClasses,
        readOnly && fieldStaticClasses,
        disabled && fieldDisabledClasses,
        className,
      )}
      style={style}
      data-slot="input"
      data-disabled={disabled || undefined}
      data-static={readOnly || undefined}
      onPointerDown={handlePointerDown}
    >
      {startContent && <span className={adornmentClasses}>{startContent}</span>}
      <div
        className={twMerge(
          'flex min-w-0 flex-1 gap-2',
          // Figma "2 row horizontal": the title, then the value at the end.
          horizontal ? 'items-center' : 'flex-col',
        )}
      >
        {title && (
          <Label
            htmlFor={inputId}
            // A long title is cut at half the row, so the value keeps room.
            className={twMerge(
              horizontal && 'max-w-1/2 min-w-0 shrink-0 truncate',
            )}
          >
            {title}
          </Label>
        )}
        <input
          className={twMerge(
            'w-full min-w-0 bg-transparent text-inherit outline-none placeholder:text-placeholder disabled:cursor-not-allowed',
            horizontal && 'text-end',
            inputClassName,
          )}
          style={inputStyle}
          id={inputId}
          ref={setRef}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          aria-busy={status === 'progress' || undefined}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
      </div>
      {endContent && <span className={adornmentClasses}>{endContent}</span>}
      {canClear && (
        <button
          type="button"
          aria-label={clearLabel ?? messages.input.clear}
          title={clearLabel ?? messages.input.clear}
          // Keeps the focus in the input, so the field stays focused (and the
          // button shown) until the click: Safari doesn't focus buttons.
          onPointerDown={(event) => event.preventDefault()}
          onClick={clear}
          className={clearButtonClasses}
          data-slot="input-clear"
        >
          <XCircleIcon weight="fill" size={16} />
        </button>
      )}
      {showErrorIcon && (
        <span
          aria-hidden
          className={twMerge(
            statusIconClasses,
            errorIconClasses,
            // The In progress ring takes its place.
            status === 'progress' && 'group-has-aria-invalid/input:hidden',
          )}
          data-slot="input-error-icon"
          data-error-icon=""
        >
          <WarningGlyph />
        </span>
      )}
      {(status === 'progress' || status === 'success') && (
        <span
          aria-hidden
          className={twMerge(
            statusIconClasses,
            status === 'progress' ? progressIconClasses : successIconClasses,
          )}
          data-slot="input-status-icon"
          data-status={status}
        >
          {status === 'progress' ? <LoadingRing /> : <CheckGlyph />}
        </span>
      )}
      {status !== undefined && (
        <span role="status" className="sr-only" data-slot="input-status">
          {announced}
        </span>
      )}
    </div>
  )
}

Input.displayName = 'Input'

export { Input, type InputProps, type InputStatus }
