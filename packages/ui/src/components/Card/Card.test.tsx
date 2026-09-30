import { cleanup, render, screen } from '@testing-library/react'
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

  it('adds no layout, so existing content keeps its flow', () => {
    // A display or gap here would stretch a Button child to the card's
    // width and break inline text into rows: the layout is the user's
    // (`flex flex-col gap-1` for the Figma Card's stack).
    for (const variant of ['default', 'block'] as const) {
      const { unmount } = render(<Card data-testid="card" variant={variant} />)
      const card = screen.getByTestId('card')
      for (const name of ['flex', 'grid', 'flex-col', 'gap-1']) {
        expect(card).not.toHaveClass(name)
      }
      unmount()
    }
  })

  it('renders the dashboard block with variant="block"', () => {
    const card = renderCard({ variant: 'block' })

    expect(card).toHaveClass('rounded-20', 'p-6', 'bg-background-2')
    expect(card).not.toHaveClass('rounded-16', 'bg-surface-1')
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

  it('shows the selection mark with `marker`, checked when selected', () => {
    let card = renderCard({ marker: true })
    let mark = card.querySelector('[data-slot="radio-mark"]') as HTMLElement

    // Clear of the mark: the padding plus the 20px mark and a 4px gap.
    // A named group: an outer `group` (the Sidebar's) doesn't reach the mark.
    expect(card).toHaveClass('group/card', 'relative', 'pe-10')
    expect(card).not.toHaveClass('group')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark).toHaveAttribute('data-state', 'unchecked')
    expect(mark).toHaveClass(
      'absolute',
      'top-3',
      'end-4',
      'size-5',
      // Figma: an empty mark only on hover (and keyboard focus here).
      'opacity-0',
      'group-hover/card:opacity-100',
      'group-has-focus-visible/card:opacity-100',
      'group-hover/card:inset-ring-control-border-strong',
    )
    cleanup()

    card = renderCard({ marker: true, selected: true, variant: 'block' })
    mark = card.querySelector('[data-slot="radio-mark"]') as HTMLElement
    expect(card).toHaveClass('pe-12')
    expect(mark).toHaveAttribute('data-state', 'checked')
    expect(mark).toHaveClass('top-6', 'end-6', 'inset-ring-[6px]')
    expect(mark).not.toHaveClass('opacity-0')
  })

  it('has no mark without `marker`', () => {
    const card = renderCard({ selected: true })
    expect(card.querySelector('[data-slot="radio-mark"]')).toBeNull()
  })

  it('lets className override the defaults', () => {
    const card = renderCard({ className: 'p-2 bg-color-1' })

    expect(card).toHaveClass('p-2', 'bg-color-1')
    expect(card).not.toHaveClass('px-4', 'py-3', 'bg-surface-1')
  })
})
