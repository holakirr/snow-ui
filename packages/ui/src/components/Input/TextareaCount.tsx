'use client'

import { useComposedRefs } from '@radix-ui/react-compose-refs'
import {
  type ChangeEvent,
  type ComponentProps,
  type FC,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'

type TextareaWithCountProps = ComponentProps<'textarea'> & {
  containerClassName?: string
}

/** The number of characters of a textarea value, as `maxLength` counts them. */
const lengthOf = (value: ComponentProps<'textarea'>['value']) =>
  value == null ? 0 : String(value).length

/**
 * A `Textarea` with the Figma counter: "12/200" in the bottom-end corner,
 * next to the resize handle. The field is described by "12 of 200
 * characters" (`messages.textarea.count`), which screen readers read with it
 * on focus instead of announcing every keystroke. The visible counter is
 * `aria-hidden`.
 */
const TextareaWithCount: FC<TextareaWithCountProps> = ({
  containerClassName,
  value,
  defaultValue,
  onChange,
  maxLength,
  ref,
  'aria-describedby': describedBy,
  ...props
}) => {
  const messages = useMessages()
  const countId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const setRef = useComposedRefs(textareaRef, ref)
  // `value={null}` leaves the field uncontrolled, as React does.
  const controlled = value != null
  const limit = maxLength ?? undefined
  const [ownLength, setOwnLength] = useState(() => lengthOf(defaultValue))
  const length = controlled ? lengthOf(value) : ownLength

  // An uncontrolled value can also change without `onChange`: a new
  // `defaultValue` of a field the user hasn't edited, a value the browser
  // restores, or a reset of its form. (One set through the element's
  // `value` from code isn't seen: control the field for that.)
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-read when `defaultValue` changes
  useEffect(() => {
    const textarea = textareaRef.current
    if (controlled || !textarea) return
    setOwnLength(textarea.value.length)
    const { form } = textarea
    // `reset` fires before the form restores its fields' default values, so
    // the count is set to what it will restore, at once (inside the event,
    // so tests don't need act()).
    const handleReset = () => setOwnLength(textarea.defaultValue.length)
    form?.addEventListener('reset', handleReset)
    return () => form?.removeEventListener('reset', handleReset)
  }, [controlled, defaultValue])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!controlled) setOwnLength(event.target.value.length)
    onChange?.(event)
  }

  return (
    <div
      className={twMerge('relative w-full', containerClassName)}
      data-slot="textarea-field"
    >
      <textarea
        ref={setRef}
        value={value}
        defaultValue={defaultValue}
        maxLength={limit}
        aria-describedby={[describedBy, countId].filter(Boolean).join(' ')}
        onChange={handleChange}
        {...props}
      />
      {/* Figma: "0/200" 12/16 in Black/20% (1.6:1), 4px from the bottom and
          20px from the end (the resize handle is in the corner);
          `text-secondary` here, Black/20% like the text when disabled.
          Digits read left to right. */}
      <span
        aria-hidden
        dir="ltr"
        className="pointer-events-none absolute end-5 bottom-1 text-12 text-secondary tabular-nums peer-disabled:text-black-20"
        data-slot="textarea-count"
      >
        {limit === undefined ? length : `${length}/${limit}`}
      </span>
      <span id={countId} hidden>
        {messages.textarea.count(length, limit)}
      </span>
    </div>
  )
}

TextareaWithCount.displayName = 'TextareaWithCount'

export { TextareaWithCount, type TextareaWithCountProps }
