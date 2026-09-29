import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
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
    expect(input).toHaveAttribute(
      'aria-describedby',
      `${screen.getByText('Work email.').id} ${message.id}`,
    )
  })

  it('announces the error: the message is an alert', () => {
    render(<PlainField error="Email is required" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Email is required')
  })

  it('only points aria-describedby at the parts that are rendered', () => {
    const { rerender } = render(
      <Core.FormItem>
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <Core.FormMessage />
      </Core.FormItem>,
    )
    const input = screen.getByLabelText('Email')

    // No description, and no message without an error.
    expect(input).not.toHaveAttribute('aria-describedby')

    rerender(
      <Core.FormItem error="Email is required">
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <Core.FormMessage />
      </Core.FormItem>,
    )

    expect(input).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('alert').id,
    )
  })

  it('follows a description that its own component shows and hides', async () => {
    let toggle = () => {}
    const Hint = () => {
      const [shown, setShown] = useState(false)
      toggle = () => setShown((value) => !value)
      return shown ? (
        <Core.FormDescription>Work email.</Core.FormDescription>
      ) : null
    }
    render(
      <Core.FormItem>
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <Hint />
      </Core.FormItem>,
    )
    const input = screen.getByLabelText('Email')
    expect(input).not.toHaveAttribute('aria-describedby')

    // Only the Hint re-renders, so the item sees the change in its DOM.
    await act(async () => toggle())
    expect(input).toHaveAttribute(
      'aria-describedby',
      screen.getByText('Work email.').id,
    )

    await act(async () => toggle())
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('counts your own parts that use the ids of useFormField', () => {
    const Hint = () => {
      const { formDescriptionId } = Core.useFormField()
      return <span id={formDescriptionId}>Work email.</span>
    }
    render(
      <Core.FormItem>
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <Hint />
      </Core.FormItem>,
    )

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Work email.',
    )
  })

  it('forwards the refs of the item, the control and the texts', () => {
    const item = createRef<HTMLDivElement>()
    const control = createRef<HTMLElement>()
    const description = createRef<HTMLParagraphElement>()
    const message = createRef<HTMLParagraphElement>()
    const form = createRef<HTMLFormElement>()
    render(
      <Core.Form ref={form}>
        <Core.FormItem ref={item} error="Required">
          <Core.FormControl ref={control}>
            <input />
          </Core.FormControl>
          <Core.FormDescription ref={description}>Hint</Core.FormDescription>
          <Core.FormMessage ref={message} />
        </Core.FormItem>
      </Core.Form>,
    )

    expect(form.current).toBeInstanceOf(HTMLFormElement)
    expect(item.current).toBeInstanceOf(HTMLDivElement)
    expect(control.current).toBeInstanceOf(HTMLInputElement)
    expect(description.current).toHaveTextContent('Hint')
    expect(message.current).toHaveTextContent('Required')
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
