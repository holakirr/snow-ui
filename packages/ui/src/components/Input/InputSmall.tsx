'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { ROLES } from '../../constants'

const inputVariants = cva(
  'px-2 py-1 rounded-lg text-sm placeholder:text-black/20 text-black/100 disabled:cursor-not-allowed focus:ring-4 focus:ring-black/5 focus:outline-none active:inset-ring-black/40 focus:inset-ring-black/40 transition-all',
  {
    variants: {
      variant: {
        gray: 'bg-black/4 hover:bg-black/10 focus:bg-bg5 focus:inset-ring-[0.5px] focus:inset-ring-black/40 disabled:bg-black/4 disabled:text-black/20',
        outline:
          'bg-bg5 inset-ring inset-ring-black/10 hover:inset-ring-black/40 disabled:inset-ring-black/10',
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
