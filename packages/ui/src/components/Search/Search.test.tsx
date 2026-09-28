import { composeStories } from '@storybook/react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Search } from './Search'
import * as stories from './Search.stories'

const { Gray, Outline, Typing, Controlled } = composeStories(stories)

describe('Search', () => {
  it('is a labelled searchbox with the shortcut hint while empty', async () => {
    await Gray.run()

    const input = screen.getByRole('searchbox', { name: 'Search' })
    const field = input.parentElement as HTMLElement

    expect(input).toHaveAttribute('type', 'search')
    expect(input).toHaveAttribute('placeholder', 'Search')
    expect(field).toHaveClass('bg-black-4', 'h-7', 'rounded-16', 'w-40')
    expect(within(field).getByText('/')).toHaveAttribute('aria-hidden', 'true')
    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })

  it('renders the outline type', async () => {
    await Outline.run()

    const field = screen.getByRole('searchbox').parentElement
    expect(field).toHaveClass('bg-surface-1', 'inset-ring-black-20')
    expect(field).not.toHaveClass('bg-black-4')
  })

  it('swaps the hint for a clear button while typing', async () => {
    await Gray.run()

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'snow' } })

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeVisible()
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })

  it('clears an uncontrolled field and refocuses it', async () => {
    await Typing.run()

    const input = screen.getByRole('searchbox')
    expect(input).toHaveValue('Typing')

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })

  it('clears a controlled field through onChange', async () => {
    await Controlled.run()

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByText('Value: “”')).toBeInTheDocument()
  })

  it('calls onChange with an empty value and onClear', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    const { container } = render(
      <Search
        aria-label="Find"
        defaultValue="abc"
        onChange={onChange}
        onClear={onClear}
      />,
    )

    fireEvent.click(
      within(container).getByRole('button', { name: 'Clear search' }),
    )

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0]?.[0].target.value).toBe('')
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('clears with Escape and keeps Escape for others when empty', () => {
    const onClear = vi.fn()
    const onKeyDown = vi.fn()
    const { container } = render(
      <Search
        aria-label="Find"
        defaultValue="abc"
        onClear={onClear}
        onKeyDown={onKeyDown}
      />,
    )
    const input = within(container).getByRole('searchbox')

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveValue('')
    expect(onClear).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(2)
  })

  it('has no clear button when disabled or read-only', () => {
    const { container } = render(
      <>
        <Search aria-label="Disabled" defaultValue="abc" disabled />
        <Search aria-label="Read-only" defaultValue="abc" readOnly />
      </>,
    )

    expect(within(container).queryByRole('button')).not.toBeInTheDocument()
  })

  it('forwards the ref to the input', () => {
    const Harness = () => {
      const [node, setNode] = useState<HTMLInputElement | null>(null)
      return (
        <>
          <Search aria-label="Ref" ref={setNode} />
          <output>{node?.tagName}</output>
        </>
      )
    }
    const { container } = render(<Harness />)

    expect(within(container).getByRole('status')).toHaveTextContent('INPUT')
  })
})
