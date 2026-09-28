import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { expect, waitFor } from 'storybook/test'
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

export const Default: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const field = canvas.getByLabelText('Username')
    const message = 'Username must be at least 2 characters.'

    await step('an invalid value shows the message on submit', async () => {
      await userEvent.clear(field)
      await userEvent.type(field, 'a')
      await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
      await expect(await canvas.findByText(message)).toBeVisible()
      await expect(field).toHaveAttribute('aria-invalid', 'true')
      await expect(field).toHaveAccessibleDescription(
        expect.stringContaining(message),
      )
      await expect(field).toHaveFocus()
    })

    await step('a valid value clears it', async () => {
      await userEvent.type(field, 'b')
      await waitFor(() =>
        expect(canvas.queryByText(message)).not.toBeInTheDocument(),
      )
      await expect(field).toHaveAttribute('aria-invalid', 'false')
      await expect(field).toHaveAccessibleDescription(
        'This is your public display name.',
      )
    })
  },
}

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
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByLabelText('Email')

    await userEvent.type(field, 'nope')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(await canvas.findByText('Enter a valid email.')).toBeVisible()
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await expect(field).toHaveAccessibleDescription(
      expect.stringContaining('Enter a valid email.'),
    )

    await userEvent.type(field, '@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(
        canvas.queryByText('Enter a valid email.'),
      ).not.toBeInTheDocument(),
    )
  },
}
