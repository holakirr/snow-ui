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
import { ROLES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import { Label } from '../Label'

/**
 * The Figma Input field: 12/16 padding, a 16px radius, Surface/1 with a 0.5px
 * Black/20% inside stroke (Black/40% on hover and focus), 14/20 text and a
 * Black/20% placeholder. Shared by `Textarea`.
 */
export const basicInputClasses =
  'peer rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-black-20 transition-all placeholder:text-black-20 hover:inset-ring-black-40'

/** The disabled look (the design has no Disabled state). */
export const disabledInputClasses =
  'disabled:cursor-not-allowed disabled:bg-black-4 disabled:text-black-20 disabled:inset-ring-0'

/**
 * Figma "Focus": a Black/40% stroke plus the Focus effect (4px Black/4% ring).
 * Text fields follow the design exactly — the caret and the darker stroke mark
 * focus — instead of the `focus-ring` outline other controls use.
 */
export const focusInputClasses =
  'focus:inset-ring-black-40 focus:ring-4 focus:ring-focus'

/** Figma "Static" (read-only): the stroke doesn't react to hover or focus. */
export const staticInputClasses =
  'read-only:hover:inset-ring-black-20 read-only:focus:inset-ring-black-20'

// The field shell: the same look, driven by the inner <input>. Focus is the
// Figma "Focus" state: Black/40% stroke + the 4px Focus ring, while the
// <input> is focused (by mouse or keyboard, like the design).
const fieldClasses =
  'group/input relative flex w-full cursor-text items-center gap-2 rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-black-20 transition-all hover:inset-ring-black-40 focus-within:inset-ring-black-40 has-[input:focus]:ring-4 has-[input:focus]:ring-focus'

const fieldStaticClasses =
  'hover:inset-ring-black-20 focus-within:inset-ring-black-20'

const fieldDisabledClasses =
  'cursor-not-allowed bg-black-4 text-black-20 inset-ring-0 hover:inset-ring-0'

const adornmentClasses =
  'flex shrink-0 items-center text-black-40 [&>svg]:size-4 [&>svg]:shrink-0'

type InputProps = Omit<ComponentProps<'input'>, 'title'> & {
  /**
   * The Figma "2 row" title: a 12/16 Black/40% label above the value.
   */
  title?: string

  /**
   * Content before the value, e.g. a 16px icon.
   */
  startContent?: ReactNode

  /**
   * Content after the value, e.g. a 16px icon, a button or a `KBD`.
   */
  endContent?: ReactNode

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
 * Input component: the Figma Input (1 row, or 2 rows with a `title`), with
 * optional leading and trailing content. `readOnly` gives the Figma "Static"
 * state.
 */
const Input: FC<InputProps> = ({
  className,
  inputClassName,
  style,
  inputStyle,
  id,
  title,
  startContent,
  endContent,
  disabled,
  readOnly,
  ref,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id ?? (title ? generatedId : undefined)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setRef = useComposedRefs(inputRef, ref)

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
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {title && <Label htmlFor={inputId}>{title}</Label>}
        <input
          className={twMerge(
            'w-full min-w-0 bg-transparent text-inherit outline-none placeholder:text-black-20 disabled:cursor-not-allowed',
            inputClassName,
          )}
          style={inputStyle}
          id={inputId}
          ref={setRef}
          role={ROLES.textbox}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
      </div>
      {endContent && <span className={adornmentClasses}>{endContent}</span>}
    </div>
  )
}

Input.displayName = 'Input'

export { Input, type InputProps }
