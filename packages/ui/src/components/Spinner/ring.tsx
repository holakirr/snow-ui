import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/*
 * The ring of the kit's "Loading A" icon (LoadingAIcon): radius 9.5 and a
 * 3px stroke with round caps, in a 24px box. Spinner and ProgressCircle draw
 * it at any size. Internal: not exported from the package.
 */

export const RING_RADIUS = 9.5

/** About 59.7: the length of the ring, for stroke dashes. */
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/** Diameters in px: the kit's icon sizes. */
export type RingSize = 12 | 16 | 20 | 24 | 32 | 40 | 48

export const ringSizeClasses: { [K in RingSize]: string } = {
  12: 'size-3',
  16: 'size-4',
  20: 'size-5',
  24: 'size-6',
  32: 'size-8',
  40: 'size-10',
  48: 'size-12',
}

/**
 * The turn of the ring (on its `<svg>`). It stops for reduced motion, where
 * the arc pulses instead (`RingArc`).
 */
export const ringTurnClasses = 'animate-spinner-turn motion-reduce:animate-none'

/**
 * A circle of the ring, centred in the 24px box. `stroke` is the current
 * colour unless a `stroke-*` class sets it.
 */
export const RingCircle: FC<ComponentProps<'circle'>> = (props) => (
  <circle
    cx="12"
    cy="12"
    r={RING_RADIUS}
    stroke="currentColor"
    strokeWidth="3"
    {...props}
  />
)

/**
 * The spinning arc. At rest (animations off, e.g. in screenshots) it is 42
 * long, 70% of the ring, with the gap at the top end; it grows and shrinks
 * while it turns (`animate-spinner-arc`), and pulses its opacity for reduced
 * motion instead.
 */
export const RingArc: FC<{ className?: string }> = ({ className }) => (
  <RingCircle
    strokeLinecap="round"
    strokeDasharray="42 150"
    className={twMerge(
      'animate-spinner-arc motion-reduce:animate-pulse',
      className,
    )}
  />
)
