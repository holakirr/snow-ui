'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { type Messages, useMessages } from '../SnowUIProvider'

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Accessible names of the thumbs, in order. Without them, a single thumb
   * is named by `aria-label` and the thumbs of a range by
   * `messages.slider`: "<aria-label>, minimum" / "…, maximum" (or
   * "…, 2 of 3").
   */
  thumbLabels?: string[]
}

/**
 * The accessible name of a thumb (the element with `role="slider"`): Radix
 * leaves `aria-label` on the root, which has no role, so the thumb had no
 * name.
 */
const thumbLabel = (
  messages: Messages['slider'],
  label: string | undefined,
  index: number,
  count: number,
): string | undefined => {
  if (!label || count === 1) return label
  if (count === 2) {
    return index === 0 ? messages.minimum(label) : messages.maximum(label)
  }
  return messages.thumb(label, index + 1, count)
}

/**
 * Radix Slider with the Figma track. Keyboard and pointer input follow the
 * `dir` of `SnowUIProvider`: in right-to-left text the minimum is on the
 * right.
 */
const Slider: FC<SliderProps> = ({
  className,
  thumbLabels,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) => {
  const messages = useMessages()
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
          aria-label={
            thumbLabels?.[index] ??
            thumbLabel(messages.slider, ariaLabel, index, thumbs.length)
          }
          aria-labelledby={ariaLabelledBy}
          className="block size-4 cursor-grab rounded-full border border-black-40 bg-white shadow-2 transition-colors focus-ring active:cursor-grabbing data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
        />
      ))}
    </SliderPrimitive.Root>
  )
}
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
