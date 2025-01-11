import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  basicInputClasses,
  disabledInputClasses,
  focusInputClasses,
} from './Input'

type TextareaProps = ComponentProps<'textarea'>

const Textarea: FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={twMerge(
      'flex min-h-18 w-full focus-visible:outline-none',
      basicInputClasses,
      disabledInputClasses,
      focusInputClasses,
      'text-sm',
      className,
    )}
    {...props}
  />
)
Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
