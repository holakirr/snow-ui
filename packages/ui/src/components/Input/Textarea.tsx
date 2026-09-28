import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  basicInputClasses,
  disabledInputClasses,
  focusInputClasses,
  staticInputClasses,
} from './Input'

type TextareaProps = ComponentProps<'textarea'>

/**
 * Figma "Textarea": the Input field (12/16 padding, 16px radius, 0.5px
 * stroke, 14/20 text), at least one row (44px) high. `readOnly` gives the
 * Figma "Static" state.
 */
const Textarea: FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={twMerge(
      'flex min-h-11 w-full',
      basicInputClasses,
      staticInputClasses,
      disabledInputClasses,
      focusInputClasses,
      className,
    )}
    {...props}
  />
)
Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
