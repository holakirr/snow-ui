import { act, fireEvent, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../react-hook-form'
import { Input } from '../Input'
import * as Core from './Form'

type Values = { username: string }

const TestForm = () => {
  const form = useForm<Values>({ defaultValues: { username: '' } })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          rules={{ required: 'Username is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Your public name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

const PlainField = ({ error }: { error?: string }) => (
  <Core.Form>
    <Core.FormItem error={error}>
      <Core.FormLabel>Email</Core.FormLabel>
      <Core.FormControl>
        <input />
      </Core.FormControl>
      <Core.FormDescription>Work email.</Core.FormDescription>
      <Core.FormMessage />
    </Core.FormItem>
  </Core.Form>
)

describe('Form (library-agnostic)', () => {
  it('is valid without an error', () => {
    render(<PlainField />)

    const input = screen.getByLabelText('Email')

    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).toHaveAttribute(
      'aria-describedby',
      screen.getByText('Work email.').id,
    )
  })

  it('shows the error passed via props', () => {
    render(<PlainField error="Email is required" />)

    const message = screen.getByText('Email is required')
    const input = screen.getByLabelText('Email')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toContain(message.id)
  })
})

describe('Form (react-hook-form adapter)', () => {
  it('links the control to its label and description', () => {
    render(<TestForm />)

    const input = screen.getByLabelText('Username')
    const description = screen.getByText('Your public name.')

    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).toHaveAttribute('aria-describedby', description.id)
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument()
  })

  it('renders the error message and marks the control invalid', async () => {
    render(<TestForm />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    })

    const message = await screen.findByText('Username is required')
    const input = screen.getByLabelText('Username')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toContain(message.id)
  })
})
