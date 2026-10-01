'use client'

import { useComposedRefs } from '@radix-ui/react-compose-refs'
import {
  type ComponentProps,
  type CSSProperties,
  type FC,
  type PointerEvent,
  type ReactNode,
  useId,
  useRef,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { Label } from '../Label'
import { WarningGlyph } from './fieldIcons'

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
  disabled,
  readOnly,
  ref,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id ?? (title ? generatedId : undefined)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setRef = useComposedRefs(inputRef, ref)
  const horizontal = !!title && titleLayout === 'horizontal'

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
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
      </div>
      {endContent && <span className={adornmentClasses}>{endContent}</span>}
      {showErrorIcon && (
        <span
          aria-hidden
          className={twMerge(statusIconClasses, errorIconClasses)}
          data-slot="input-error-icon"
          data-error-icon=""
        >
          <WarningGlyph />
        </span>
      )}
    </div>
  )
}

Input.displayName = 'Input'

export { Input, type InputProps }
