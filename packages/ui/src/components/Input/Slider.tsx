'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import type { FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

const Slider: FC<SliderPrimitive.SliderProps> = ({ className, ...props }) => {
  const thumbs = props.value ?? props.defaultValue ?? [props.min ?? 0]

  return (
    <SliderPrimitive.Root
      className={twMerge(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[34px] w-full grow overflow-hidden rounded-8 bg-black-4">
        <SliderPrimitive.Range className="absolute h-full bg-black data-[disabled]:bg-black-80" />
      </SliderPrimitive.Track>
      {thumbs.map((_, index) => (
        <SliderPrimitive.Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are positional
          key={index}
          className="block size-4 rounded-full border border-black-40 bg-white shadow-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-40"
        />
      ))}
    </SliderPrimitive.Root>
  )
}
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
