import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import { Textarea } from './Textarea'

const counter = (container: HTMLElement) =>
  container.querySelector('[data-slot="textarea-count"]')

describe('Textarea', () => {
  it('is a plain textarea without showCount, even with a maxLength', () => {
    // 5.x: the counter is opt-in, so existing fields keep their markup.
    const { container } = render(
      <Textarea aria-label="Message" maxLength={200} />,
    )

    expect(container.firstElementChild?.tagName).toBe('TEXTAREA')
    expect(counter(container)).toBeNull()
  })

  it('counts the characters against maxLength', () => {
    const { container } = render(
      <Textarea
        aria-label="Message"
        maxLength={200}
        showCount
        defaultValue="Hi"
      />,
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
          showCount
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

  it('shows a count without a limit', () => {
    const { container } = render(
      <Textarea aria-label="Message" showCount defaultValue="Hello" />,
    )

    expect(counter(container)).toHaveTextContent(/^5$/)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      '5 characters',
    )
  })

  it('leaves value={null} uncontrolled, as React does', () => {
    const { container } = render(
      <Textarea
        aria-label="Message"
        showCount
        maxLength={20}
        value={null as never}
        onChange={() => {}}
      />,
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hey' } })

    expect(counter(container)).toHaveTextContent('3/20')
  })

  it('counts a new defaultValue of a field the user has not edited', () => {
    const { container, rerender } = render(
      <Textarea
        aria-label="Message"
        showCount
        maxLength={100}
        defaultValue=""
      />,
    )
    expect(counter(container)).toHaveTextContent('0/100')

    // e.g. `defaultValue={data?.bio}` once the data has loaded.
    rerender(
      <Textarea
        aria-label="Message"
        showCount
        maxLength={100}
        defaultValue="Loaded bio"
      />,
    )

    expect(screen.getByRole('textbox')).toHaveValue('Loaded bio')
    expect(counter(container)).toHaveTextContent('10/100')
  })

  it('dims the counter with the disabled field', () => {
    const { container } = render(
      <Textarea aria-label="Message" showCount maxLength={20} disabled />,
    )

    expect(counter(container)).toHaveClass('peer-disabled:text-black-20')
  })

  it('follows a reset of its form, without act() warnings', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(
      <form>
        <Textarea
          aria-label="Message"
          maxLength={200}
          showCount
          defaultValue="Hi"
        />
        <button type="reset">Reset</button>
      </form>,
    )
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello there' } })
    expect(counter(container)).toHaveTextContent('11/200')

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(textarea).toHaveValue('Hi')
    expect(counter(container)).toHaveTextContent('2/200')
    expect(
      error.mock.calls.filter(([text]) => String(text).includes('act(')),
    ).toEqual([])
    error.mockRestore()
  })

  it('keeps an aria-describedby of its own before the count', () => {
    render(
      <>
        <p id="hint">Markdown works.</p>
        <Textarea
          aria-label="Message"
          aria-describedby="hint"
          maxLength={50}
          showCount
        />
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
        showCount
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
        <Textarea
          aria-label="Nachricht"
          maxLength={30}
          showCount
          defaultValue="Hallo"
        />
      </SnowUIProvider>,
    )

    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      '5 / 30 Zeichen',
    )
  })
})

describe('Textarea showErrorIcon', () => {
  const errorIcon = (container: HTMLElement) =>
    container.querySelector('[data-slot="textarea-error-icon"]')

  it('stays a plain textarea without it', () => {
    const { container } = render(<Textarea aria-label="Bio" aria-invalid />)

    expect(container.firstElementChild?.tagName).toBe('TEXTAREA')
    expect(errorIcon(container)).toBeNull()
  })

  it('puts the textarea and the Error icon in a wrapper', () => {
    const ref = createRef<HTMLTextAreaElement>()
    const { container } = render(
      <Textarea
        ref={ref}
        aria-label="Bio"
        aria-invalid
        showErrorIcon
        className="h-24"
        containerClassName="w-80"
      />,
    )

    const textarea = screen.getByRole('textbox')
    const wrapper = container.firstElementChild
    expect(wrapper).toHaveAttribute('data-slot', 'textarea-field')
    expect(wrapper).toHaveClass('relative', 'w-80')
    expect(textarea).toHaveClass('h-24', 'peer', 'aria-invalid:pe-10')
    expect(ref.current).toBe(textarea)

    const icon = errorIcon(container)
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('data-error-icon')
    // A later sibling of the textarea (the `peer`): shown while it is invalid.
    expect(icon).toHaveClass('hidden', 'peer-aria-invalid:block')
    expect(textarea.compareDocumentPosition(icon as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('adds the icon to the counter wrapper', () => {
    const { container } = render(
      <Textarea aria-label="Bio" showCount maxLength={200} showErrorIcon />,
    )

    expect(
      container.querySelectorAll('[data-slot="textarea-field"]'),
    ).toHaveLength(1)
    expect(counter(container)).not.toBeNull()
    expect(errorIcon(container)).not.toBeNull()
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      '0 of 200 characters',
    )
  })

  it('renders on the server without client code', () => {
    const html = renderToString(
      <Textarea aria-label="Bio" aria-invalid showErrorIcon />,
    )

    expect(html).toMatch(/^<div[^>]*data-slot="textarea-field"/)
    expect(html).toContain('data-slot="textarea-error-icon"')
  })
})
