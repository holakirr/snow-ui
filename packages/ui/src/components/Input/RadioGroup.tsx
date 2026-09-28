'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>

const RadioGroup: FC<RadioGroupProps> = ({ className, ...props }) => (
  <RadioGroupPrimitive.Root
    className={twMerge('grid gap-2', className)}
    {...props}
  />
)
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item>

/**
 * Figma "Radio" (Select True / False × State Default / Hover): a 28px circle
 * with a 2px Black/20% ring on Background/3 (a Black 8% fill and a Black/40%
 * ring on hover). Selected, a 14px Primary dot with the Figma inner shadow
 * sits in the middle (Primary under White/40% on hover).
 */
const RadioGroupItem: FC<RadioGroupItemProps> = ({ className, ...props }) => (
  <RadioGroupPrimitive.Item
    className={twMerge(
      'group aspect-square size-7 shrink-0 cursor-pointer rounded-full bg-background-3 text-black inset-ring-2 inset-ring-black-20 transition-all',
      'enabled:hover:bg-black/8 enabled:hover:inset-ring-black-40',
      'focus-ring disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
      <span className="size-3.5 rounded-full bg-primary inset-shadow-inner transition-colors group-enabled:group-hover:bg-primary-hover-strong" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
)
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
}
