import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from './Card'

const renderCard = (props: Parameters<typeof Card>[0] = {}) => {
  render(<Card data-testid="card" {...props} />)
  return screen.getByTestId('card')
}

describe('Card', () => {
  it('defaults to the Figma Card: radius 16, padding 12/16, Surface/1', () => {
    const card = renderCard()

    expect(card).toHaveClass('rounded-16', 'px-4', 'py-3', 'bg-surface-1')
    expect(card).not.toHaveClass('p-6')
    expect(card).not.toHaveAttribute('data-state')
  })

  it('stacks its children like the Figma Card, 4px apart', () => {
    expect(renderCard()).toHaveClass('flex', 'flex-col', 'gap-1')
  })

  it('keeps the layout set in className', () => {
    const { rerender } = render(
      <Card data-testid="card" className="grid grid-cols-2" />,
    )
    const card = screen.getByTestId('card')
    // A display of yours: no stack, and no gap added to your grid.
    expect(card).toHaveClass('grid', 'grid-cols-2')
    expect(card).not.toHaveClass('flex', 'flex-col', 'gap-1')

    rerender(<Card data-testid="card" className="flex flex-col gap-4" />)
    expect(card).toHaveClass('flex', 'flex-col', 'gap-4')
    expect(card).not.toHaveClass('gap-1')

    rerender(<Card data-testid="card" className="block md:flex" />)
    expect(card).not.toHaveClass('flex-col')

    // Other classes keep the stack.
    rerender(<Card data-testid="card" className="w-60 gap-2" />)
    expect(card).toHaveClass('flex', 'flex-col', 'gap-2', 'w-60')
  })

  it('renders the dashboard block with variant="block"', () => {
    const card = renderCard({ variant: 'block' })

    expect(card).toHaveClass('rounded-20', 'p-6', 'bg-background-2')
    expect(card).not.toHaveClass('rounded-16', 'bg-surface-1')
    // The block has no layout of its own.
    expect(card).not.toHaveClass('flex')
  })

  it('shows the hover stroke only when interactive', () => {
    const { rerender } = render(<Card data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('hover:inset-ring-black-40')

    rerender(<Card data-testid="card" interactive />)
    expect(card).toHaveClass(
      'cursor-pointer',
      'hover:inset-ring-[0.5px]',
      'hover:inset-ring-black-40',
    )
  })

  it('marks the selected state with a Primary stroke and data-state', () => {
    const card = renderCard({ selected: true, interactive: true })

    expect(card).toHaveAttribute('data-state', 'selected')
    expect(card).toHaveClass('inset-ring', 'inset-ring-primary')
    // The selected stroke wins over the hover stroke.
    expect(card).toHaveClass('hover:inset-ring-primary')
    expect(card).not.toHaveClass('hover:inset-ring-black-40')
  })

  it('keeps `bordered` as the static hover stroke', () => {
    const card = renderCard({ bordered: true })

    expect(card).toHaveClass('inset-ring-[0.5px]', 'inset-ring-black-40')
  })

  it('lets className override the defaults', () => {
    const card = renderCard({ className: 'p-2 bg-color-1' })

    expect(card).toHaveClass('p-2', 'bg-color-1')
    expect(card).not.toHaveClass('px-4', 'py-3', 'bg-surface-1')
  })
})
