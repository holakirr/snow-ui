import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '../../react-hook-form'
import { Button } from '../Button'
import { Input } from '../Input'
import * as Plain from './Form'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

const FormExample = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: 'Username',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="snow-ui" title="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="filled" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

const meta: Meta = {
  title: 'Components/Form',
  component: FormExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const PlainFormExample = () => {
  const [error, setError] = useState<string>()

  return (
    <Plain.Form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault()
        const value = new FormData(event.currentTarget).get('email')
        setError(
          String(value).includes('@') ? undefined : 'Enter a valid email.',
        )
      }}
    >
      <Plain.FormItem error={error}>
        <Plain.FormControl>
          <Input name="email" title="Email" />
        </Plain.FormControl>
        <Plain.FormDescription>No form library needed.</Plain.FormDescription>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Button variant="filled" type="submit">
        Submit
      </Button>
    </Plain.Form>
  )
}

export const WithoutFormLibrary: Story = {
  render: () => <PlainFormExample />,
}
