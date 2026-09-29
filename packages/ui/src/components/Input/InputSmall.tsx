'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { invalidInputClasses } from './Input'

/**
 * The Figma "Search" field without its icons: 28px high, 4/8 padding, a 16px
 * radius, 14/20 text and a background blur.
 * - `gray`: Black/4%, Black/10% on hover; on focus Surface/1 with a 0.5px
 *   Black/40% stroke.
 * - `outline`: Surface/1 with a 0.5px Black/20% stroke, Black/40% on hover
 *   and focus.
 *
 * The stroke and placeholder colours are the `control-border*` and
 * `placeholder` tokens. With more contrast the stroke is 1px and the gray
 * field gets one too: its Black/4% fill alone is 1.1:1 (WCAG 1.4.11).
 */
const inputVariants = cva(
  [
    'rounded-16 px-2 py-1 text-14 text-black backdrop-blur-[10px] transition-all placeholder:text-placeholder contrast-more:inset-ring-1 contrast-more:focus:inset-ring-1',
    'focus:ring-4 focus:ring-focus',
    'disabled:cursor-not-allowed disabled:text-black-20',
    invalidInputClasses,
  ],
  {
    variants: {
      variant: {
        gray: 'bg-black-4 hover:bg-black-10 focus:bg-surface-1 focus:inset-ring-[0.5px] focus:inset-ring-control-border-strong read-only:hover:bg-black-4 disabled:bg-black-4 contrast-more:inset-ring-control-border',
        outline:
          'bg-surface-1 inset-ring-[0.5px] inset-ring-control-border hover:inset-ring-control-border-strong focus:inset-ring-control-border-strong read-only:hover:inset-ring-control-border read-only:focus:inset-ring-control-border disabled:inset-ring-black-10',
      },
    },
    defaultVariants: {
      variant: 'gray',
    },
  },
)

type InputSmallProps = ComponentProps<'input'> &
  VariantProps<typeof inputVariants>

const InputSmall: FC<InputSmallProps> = ({ className, variant, ...props }) => (
  <input
    className={twMerge(inputVariants({ variant }), className)}
    {...props}
  />
)
InputSmall.displayName = 'InputSmall'

export { InputSmall, type InputSmallProps }
