import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Tag } from './Tag'

describe('Tag', () => {
  it('calls onClose once on click', () => {
    const onClose = vi.fn()

    render(<Tag label="React" onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Remove tag React' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose once when activated with Enter', () => {
    const onClose = vi.fn()

    render(<Tag label="React" onClose={onClose} />)

    const button = screen.getByRole('button', { name: 'Remove tag React' })
    button.focus()
    // A native <button> turns Enter into a single click event; the keydown
    // itself must not trigger onClose a second time.
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.click(button)

    expect(button).toHaveFocus()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render a close button without onClose', () => {
    render(<Tag label="React" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders the Figma states', () => {
    const { rerender } = render(<Tag label="React" />)
    const tag = screen.getByRole('listitem')

    expect(tag).toHaveClass('hover:[--tag-fill:var(--color-black-10)]')

    rerender(<Tag label="React" state="active" />)
    expect(tag).toHaveClass('text-indigo')

    rerender(<Tag label="React" state="static" />)
    expect(tag.className).not.toContain('hover:')
  })

  it('renders the dot left icon, with the Figma paddings', () => {
    const { container } = render(<Tag label="React" dot />)
    const tag = screen.getByRole('listitem')

    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
    expect(tag).toHaveClass('pl-1', 'pr-2')
  })

  it('renders the arrow shapes without icons', () => {
    const onClose = vi.fn()
    const { container, rerender } = render(
      <Tag label="React" shape="arrow-left" dot onClose={onClose} />,
    )

    const tip = container.querySelector('svg')
    expect(tip).toBeInTheDocument()
    expect(tip?.nextElementSibling).toHaveTextContent('React')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(<Tag label="React" shape="arrow-right" />)
    expect(
      container.querySelector('svg')?.previousElementSibling,
    ).toHaveTextContent('React')
  })
})
