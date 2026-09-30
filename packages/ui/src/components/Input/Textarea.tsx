import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  basicInputClasses,
  disabledInputClasses,
  focusInputClasses,
  invalidInputClasses,
  staticInputClasses,
} from './Input'
import { TextareaWithCount } from './TextareaCount'

type TextareaProps = ComponentProps<'textarea'> & {
  /**
   * Shows the Figma character counter ("12/200", or "12" without a
   * `maxLength`) in the bottom-end corner. Screen readers get "12 of 200
   * characters" as the field's description.
   * @default true when `maxLength` is set
   */
  showCount?: boolean

  /**
   * Class names for the `<div>` around the textarea and its counter (only
   * rendered with the counter): give it the width. `className` styles the
   * `<textarea>`.
   */
  containerClassName?: string
}

/**
 * Figma "Textarea": the Input field (12/16 padding, 16px radius, 0.5px
 * stroke, 14/20 text), at least one row (44px) high, with the Figma counter
 * when it has a `maxLength` (or `showCount`). `readOnly` gives the Figma
 * "Static" state.
 */
const Textarea: FC<TextareaProps> = ({
  className,
  showCount,
  containerClassName,
  ...props
}) => {
  const classes = twMerge(
    'flex min-h-11 w-full',
    basicInputClasses,
    staticInputClasses,
    disabledInputClasses,
    focusInputClasses,
    invalidInputClasses,
    className,
  )

  // Without the counter, a plain <textarea> (no client code).
  return (showCount ?? props.maxLength !== undefined) ? (
    <TextareaWithCount
      className={classes}
      containerClassName={containerClassName}
      {...props}
    />
  ) : (
    <textarea className={classes} {...props} />
  )
}
Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
