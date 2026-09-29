'use client'

import { useComposedRefs } from '@radix-ui/react-compose-refs'
import { Slot } from '@radix-ui/react-slot'
import {
  type ComponentProps,
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'

import { Label, type LabelProps } from '../Label'
import { Typography } from '../Text'

/**
 * Validation state of a single field. Form components are library-agnostic:
 * pass the state via `FormItem` props, or provide it with `FormFieldState`
 * (this is how adapters such as `@holakirr/snow-ui/react-hook-form` work).
 */
type FormFieldStateValue = {
  name?: string
  /** Error message; a truthy value also marks the field invalid */
  error?: ReactNode
  invalid?: boolean
}

const FormFieldStateContext = createContext<FormFieldStateValue>({})

const FormFieldState = FormFieldStateContext.Provider

type FormItemContextValue = FormFieldStateValue & {
  id: string
  /** The ids of the rendered description and message, for `FormControl`. */
  describedBy?: string
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

const formFieldIds = (id: string) => ({
  formItemId: `${id}-form-item`,
  formDescriptionId: `${id}-form-item-description`,
  formMessageId: `${id}-form-item-message`,
})

/**
 * The ones of `ids` whose element is rendered inside `item`, space-separated
 * (an `aria-describedby` value), or `undefined` when none is.
 */
const renderedIds = (item: HTMLElement, ids: string[]) => {
  const rendered = new Set(
    Array.from(item.querySelectorAll('[id]'), (element) => element.id),
  )
  return ids.filter((id) => rendered.has(id)).join(' ') || undefined
}

const useFormField = () => {
  const itemContext = useContext(FormItemContext)

  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>')
  }

  const { id, name, error, invalid } = itemContext

  return {
    id,
    name,
    error,
    invalid: invalid ?? Boolean(error),
    ...formFieldIds(id),
  }
}

type FormProps = ComponentProps<'form'>

const Form: FC<FormProps> = (props) => <form {...props} />

Form.displayName = 'Form'

type FormItemProps = ComponentProps<'div'> & FormFieldStateValue

const FormItem: FC<FormItemProps> = ({
  className,
  name,
  error,
  invalid,
  ref,
  ...props
}) => {
  const id = useId()
  const fieldState = useContext(FormFieldStateContext)
  const itemRef = useRef<HTMLDivElement>(null)
  const setRef = useComposedRefs(itemRef, ref)
  const [describedBy, setDescribedBy] = useState<string>()
  const { formDescriptionId, formMessageId } = formFieldIds(id)

  // `aria-describedby` only lists the parts that are rendered: the
  // description and the message (ours, or your own with the ids of
  // `useFormField()`) come and go with the field's state. Checked after
  // every render, before paint, and when the item's children change on
  // their own.
  useLayoutEffect(() => {
    if (itemRef.current) {
      setDescribedBy(
        renderedIds(itemRef.current, [formDescriptionId, formMessageId]),
      )
    }
  })
  useLayoutEffect(() => {
    const item = itemRef.current
    if (!item || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(() =>
      setDescribedBy(renderedIds(item, [formDescriptionId, formMessageId])),
    )
    observer.observe(item, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [formDescriptionId, formMessageId])

  return (
    <FormItemContext.Provider
      value={{
        id,
        name: name ?? fieldState.name,
        error: error ?? fieldState.error,
        invalid: invalid ?? fieldState.invalid,
        describedBy,
      }}
    >
      <div
        ref={setRef}
        className={twMerge('relative space-y-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

FormItem.displayName = 'FormItem'

const FormLabel: FC<LabelProps> = ({ className, ...props }) => {
  const { invalid, formItemId } = useFormField()

  return (
    <Label
      className={twMerge(invalid && 'text-red-text', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

FormLabel.displayName = 'FormLabel'

type FormControlProps = ComponentProps<typeof Slot>

/**
 * Gives its only child the item's id, `aria-invalid`, and an
 * `aria-describedby` with the ids of the rendered `FormDescription` and
 * `FormMessage` (none when neither is rendered).
 */
const FormControl: FC<FormControlProps> = (props) => {
  const { invalid, formItemId } = useFormField()
  const describedBy = useContext(FormItemContext)?.describedBy

  return (
    <Slot
      id={formItemId}
      aria-describedby={describedBy}
      aria-invalid={invalid}
      {...props}
    />
  )
}

FormControl.displayName = 'FormControl'

type FormDescriptionProps = ComponentProps<'p'>

const FormDescription: FC<FormDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  const { formDescriptionId } = useFormField()

  return (
    <Typography
      asChild
      className={twMerge('text-12 text-secondary', className)}
    >
      <p id={formDescriptionId} {...props}>
        {children}
      </p>
    </Typography>
  )
}

FormDescription.displayName = 'FormDescription'

type FormMessageProps = ComponentProps<'p'>

/**
 * The field's error (or `children` without one), in `red-text`. It is an
 * alert (WCAG technique ARIA19), so screen readers announce it when it
 * appears; pass `role="status"` for a polite announcement.
 */
const FormMessage: FC<FormMessageProps> = ({
  className,
  children,
  ...props
}) => {
  const { error, formMessageId } = useFormField()
  const body = error && error !== true ? error : children

  if (!body) {
    return null
  }

  return (
    <Typography asChild className={twMerge('text-12 text-red-text', className)}>
      <p id={formMessageId} role="alert" {...props}>
        {body}
      </p>
    </Typography>
  )
}

FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormControl,
  type FormControlProps,
  FormDescription,
  type FormDescriptionProps,
  FormFieldState,
  type FormFieldStateValue,
  FormItem,
  type FormItemProps,
  FormLabel,
  FormMessage,
  type FormMessageProps,
  type FormProps,
  useFormField,
}
