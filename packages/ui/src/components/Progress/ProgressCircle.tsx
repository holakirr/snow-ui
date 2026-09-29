'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentPropsWithoutRef, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import {
  RING_CIRCUMFERENCE,
  RingArc,
  RingCircle,
  type RingSize,
  ringSizeClasses,
  ringTurnClasses,
} from '../Spinner/ring'
import { normalizeProgress, type ProgressValueProps } from './value'

/** Diameter of the ProgressCircle in px: the kit's icon sizes. */
export type ProgressCircleSize = RingSize

/**
 * Props for the ProgressCircle component.
 */
export type ProgressCircleProps = Omit<
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'value' | 'max' | 'getValueLabel' | 'children'
> &
  ProgressValueProps & {
    /**
     * Diameter (px). The ring is an eighth of it wide, like the kit's
     * "Loading A" icon. A `size-*` class overrides it.
     * @default 24
     */
    size?: ProgressCircleSize
  }

/**
 * ProgressCircle is the circular Progress: the ring of the kit's "Loading A"
 * icon on a Black/10% track, filled clockwise from the top (in right-to-left
 * text too, like a clock). Without a value it turns like the Spinner, but it
 * stays a `role="progressbar"`. Colours: `--progress-fill` and
 * `--progress-track`, as on Progress.
 */
const ProgressCircle: FC<ProgressCircleProps> = ({
  value,
  max,
  getValueLabel,
  size = 24,
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
        'inline-flex shrink-0 [--progress-fill:var(--color-black)] [--progress-track:var(--color-black-10)]',
        ringSizeClasses[size],
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={twMerge('size-full', indeterminate && ringTurnClasses)}
      >
        <RingCircle className="stroke-(--progress-track)" />
        {indeterminate ? (
          <RingArc className="stroke-(--progress-fill)" />
        ) : (
          // Round caps would draw a dot at 0: no arc until there is progress.
          progress.fraction > 0 && (
            <RingCircle
              data-slot="progress-circle-value"
              strokeLinecap="round"
              strokeDasharray={`${progress.fraction * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
              // From 12 o'clock (a circle's stroke starts at 3 o'clock).
              transform="rotate(-90 12 12)"
              className="stroke-(--progress-fill) transition-[stroke-dasharray] duration-300 ease-out motion-reduce:transition-none"
            />
          )
        )}
      </svg>
    </ProgressPrimitive.Root>
  )
}
ProgressCircle.displayName = 'ProgressCircle'

export { ProgressCircle }
