import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  basicInputClasses,
  disabledInputClasses,
  focusInputClasses,
  invalidInputClasses,
  staticInputClasses,
} from './inputClasses'
import { TextareaWithCount } from './TextareaCount'

type TextareaProps = ComponentProps<'textarea'> & {
  /**
   * Shows the Figma character counter in the bottom-end corner: "12/200"
   * against `maxLength`, or "12" without one. Screen readers get "12 of 200
   * characters" as the field's description. Off by default in 5.x (it wraps
   * the textarea in a `<div>`); switching it on or off remounts the
   * textarea.
   * @default false
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
 * when `showCount` is set. `readOnly` gives the Figma "Static" state.
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
  return showCount ? (
    <TextareaWithCount
      // The text stops above the counter (the Figma 44px frame lets it run
      // under it): one row is 52px high.
      className={twMerge(classes, 'pb-5')}
      containerClassName={containerClassName}
      {...props}
    />
  ) : (
    <textarea className={classes} {...props} />
  )
}
Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
