'use client'

import { type FormEventHandler, type RefObject, useEffect, useRef } from 'react'

/**
 * Calls `onReset` when the form of `element` resets: `form.reset()`, a reset
 * button, or React 19 after a `<form action>`. The form is the element's own
 * (`element.form`, so a `form="id"` attribute on it counts), as Radix Select
 * does for its native `<select>`. `formId` re-subscribes when it changes.
 * A reset cancelled with `preventDefault()` (in `onReset`) resets nothing.
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
    // After the event has reached every listener, React's `onReset` (at
    // the root) included: a cancelled reset doesn't reset the form.
    const handleReset = (event: Event) =>
      queueMicrotask(() => {
        if (!event.defaultPrevented) handler.current()
      })
    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [elementRef, formId])
}

/**
 * Makes `message` the element's custom validity (the form doesn't submit)
 * while it isn't empty, and clears only the message it set itself: one the
 * app sets through the ref (a server error, react-hook-form's native
 * validation) stays.
 */
export const useCustomValidity = (
  elementRef: RefObject<HTMLInputElement | null>,
  message: string,
) => {
  const ours = useRef('')
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    if (message) {
      element.setCustomValidity(message)
      ours.current = message
    } else if (ours.current) {
      // Unless the app has set its own since (a disabled or read-only
      // element reports no message: then it's cleared).
      if (!element.willValidate || element.validationMessage === ours.current) {
        element.setCustomValidity('')
      }
      ours.current = ''
    }
  }, [elementRef, message])
}

type RequiredProxyProps = {
  /** Empty while the field has no value: then the form won't submit. */
  value: string
  form?: string
  disabled?: boolean
  /** Where the browser's focus on an invalid field goes (the real control). */
  focusTarget: RefObject<HTMLElement | null>
  /** The field's `onInvalid`: the `invalid` event fires on this input. */
  onInvalid?: FormEventHandler<HTMLElement>
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
  onInvalid,
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
    onInvalid={onInvalid}
    form={form}
    disabled={disabled}
    data-slot="required-proxy"
    // 16px, so iOS doesn't zoom in when the browser focuses it.
    className="pointer-events-none absolute inset-0 size-full text-[16px] opacity-0"
  />
)
