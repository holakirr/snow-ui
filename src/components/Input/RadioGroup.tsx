'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>

const RadioGroup: FC<RadioGroupProps> = ({ className, ...props }) => (
  <RadioGroupPrimitive.Root
    className={twMerge('grid gap-2', className)}
    {...props}
  />
)
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item>

const RadioGroupItem: FC<RadioGroupItemProps> = ({ className, ...props }) => (
  <RadioGroupPrimitive.Item
    className={twMerge(
      'group aspect-square h-7 w-7 rounded-full border border-black/20 text-black focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-black/10 hover:bg-black/4 hover:border-black/40',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="w-[14px] h-[14px] aspect-square rounded-full bg-brand group-hover:bg-brand-hover group-disabled:bg-black/10" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
)
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
