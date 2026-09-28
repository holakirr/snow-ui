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
})
