import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { TextareaErrorIcon } from './fieldIcons'
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
   * Shows the kit's Error icon while the textarea is invalid (`aria-invalid`,
   * which `FormControl` of Form sets): a 16px `Warning` at the end of the
   * first row, in the red of the stroke; the text then stops 40px from the
   * end. An invalid `FormLabel` stays grey, as the kit's title does. Off by
   * default in 5.x: it wraps the textarea in a `<div>`, as `showCount` does
   * (switching it on or off remounts the textarea). Added in 5.2.
   * @default false
   */
  showErrorIcon?: boolean

  /**
   * Class names for the `<div>` around the textarea and its counter or
   * Error icon (only rendered with `showCount` or `showErrorIcon`): give it
   * the width. `className` styles the `<textarea>`.
   */
  containerClassName?: string
}

/**
 * Figma "Textarea": the Input field (12/16 padding, 16px radius, 0.5px
 * stroke, 14/20 text), at least one row (44px) high, with the Figma counter
 * when `showCount` is set. `readOnly` gives the Figma "Static" state;
 * `aria-invalid` the kit's Error stroke, and its `Warning` icon with
 * `showErrorIcon`.
 */
const Textarea: FC<TextareaProps> = ({
  className,
  showCount,
  showErrorIcon,
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
    // While the Error icon shows, the text stops 8px before it.
    showErrorIcon && 'aria-invalid:pe-10',
    className,
  )

  if (showCount) {
    return (
      <TextareaWithCount
        // The text stops above the counter (the Figma 44px frame lets it
        // run under it): one row is 52px high.
        className={twMerge(classes, 'pb-5')}
        containerClassName={containerClassName}
        showErrorIcon={showErrorIcon}
        {...props}
      />
    )
  }

  // Without the counter, no client code: a plain <textarea>, in a <div>
  // with the Error icon.
  return showErrorIcon ? (
    <div
      className={twMerge('relative w-full', containerClassName)}
      data-slot="textarea-field"
    >
      <textarea className={classes} {...props} />
      <TextareaErrorIcon />
    </div>
  ) : (
    <textarea className={classes} {...props} />
  )
}
Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
