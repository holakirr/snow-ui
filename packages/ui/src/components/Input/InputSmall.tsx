'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { ROLES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'

/**
 * The Figma "Search" field without its icons: 28px high, 4/8 padding, a 16px
 * radius, 14/20 text and a background blur.
 * - `gray`: Black/4%, Black/10% on hover; on focus Surface/1 with a 0.5px
 *   Black/40% stroke.
 * - `outline`: Surface/1 with a 0.5px Black/20% stroke, Black/40% on hover
 *   and focus.
 */
const inputVariants = cva(
  [
    'rounded-16 px-2 py-1 text-14 text-black backdrop-blur-[10px] transition-all placeholder:text-black-20',
    'focus-ring',
    'disabled:cursor-not-allowed disabled:text-black-20',
  ],
  {
    variants: {
      variant: {
        gray: 'bg-black-4 hover:bg-black-10 focus:bg-surface-1 focus:inset-ring-[0.5px] focus:inset-ring-black-40 read-only:hover:bg-black-4 disabled:bg-black-4',
        outline:
          'bg-surface-1 inset-ring-[0.5px] inset-ring-black-20 hover:inset-ring-black-40 focus:inset-ring-black-40 read-only:hover:inset-ring-black-20 read-only:focus:inset-ring-black-20 disabled:inset-ring-black-10',
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
    role={ROLES.textbox}
    {...props}
  />
)
InputSmall.displayName = 'InputSmall'

export { InputSmall, type InputSmallProps }
