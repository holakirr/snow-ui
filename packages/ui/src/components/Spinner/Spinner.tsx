'use client'

import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import { LoadingRing, type RingSize, ringSizeClasses } from './ring'

/** Diameter of the Spinner in px: the kit's icon sizes. */
export type SpinnerSize = RingSize

/**
 * Props for the Spinner component.
 */
export type SpinnerProps = Omit<ComponentProps<'span'>, 'children'> & {
  /**
   * Diameter (px). A `size-*` class overrides it.
   * @default 20
   */
  size?: SpinnerSize

  /**
   * Screen-reader text.
   * @default messages.spinner.label: "Loading"
   */
  label?: string
}

/**
 * Spinner shows that something is loading when how long it takes is unknown:
 * the ring of the kit's "Loading A" icon, turning in the current text colour.
 * It is a `role="status"` region with visually hidden text ("Loading"). For
 * reduced motion the ring stops turning and pulses instead.
 */
const Spinner: FC<SpinnerProps> = ({
  size = 20,
  label,
  className,
  ...props
}) => {
  const messages = useMessages()

  return (
    <span
      role="status"
      className={twMerge(
        'inline-flex shrink-0',
        ringSizeClasses[size],
        className,
      )}
      {...props}
    >
      <LoadingRing className="size-full" />
      <span className="sr-only">{label ?? messages.spinner.label}</span>
    </span>
  )
}
Spinner.displayName = 'Spinner'

export { Spinner }
