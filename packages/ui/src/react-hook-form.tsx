'use client'

// Optional react-hook-form adapter: `import { Form, FormField } from '@holakirr/snow-ui/react-hook-form'`.
// The main entry has no react-hook-form dependency.
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
} from 'react-hook-form'

import { FormFieldState } from './components/Form'

const Form = FormProvider

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  render,
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <Controller
    {...props}
    render={(renderProps) => (
      <FormFieldState
        value={{
          name: props.name,
          error: renderProps.fieldState.error?.message,
          invalid: renderProps.fieldState.invalid,
        }}
      >
        {render(renderProps)}
      </FormFieldState>
    )}
  />
)

export {
  FormControl,
  FormDescription,
  type FormDescriptionProps,
  FormItem,
  type FormItemProps,
  FormLabel,
  FormMessage,
  type FormMessageProps,
  useFormField,
} from './components/Form'
export { Form, FormField }
