'use client'

import { type RefObject, useEffect, useRef } from 'react'

/**
 * Calls `onReset` when the form of `element` resets: `form.reset()`, a reset
 * button, or React 19 after a `<form action>`. The form is the element's own
 * (`element.form`, so a `form="id"` attribute on it counts), as Radix Select
 * does for its native `<select>`. `formId` re-subscribes when it changes.
 */
export const useFormReset = (
  elementRef: RefObject<HTMLInputElement | HTMLButtonElement | null>,
  onReset: () => void,
  formId?: string,
) => {
  const handler = useRef(onReset)
  useEffect(() => {
    handler.current = onReset
  })
  // biome-ignore lint/correctness/useExhaustiveDependencies: `formId` changes the element's form, which the effect reads from the DOM
  useEffect(() => {
    const form = elementRef.current?.form
    if (!form) return
    const handleReset = () => handler.current()
    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [elementRef, formId])
}

type RequiredProxyProps = {
  /** Empty while the field has no value: then the form won't submit. */
  value: string
  form?: string
  disabled?: boolean
  /** Where the browser's focus on an invalid field goes (the real control). */
  focusTarget: RefObject<HTMLElement | null>
}

/**
 * Makes a field whose control can't be validated (a `<button>` trigger)
 * take part in native constraint validation: a `required` input, invisible,
 * under the field and hidden from assistive technology. While `value` is
 * empty the form doesn't submit; when the browser focuses it to report that,
 * the focus moves to `focusTarget`. The parent must be `position: relative`.
 */
export const RequiredProxy = ({
  value,
  form,
  disabled,
  focusTarget,
}: RequiredProxyProps) => (
  <input
    aria-hidden
    tabIndex={-1}
    required
    autoComplete="off"
    value={value}
    // Controlled and never edited; `readOnly` would opt out of validation.
    onChange={() => {}}
    onFocus={() => focusTarget.current?.focus()}
    form={form}
    disabled={disabled}
    data-slot="required-proxy"
    className="pointer-events-none absolute inset-0 size-full opacity-0"
  />
)
