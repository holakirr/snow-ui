'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import type { StripThickness } from '../Strip'
import { normalizeProgress, type ProgressValueProps } from './value'

/** Height of the Progress bar (px): the Strip's thicknesses. */
export type ProgressThickness = StripThickness

const thicknessClasses: { [K in ProgressThickness]: string } = {
  2: 'h-0.5',
  4: 'h-1',
  6: 'h-1.5',
  8: 'h-2',
}

/**
 * Props for the Progress component.
 */
export type ProgressProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Root>,
  'value' | 'max' | 'getValueLabel' | 'children'
> &
  ProgressValueProps & {
    /**
     * Height of the bar (px).
     * @default 4
     */
    thickness?: ProgressThickness
  }

/**
 * Progress is a linear progress bar: how much of a task is done (`value` of
 * `max`), or, without a value, that it is running. It is the continuous
 * sibling of the Figma "Strip": a Black/100% fill on a Black/10% track with
 * rounded ends, and the Strip's thicknesses. Built on Radix Progress: a
 * `role="progressbar"` with its value read out as a percentage.
 *
 * The colours are the `--progress-fill` and `--progress-track` custom
 * properties: `className="[--progress-fill:var(--color-indigo-text)]"`.
 */
const Progress: FC<ProgressProps> = ({
  value,
  max,
  getValueLabel,
  thickness = 4,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) => {
  const messages = useMessages()
  const progress = normalizeProgress(value, max)
  const indeterminate = progress.value === null

  return (
    <ProgressPrimitive.Root
      value={progress.value}
      max={progress.max}
      getValueLabel={getValueLabel ?? messages.progress.value}
      aria-label={
        ariaLabel ?? (ariaLabelledBy ? undefined : messages.progress.label)
      }
      aria-labelledby={ariaLabelledBy}
      className={twMerge(
        // Strip: filled segments Black/100%, empty ones Black/10%.
        'relative w-full shrink-0 overflow-hidden rounded-full bg-(--progress-track) [--progress-fill:var(--color-black)] [--progress-track:var(--color-black-10)] rtl:[--progress-direction:-1]',
        thicknessClasses[thickness],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={twMerge(
          'h-full rounded-full bg-(--progress-fill)',
          indeterminate
            ? // A 40% bar that crosses the track from the start side; for
              // reduced motion a full bar that pulses instead.
              'absolute inset-y-0 start-0 w-2/5 animate-progress-indeterminate motion-reduce:w-full motion-reduce:animate-pulse'
            : 'transition-[width] duration-300 ease-out motion-reduce:transition-none',
        )}
        // A width (not a transform), so the bar grows from the start side in
        // right-to-left text too and its rounded end isn't squashed.
        style={
          indeterminate ? undefined : { width: `${progress.fraction * 100}%` }
        }
      />
    </ProgressPrimitive.Root>
  )
}
Progress.displayName = 'Progress'

export { Progress }
