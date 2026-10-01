import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { Form, FormControl, FormField, FormItem } from '../../react-hook-form'
import { SnowUIProvider } from '../SnowUIProvider'

import { Input } from './Input'

describe('Input', () => {
  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()

    render(<Input ref={ref} aria-label="name" />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('works as an uncontrolled input', () => {
    const onChange = vi.fn()

    render(<Input defaultValue="foo" onChange={onChange} aria-label="name" />)

    const input = screen.getByRole<HTMLInputElement>('textbox')
    expect(input.value).toBe('foo')

    fireEvent.change(input, { target: { value: 'bar' } })

    expect(input.value).toBe('bar')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('works as a controlled input', () => {
    const Controlled = () => {
      const [value, setValue] = useState('foo')
      return (
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value.toUpperCase())}
          aria-label="name"
        />
      )
    }

    render(<Controlled />)

    const input = screen.getByRole<HTMLInputElement>('textbox')
    expect(input.value).toBe('foo')

    fireEvent.change(input, { target: { value: 'bar' } })

    expect(input.value).toBe('BAR')
  })

  it('keeps a controlled value when the parent ignores changes', () => {
    render(<Input value="fixed" onChange={() => {}} aria-label="name" />)

    const input = screen.getByRole<HTMLInputElement>('textbox')
    fireEvent.change(input, { target: { value: 'other' } })

    expect(input.value).toBe('fixed')
  })

  it('renders the static title as a label above the value', () => {
    render(<Input id="email" title="Email" placeholder="you@example.com" />)

    const input = screen.getByRole('textbox')
    const title = screen.getByText('Email')

    expect(screen.getByLabelText('Email')).toBe(input)
    // The title stays in place and the placeholder stays visible.
    expect(title.compareDocumentPosition(input)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(title).toHaveClass('text-12', 'text-secondary')
    expect(input).toHaveAttribute('placeholder', 'you@example.com')
  })

  it('links the title to the input without an id', () => {
    render(<Input title="Email" />)

    expect(screen.getByLabelText('Email')).toBe(screen.getByRole('textbox'))
  })

  it('renders start and end content around the value', () => {
    render(
      <Input
        aria-label="search"
        startContent={<span>start</span>}
        endContent={<button type="button">clear</button>}
      />,
    )

    const input = screen.getByRole('textbox')
    const start = screen.getByText('start')
    const end = screen.getByRole('button', { name: 'clear' })

    expect(start.compareDocumentPosition(input)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(end.compareDocumentPosition(input)).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    )
  })

  it('styles the field with className and the input with inputClassName', () => {
    render(
      <Input aria-label="name" className="w-40" inputClassName="uppercase" />,
    )

    const input = screen.getByRole('textbox')
    const field = input.closest('[data-slot="input"]')

    expect(field).toHaveClass('w-40', 'rounded-16', 'px-4', 'py-3', 'text-14')
    expect(field).toHaveClass('inset-ring-[0.5px]', 'inset-ring-control-border')
    expect(input).toHaveClass('uppercase')
  })

  it('focuses the input when the field padding is clicked', () => {
    render(<Input aria-label="name" endContent={<span>icon</span>} />)

    fireEvent.pointerDown(screen.getByText('icon'))

    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('renders the Static state for read-only inputs', () => {
    render(<Input aria-label="name" defaultValue="foo" readOnly />)

    const input = screen.getByRole('textbox')
    const field = input.closest('[data-slot="input"]')

    expect(input).toHaveAttribute('readonly')
    expect(field).toHaveAttribute('data-static', 'true')
    expect(field).toHaveClass('hover:inset-ring-control-border')
  })

  it('renders the disabled state', () => {
    render(<Input aria-label="name" disabled />)

    const input = screen.getByRole('textbox')
    const field = input.closest('[data-slot="input"]')

    expect(input).toBeDisabled()
    expect(field).toHaveAttribute('data-disabled', 'true')
    expect(field).toHaveClass('bg-black-4', 'text-black-20')

    fireEvent.pointerDown(field as Element)
    expect(input).not.toHaveFocus()
  })

  it('puts style on the field and inputStyle on the input', () => {
    render(
      <Input
        aria-label="name"
        style={{ width: 200 }}
        inputStyle={{ letterSpacing: 2 }}
      />,
    )

    const input = screen.getByRole('textbox')
    const field = input.closest('[data-slot="input"]') as HTMLElement

    expect(field.style.width).toBe('200px')
    expect(input.style.letterSpacing).toBe('2px')
    expect(input.style.width).toBe('')
  })

  it('uses the Figma Focus state on the field (no outline)', () => {
    render(<Input aria-label="name" />)

    const field = screen
      .getByRole('textbox')
      .closest('[data-slot="input"]') as HTMLElement

    expect(field).toHaveClass(
      'focus-within:inset-ring-control-border-strong',
      'has-[input:focus]:ring-4',
      'has-[input:focus]:ring-focus',
    )
    expect(field.className).not.toMatch(/outline-black-80/)
  })

  it('composes a callback ref with its own', () => {
    let node: HTMLInputElement | null = null
    render(
      <Input
        aria-label="name"
        ref={(element) => {
          node = element
        }}
        endContent={<span>icon</span>}
      />,
    )

    // The internal ref still works: clicking the adornment focuses the input.
    fireEvent.pointerDown(screen.getByText('icon'))

    expect(node).toBe(screen.getByRole('textbox'))
    expect(node).toHaveFocus()
  })

  it('keeps the native role of each input type', () => {
    render(
      <>
        <Input aria-label="Name" />
        <Input type="number" aria-label="Age" />
        <Input type="search" aria-label="Find" />
        <Input type="password" aria-label="Password" />
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute(
      'role',
    )
    expect(screen.getByRole('spinbutton', { name: 'Age' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Find' })).toBeInTheDocument()
    // A password field has no role.
    expect(screen.getByLabelText('Password')).not.toHaveAttribute('role')
  })

  it('shows the red stroke while the input is invalid', () => {
    render(<Input aria-label="Email" aria-invalid />)

    const field = screen.getByRole('textbox').closest('[data-slot="input"]')

    expect(screen.getByRole('textbox')).toBeInvalid()
    expect(field).toHaveClass(
      'has-aria-invalid:inset-ring',
      'has-aria-invalid:inset-ring-control-border-invalid',
    )
  })

  it('puts a horizontal title before the value, in one row', () => {
    render(<Input title="Name" titleLayout="horizontal" defaultValue="Ada" />)

    const input = screen.getByLabelText('Name')
    const row = input.parentElement

    expect(row).toHaveClass('items-center')
    expect(row).not.toHaveClass('flex-col')
    expect(row?.firstElementChild).toHaveTextContent('Name')
    expect(input).toHaveClass('text-end')
  })

  it('cuts a long horizontal title at half the row', () => {
    render(
      <Input
        title="A very long title that would take the whole row"
        titleLayout="horizontal"
      />,
    )

    expect(
      screen.getByText('A very long title that would take the whole row'),
    ).toHaveClass('max-w-1/2', 'truncate')
  })

  it('ignores titleLayout without a title', () => {
    render(<Input aria-label="Name" titleLayout="horizontal" />)

    expect(screen.getByRole('textbox')).not.toHaveClass('text-end')
  })
})

describe('Input showErrorIcon', () => {
  const errorIcon = (input: HTMLElement) =>
    input
      .closest('[data-slot="input"]')
      ?.querySelector('[data-slot="input-error-icon"]')

  it('has no Error icon by default, invalid or not', () => {
    render(<Input aria-label="Email" aria-invalid />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInvalid()
    expect(errorIcon(input)).toBeNull()
  })

  it('renders the Error icon after the end content, hidden from assistive technology', () => {
    render(
      <Input
        aria-label="Email"
        aria-invalid
        showErrorIcon
        endContent={<span data-testid="end" />}
      />,
    )

    const input = screen.getByRole('textbox')
    const icon = errorIcon(input)
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('data-error-icon')
    // Shown by CSS while the input is invalid (`aria-invalid="true"`).
    expect(icon).toHaveClass('hidden', 'group-has-aria-invalid/input:flex')
    expect(icon?.querySelector('svg')).not.toBeNull()
    expect(screen.getByTestId('end').parentElement?.nextElementSibling).toBe(
      icon,
    )
    // The accessible name and description stay the field's own.
    expect(input).toHaveAccessibleName('Email')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('keeps the icon (hidden) while the field is valid, so a FormLabel can see the opt-in', () => {
    render(<Input aria-label="Email" showErrorIcon />)

    const input = screen.getByRole('textbox')
    expect(input).not.toBeInvalid()
    expect(errorIcon(input)).toHaveClass('hidden')
  })

  it('renders the icon on the server', () => {
    const html = renderToString(
      <Input aria-label="Email" aria-invalid showErrorIcon />,
    )

    expect(html).toContain('data-slot="input-error-icon"')
    expect(html).toContain('aria-invalid="true"')
  })
})

describe('Input clearable', () => {
  const clearButton = () => screen.queryByRole('button', { name: 'Clear' })

  it('has no clear button by default', () => {
    render(<Input aria-label="Name" defaultValue="Ada" />)

    expect(screen.queryByRole('button')).toBeNull()
  })

  it('shows the button with a value, on focus (CSS), and clears an uncontrolled field', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(
      <Input
        aria-label="Name"
        defaultValue="Ada"
        clearable
        onChange={onChange}
        onClear={onClear}
      />,
    )
    const input = screen.getByRole<HTMLInputElement>('textbox')
    const button = clearButton() as HTMLElement

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-slot', 'input-clear')
    // Hidden until the field has focus (the input or the button).
    expect(button).toHaveClass('hidden', 'group-focus-within/input:flex')
    // A press keeps the focus in the input (the field stays focused).
    expect(fireEvent.pointerDown(button)).toBe(false)

    fireEvent.click(button)

    expect(input.value).toBe('')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].target.value).toBe('')
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(input).toHaveFocus()
    expect(clearButton()).toBeNull()
  })

  it('appears as the user types into an empty field', () => {
    render(<Input aria-label="Name" clearable />)
    const input = screen.getByRole('textbox')

    expect(clearButton()).toBeNull()
    fireEvent.change(input, { target: { value: 'A' } })
    expect(clearButton()).not.toBeNull()
    fireEvent.change(input, { target: { value: '' } })
    expect(clearButton()).toBeNull()
  })

  it('clears a controlled field through onChange', () => {
    const Controlled = () => {
      const [value, setValue] = useState('Ada')
      return (
        <Input
          aria-label="Name"
          clearable
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )
    }
    render(<Controlled />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.click(clearButton() as HTMLElement)

    expect(input.value).toBe('')
    expect(clearButton()).toBeNull()
  })

  it('keeps a controlled value whose owner ignores the change', () => {
    render(
      <Input aria-label="Name" clearable value="Ada" onChange={() => {}} />,
    )
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.click(clearButton() as HTMLElement)

    expect(input.value).toBe('Ada')
    expect(clearButton()).not.toBeNull()
  })

  it('has no clear button when empty, disabled or read-only', () => {
    const { rerender } = render(<Input aria-label="Name" clearable />)
    expect(clearButton()).toBeNull()

    rerender(<Input aria-label="Name" clearable defaultValue="Ada" disabled />)
    expect(clearButton()).toBeNull()

    rerender(<Input aria-label="Name" clearable value="Ada" readOnly />)
    expect(clearButton()).toBeNull()
  })

  it('reads a value set without onChange again on focus', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} aria-label="Name" clearable />)

    // e.g. react-hook-form's reset() or a value set through the ref.
    if (ref.current) ref.current.value = 'Ada'
    expect(clearButton()).toBeNull()
    act(() => ref.current?.focus())
    expect(clearButton()).not.toBeNull()
  })

  it('follows a reset of its form, and a submit sends the cleared value', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      return new FormData(event.currentTarget).get('name')
    })
    render(
      <form onSubmit={onSubmit}>
        <Input aria-label="Name" name="name" clearable defaultValue="Ada" />
        <button type="submit">Send</button>
        <button type="reset">Reset</button>
      </form>,
    )
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.click(clearButton() as HTMLElement)
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit.mock.results[0].value).toBe('')

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    })
    expect(input.value).toBe('Ada')
    expect(clearButton()).not.toBeNull()
  })

  it('gives react-hook-form the empty value (register and FormField)', async () => {
    let read: (() => { first: string; last: string }) | undefined
    const Names = () => {
      const form = useForm({
        defaultValues: { first: 'Ada', last: 'Lovelace' },
      })
      read = form.getValues
      return (
        <Form {...form}>
          <Input aria-label="First" clearable {...form.register('first')} />
          <FormField
            control={form.control}
            name="last"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="Last" clearable {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      )
    }
    render(<Names />)

    for (const name of ['First', 'Last']) {
      const input = screen.getByRole('textbox', { name })
      // register() sets the value through the ref: read again on focus.
      act(() => input.focus())
      const button = input
        .closest('[data-slot="input"]')
        ?.querySelector('button') as HTMLElement
      await act(async () => {
        fireEvent.click(button)
      })
      expect(input).toHaveValue('')
    }
    expect(read?.()).toEqual({ first: '', last: '' })
  })

  it('takes its name from clearLabel, or from SnowUIProvider', () => {
    const { rerender } = render(
      <Input
        aria-label="Name"
        clearable
        defaultValue="Ada"
        clearLabel="Erase"
      />,
    )
    expect(screen.getByRole('button', { name: 'Erase' })).toHaveAttribute(
      'title',
      'Erase',
    )

    rerender(
      <SnowUIProvider messages={{ input: { clear: 'Очистить' } }}>
        <Input aria-label="Name" clearable defaultValue="Ada" />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('button', { name: 'Очистить' })).not.toBeNull()
  })

  it('renders on the server and hydrates without a mismatch', async () => {
    const element = <Input aria-label="Name" clearable defaultValue="Ada" />
    const html = renderToString(element)
    expect(html).toContain('data-slot="input-clear"')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    await act(async () => {
      hydrateRoot(container, element)
    })
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
    container.remove()
  })
})
