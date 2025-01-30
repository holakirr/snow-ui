'use client'

import { Check } from '@phosphor-icons/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type CheckboxProps = CheckboxPrimitive.CheckboxProps

const Checkbox: FC<CheckboxProps> = ({ className, ...props }) => (
  <CheckboxPrimitive.Root
    className={twMerge(
      'peer h-7 w-7 shrink-0 rounded-md transition-colors border-2 border-black/20 hover:bg-black/4 hover:border-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/5 disabled:cursor-not-allowed disabled:border-black-10 data-[state=checked]:bg-brand data-[state=checked]:text-white cursor-pointer',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={twMerge('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" weight="bold" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, type CheckboxProps }
