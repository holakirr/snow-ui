'use client'

import { Slot } from '@radix-ui/react-slot'
import {
  type ComponentPropsWithoutRef,
  createContext,
  type FC,
  type HTMLAttributes,
  useContext,
  useId,
} from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { Label, type LabelProps } from '../Label'
import { Text } from '../Text'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
)

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

type FormItemProps = HTMLAttributes<HTMLDivElement>

const FormItem: FC<FormItemProps> = ({ className, ...props }) => {
  const id = useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={twMerge('relative space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

FormItem.displayName = 'FormItem'

const FormLabel: FC<LabelProps> = ({ className, ...props }) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      className={twMerge(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

FormLabel.displayName = 'FormLabel'

const FormControl: FC<ComponentPropsWithoutRef<typeof Slot>> = ({
  ...props
}) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

FormControl.displayName = 'FormControl'

type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>

const FormDescription: FC<FormDescriptionProps> = ({ className, ...props }) => {
  const { formDescriptionId } = useFormField()

  return (
    <Text
      as="p"
      id={formDescriptionId}
      className={twMerge('text-base text-black/40', className)}
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
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <Text
      as="p"
      id={formMessageId}
      className={twMerge('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </Text>
  )
}

FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
