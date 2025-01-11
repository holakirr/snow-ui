'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipContentProps = TooltipPrimitive.TooltipContentProps

const TooltipContent: FC<TooltipContentProps> = ({
  className,
  sideOffset = 4,
  ...props
}) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={twMerge(
        'z-50 overflow-hidden rounded-lg bg-black/80 px-2 py-1 text-xs text-white animate-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top data-[side=left]:slide-in-from-right data-[side=right]:slide-in-from-left data-[side=top]:slide-in-from-bottom',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
}
