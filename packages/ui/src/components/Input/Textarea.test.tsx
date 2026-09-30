import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import { Textarea } from './Textarea'

const counter = (container: HTMLElement) =>
  container.querySelector('[data-slot="textarea-count"]')

describe('Textarea', () => {
  it('is a plain textarea without a maxLength', () => {
    const { container } = render(<Textarea aria-label="Message" />)

    expect(container.firstElementChild?.tagName).toBe('TEXTAREA')
    expect(counter(container)).toBeNull()
  })

  it('counts the characters against maxLength', () => {
    const { container } = render(
      <Textarea aria-label="Message" maxLength={200} defaultValue="Hi" />,
    )
    const textarea = screen.getByRole('textbox', { name: 'Message' })

    expect(counter(container)).toHaveTextContent('2/200')
    expect(counter(container)).toHaveAttribute('aria-hidden', 'true')
    expect(textarea).toHaveAccessibleDescription('2 of 200 characters')

    fireEvent.change(textarea, { target: { value: 'Hello' } })

    expect(counter(container)).toHaveTextContent('5/200')
    // Read with the field on focus, not announced on every keystroke.
    expect(textarea).toHaveAccessibleDescription('5 of 200 characters')
    expect(container.querySelector('[aria-live]')).toBeNull()
  })

  it('counts a controlled value', () => {
    const Controlled = () => {
      const [value, setValue] = useState('abc')
      return (
        <Textarea
          aria-label="Message"
          maxLength={10}
          value={value}
          onChange={(event) => setValue(event.target.value.toUpperCase())}
        />
      )
    }
    const { container } = render(<Controlled />)

    expect(counter(container)).toHaveTextContent('3/10')
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'abcd' },
    })
    expect(screen.getByRole('textbox')).toHaveValue('ABCD')
    expect(counter(container)).toHaveTextContent('4/10')
  })

  it('shows a count without a limit with showCount, and hides it with false', () => {
    const { container, rerender } = render(
      <Textarea aria-label="Message" showCount defaultValue="Hello" />,
    )

    expect(counter(container)).toHaveTextContent(/^5$/)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      '5 characters',
    )

    rerender(
      <Textarea aria-label="Message" maxLength={200} showCount={false} />,
    )
    expect(counter(container)).toBeNull()
  })

  it('follows a reset of its form', async () => {
    const { container } = render(
      <form>
        <Textarea aria-label="Message" maxLength={200} defaultValue="Hi" />
      </form>,
    )
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello there' } })
    expect(counter(container)).toHaveTextContent('11/200')

    await act(async () => {
      container.querySelector('form')?.reset()
      await new Promise((resolve) => setTimeout(resolve))
    })

    expect(counter(container)).toHaveTextContent('2/200')
  })

  it('keeps an aria-describedby of its own before the count', () => {
    render(
      <>
        <p id="hint">Markdown works.</p>
        <Textarea aria-label="Message" aria-describedby="hint" maxLength={50} />
      </>,
    )

    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Markdown works. 0 of 50 characters',
    )
  })

  it('styles the textarea with className and the wrapper with containerClassName', () => {
    const ref = createRef<HTMLTextAreaElement>()
    const { container } = render(
      <Textarea
        ref={ref}
        aria-label="Message"
        maxLength={20}
        className="min-h-32"
        containerClassName="w-60"
      />,
    )

    expect(container.firstElementChild).toHaveClass('relative', 'w-60')
    expect(ref.current).toBe(screen.getByRole('textbox'))
    expect(ref.current).toHaveClass('min-h-32')
  })

  it('takes the count text from SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{
          textarea: { count: (length, max) => `${length} / ${max} Zeichen` },
        }}
      >
        <Textarea aria-label="Nachricht" maxLength={30} defaultValue="Hallo" />
      </SnowUIProvider>,
    )

    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      '5 / 30 Zeichen',
    )
  })
})
