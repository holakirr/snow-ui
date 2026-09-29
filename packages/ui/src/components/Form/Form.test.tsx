import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef, StrictMode, useState } from 'react'
import { createPortal } from 'react-dom'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

describe('Form describedby and messages', () => {
  afterEach(() => vi.restoreAllMocks())

  const Field = ({ error }: { error?: string }) => (
    <Core.FormItem error={error}>
      <Core.FormLabel>Email</Core.FormLabel>
      <Core.FormControl>
        <input />
      </Core.FormControl>
      <div>
        <Core.FormDescription>Work email.</Core.FormDescription>
      </div>
      <Core.FormMessage />
    </Core.FormItem>
  )

  it('renders aria-describedby on the server and hydrates without a mismatch', async () => {
    const html = renderToString(<Field error="Bad" />)
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const [description, message] = container.querySelectorAll('p')
    const input = container.querySelector('input')

    // Without JavaScript (or before hydration) the field is described.
    expect(input).toHaveAttribute(
      'aria-describedby',
      `${description.id} ${message.id}`,
    )

    const errors: unknown[] = []
    await act(async () => {
      hydrateRoot(container, <Field error="Bad" />, {
        onRecoverableError: (error) => errors.push(error),
      })
    })

    expect(errors).toEqual([])
    expect(input).toHaveAccessibleDescription('Work email. Bad')
    container.remove()
  })

  it('leaves the message out of the server HTML without an error', () => {
    const html = renderToString(<Field />)

    expect(html).toMatch(/aria-describedby="[^" ]+-description"/)
  })

  it("doesn't warn about act() when a part comes and goes on its own", () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    let toggle = () => {}
    const Hint = () => {
      const [shown, setShown] = useState(false)
      toggle = () => setShown((value) => !value)
      return shown ? <Core.FormMessage>Oops</Core.FormMessage> : null
    }
    render(
      <Core.FormItem error={true}>
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <Hint />
      </Core.FormItem>,
    )
    const input = screen.getByLabelText('Email')

    act(() => toggle())
    expect(input).toHaveAccessibleDescription('Oops')
    act(() => toggle())
    expect(input).not.toHaveAttribute('aria-describedby')

    return new Promise<void>((resolve) =>
      setTimeout(() => {
        // The MutationObserver finds nothing new, so it doesn't set state.
        expect(
          error.mock.calls.filter(([text]) => String(text).includes('act(')),
        ).toEqual([])
        resolve()
      }),
    )
  })

  it('counts a description rendered in a portal', () => {
    const InPortal = () =>
      createPortal(
        <Core.FormDescription>In a popover.</Core.FormDescription>,
        document.body,
      )
    render(
      <Core.FormItem>
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <InPortal />
      </Core.FormItem>,
    )

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'In a popover.',
    )
  })

  it('notices your own part when it gets the id later', async () => {
    let setShown = (_: boolean) => {}
    const Hint = () => {
      const { formDescriptionId } = Core.useFormField()
      const [shown, set] = useState(false)
      setShown = set
      return <span id={shown ? formDescriptionId : undefined}>Work email.</span>
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

    // Only the Hint re-renders: the item sees the new id attribute.
    await act(async () => setShown(true))

    expect(input).toHaveAccessibleDescription('Work email.')
  })

  it('keeps the parts in StrictMode', async () => {
    let toggle = () => {}
    const Hint = () => {
      const [shown, setShown] = useState(true)
      toggle = () => setShown((value) => !value)
      return shown ? <Core.FormDescription>Hint.</Core.FormDescription> : null
    }
    render(
      <StrictMode>
        <Core.FormItem>
          <Core.FormControl>
            <input aria-label="Email" />
          </Core.FormControl>
          <Hint />
        </Core.FormItem>
      </StrictMode>,
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAccessibleDescription('Hint.')

    await act(async () => toggle())
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('is an alert only while the field is invalid', () => {
    const { rerender } = render(
      <Core.FormItem>
        <Core.FormMessage>Letters and digits only.</Core.FormMessage>
      </Core.FormItem>,
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('Letters and digits only.')).not.toHaveAttribute(
      'role',
    )

    rerender(
      <Core.FormItem invalid>
        <Core.FormMessage>Letters and digits only.</Core.FormMessage>
      </Core.FormItem>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Letters and digits only.',
    )
  })

  it('points at the parts by their own id', () => {
    render(
      <Core.FormItem error="Bad">
        <Core.FormControl>
          <input aria-label="Email" />
        </Core.FormControl>
        <Core.FormDescription id="email-hint">Work email.</Core.FormDescription>
        <Core.FormMessage id="email-error" />
      </Core.FormItem>,
    )

    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-describedby',
      'email-hint email-error',
    )
  })

  it('adds the parts to an aria-describedby of the control or its child', () => {
    render(
      <>
        <span id="format">Format: name@company.</span>
        <span id="note">Visible to admins.</span>
        <Core.FormItem error="Bad">
          <Core.FormControl aria-describedby="format">
            <input aria-label="Email" aria-describedby="note" />
          </Core.FormControl>
          <Core.FormDescription>Work email.</Core.FormDescription>
          <Core.FormMessage />
        </Core.FormItem>
      </>,
    )

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Format: name@company. Visible to admins. Work email. Bad',
    )
  })
})
