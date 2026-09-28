'use client'

import { Slot } from '@radix-ui/react-slot'
import {
  type ComponentPropsWithoutRef,
  createContext,
  type FC,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useId,
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
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

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
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}

type FormProps = FormHTMLAttributes<HTMLFormElement>

const Form: FC<FormProps> = (props) => <form {...props} />

Form.displayName = 'Form'

type FormItemProps = HTMLAttributes<HTMLDivElement> & FormFieldStateValue

const FormItem: FC<FormItemProps> = ({
  className,
  name,
  error,
  invalid,
  ...props
}) => {
  const id = useId()
  const fieldState = useContext(FormFieldStateContext)

  return (
    <FormItemContext.Provider
      value={{
        id,
        name: name ?? fieldState.name,
        error: error ?? fieldState.error,
        invalid: invalid ?? fieldState.invalid,
      }}
    >
      <div className={twMerge('relative space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

FormItem.displayName = 'FormItem'

const FormLabel: FC<LabelProps> = ({ className, ...props }) => {
  const { invalid, formItemId } = useFormField()

  return (
    <Label
      className={twMerge(invalid && 'text-red', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

FormLabel.displayName = 'FormLabel'

const FormControl: FC<ComponentPropsWithoutRef<typeof Slot>> = ({
  ...props
}) => {
  const { invalid, formItemId, formDescriptionId, formMessageId } =
    useFormField()

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !invalid
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={invalid}
      {...props}
    />
  )
}

FormControl.displayName = 'FormControl'

type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>

const FormDescription: FC<FormDescriptionProps> = ({ className, ...props }) => {
  const { formDescriptionId } = useFormField()

  return (
    <Typography
      as="p"
      id={formDescriptionId}
      className={twMerge('text-12 text-black-40', className)}
      {...props}
    />
  )
}

FormDescription.displayName = 'FormDescription'

type FormMessageProps = HTMLAttributes<HTMLParagraphElement>

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
    <Typography
      as="p"
      id={formMessageId}
      className={twMerge('text-12 text-red', className)}
      {...props}
    >
      {body}
    </Typography>
  )
}

FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormControl,
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
