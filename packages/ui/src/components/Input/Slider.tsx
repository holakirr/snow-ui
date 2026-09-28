'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import type { FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/**
 * The accessible name of a thumb (the element with `role="slider"`): Radix
 * leaves `aria-label` on the root, which has no role, so the thumb had no
 * name. A range gets "<label>, minimum" / "…, maximum" (or "…, 2 of 3").
 */
const thumbLabel = (
  label: string | undefined,
  index: number,
  count: number,
): string | undefined => {
  if (!label || count === 1) return label
  if (count === 2) return `${label}, ${index === 0 ? 'minimum' : 'maximum'}`
  return `${label}, ${index + 1} of ${count}`
}

const Slider: FC<SliderPrimitive.SliderProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) => {
  const thumbs = props.value ?? props.defaultValue ?? [props.min ?? 0]

  return (
    <SliderPrimitive.Root
      className={twMerge(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[34px] w-full grow cursor-pointer overflow-hidden rounded-8 bg-black-4 data-[disabled]:cursor-not-allowed">
        <SliderPrimitive.Range className="absolute h-full bg-black data-[disabled]:bg-black-80" />
      </SliderPrimitive.Track>
      {thumbs.map((_, index) => (
        <SliderPrimitive.Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are positional
          key={index}
          aria-label={thumbLabel(ariaLabel, index, thumbs.length)}
          aria-labelledby={ariaLabelledBy}
          className="block size-4 cursor-grab rounded-full border border-black-40 bg-white shadow-2 transition-colors focus-ring active:cursor-grabbing data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
        />
      ))}
    </SliderPrimitive.Root>
  )
}
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
