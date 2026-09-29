import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Tag } from './Tag'

describe('Tag', () => {
  it('calls onRemove once on click', () => {
    const onRemove = vi.fn()

    render(<Tag label="React" onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Remove tag React' }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove once when activated with Enter', () => {
    const onRemove = vi.fn()

    render(<Tag label="React" onRemove={onRemove} />)

    const button = screen.getByRole('button', { name: 'Remove tag React' })
    button.focus()
    // A native <button> turns Enter into a single click event; the keydown
    // itself must not trigger onRemove a second time.
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.click(button)

    expect(button).toHaveFocus()
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('does not render a remove button without onRemove', () => {
    render(<Tag label="React" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders the Figma states', () => {
    const { rerender } = render(<Tag label="React" data-testid="tag" />)
    const tag = screen.getByTestId('tag')

    expect(tag).toHaveClass('hover:[--tag-fill:var(--color-black-10)]')

    rerender(<Tag label="React" data-testid="tag" state="active" />)
    expect(tag).toHaveClass('text-indigo-text')

    rerender(<Tag label="React" data-testid="tag" state="static" />)
    expect(tag.className).not.toContain('hover:')
  })

  it('renders the dot start icon, with the Figma paddings', () => {
    const { container } = render(<Tag label="React" data-testid="tag" dot />)
    const tag = screen.getByTestId('tag')

    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
    expect(tag).toHaveClass('ps-1', 'pe-2')
  })

  it('renders the arrow shapes without icons', () => {
    const onRemove = vi.fn()
    const { container, rerender } = render(
      <Tag label="React" shape="arrow-start" dot onRemove={onRemove} />,
    )

    const tip = container.querySelector('svg')
    expect(tip).toBeInTheDocument()
    expect(tip?.nextElementSibling).toHaveTextContent('React')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(<Tag label="React" shape="arrow-end" />)
    expect(
      container.querySelector('svg')?.previousElementSibling,
    ).toHaveTextContent('React')
  })

  it('gives the remove button a 24px hit area and a decorative icon', () => {
    render(<Tag label="React" onRemove={() => {}} />)

    const button = screen.getByRole('button', { name: 'Remove tag React' })
    const icon = button.querySelector('svg')

    expect(button).toHaveClass('size-3', 'after:-inset-1.5', 'focus-ring')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon?.querySelector('title')).toBeNull()
  })

  it('uses the accessible indigo for active text', () => {
    render(<Tag label="React" data-testid="tag" state="active" />)

    expect(screen.getByTestId('tag')).toHaveClass('text-indigo-text')
  })

  it('has no role of its own, so a standalone tag is valid ARIA', () => {
    render(<Tag label="React" data-testid="tag" />)

    expect(screen.getByTestId('tag')).not.toHaveAttribute('role')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('takes role="listitem" when rendered in a list', () => {
    render(
      // biome-ignore lint/a11y/useSemanticElements: tags are <div>s, which a <ul> can't contain
      <div role="list">
        <Tag label="React" role="listitem" />
        <Tag label="Vue" role="listitem" />
      </div>,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
