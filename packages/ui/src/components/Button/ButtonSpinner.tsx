'use client'

import { type FC, useEffect, useRef } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { LoadingRing, type RingSize, ringSizeClasses } from '../Spinner/ring'

/** Cancels the click and keeps it from the button's handlers. */
const cancel = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * The spinner of a loading Button, over the middle of its (invisible)
 * content: Spinner's ring, which pulses instead of turning with reduced
 * motion. It is hidden from assistive technology, without Spinner's
 * "Loading" status: the button says it is busy (`aria-busy`).
 *
 * It also makes the button inert without `disabled`, which would drop the
 * keyboard focus: a capture listener on the button (the closest element
 * with `data-loading`, the child with `asChild`) cancels every click, from
 * the pointer, Enter or Space, before React runs `onClick`, so it doesn't
 * submit a form or follow a link either. A listener, rather than an
 * `onClickCapture` prop, keeps `Button` a component a React Server
 * Component can render: it passes no function to the element.
 */
export const ButtonSpinner: FC<{ size: RingSize }> = ({ size }) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const button = ref.current?.parentElement?.closest('[data-loading]')
    if (!button) return
    button.addEventListener('click', cancel, true)
    return () => button.removeEventListener('click', cancel, true)
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      data-button-spinner=""
      className={twMerge('absolute inset-0 m-auto flex', ringSizeClasses[size])}
    >
      <LoadingRing className="size-full" />
    </span>
  )
}
