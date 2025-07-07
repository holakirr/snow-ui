'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const toggleVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors bg-transparent text-black/20 font-normal hover:bg-black/5 hover:text-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/5 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-black/10 data-[state=on]:text-black [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:text-black/10',
  {
    variants: {
      variant: {
        borderless: '',
        outline: 'border border-input disabled:border-black/10',
      },
      size: {
        sm: 'text-sm py-1 px-2 has-only:px-1 rounded-lg gap-1 [&_svg]:size-4',
        md: 'text-base py-2 px-4 has-only:px-2 rounded-xl gap-2 [&_svg]:size-5',
        lg: 'text-lg py-3 px-6 has-only:px-3 rounded-2xl gap-2 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'borderless',
      size: 'md',
    },
  },
)

type ToggleProps = TogglePrimitive.ToggleProps &
  VariantProps<typeof toggleVariants>

const Toggle: FC<ToggleProps> = ({ className, variant, size, ...props }) => (
  <TogglePrimitive.Root
    className={twMerge(toggleVariants({ variant, size, className }))}
    tabIndex={0}
    {...props}
  />
)

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
