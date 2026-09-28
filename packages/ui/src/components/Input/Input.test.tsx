import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

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
    expect(title).toHaveClass('text-12', 'text-black-40')
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
    expect(field).toHaveClass('inset-ring-[0.5px]', 'inset-ring-black-20')
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
    expect(field).toHaveClass('hover:inset-ring-black-20')
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
      'focus-within:inset-ring-black-40',
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
})
