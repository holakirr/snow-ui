'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

type PopoverContentProps = PopoverPrimitive.PopoverContentProps

const PopoverContent: FC<PopoverContentProps> = ({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={twMerge(
        'z-50 w-60 rounded-2xl border-[0.5px] border-black/10 bg-white/80 backdrop-blur-2xl p-4 text-black outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
}
