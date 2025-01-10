'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const Slider: FC<SliderPrimitive.SliderProps> = ({ className, ...props }) => (
  <SliderPrimitive.Root
    className={twMerge(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[34px] w-full grow overflow-hidden rounded-lg bg-black/5">
      <SliderPrimitive.Range className="absolute h-full bg-black data-[disabled]:bg-black/80" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-brand/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
