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

  it('renders the floating title as a label', () => {
    render(<Input id="email" title="Email" />)

    expect(screen.getByLabelText('Email')).toBe(screen.getByRole('textbox'))
  })
})
