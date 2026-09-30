import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconBox } from './IconBox'

const icon = <svg data-testid="icon" aria-hidden />

describe('IconBox', () => {
  it('sizes the icon slot (24 by default) without a tile', () => {
    const { container } = render(<IconBox>{icon}</IconBox>)
    const root = container.firstElementChild as HTMLElement

    expect(root).toHaveAttribute('data-size', '24')
    expect(root).not.toHaveClass('bg-black-4')
    expect(screen.getByTestId('icon').parentElement).toHaveClass('size-6')
  })

  it.each([
    [12, 'size-3', ['p-1', 'rounded-8']],
    [24, 'size-6', ['p-1', 'rounded-12']],
    [40, 'size-10', ['p-2', 'rounded-16']],
    [48, 'size-12', ['p-2', 'rounded-20']],
    [80, 'size-20', ['p-3', 'rounded-28']],
  ] as const)('uses the Figma tile for size %i', (size, slot, tile) => {
    const { container } = render(
      <IconBox size={size} background>
        {icon}
      </IconBox>,
    )
    const root = container.firstElementChild as HTMLElement

    expect(root).toHaveClass('bg-black-4', ...tile)
    expect(screen.getByTestId('icon').parentElement).toHaveClass(slot)
  })

  it('lets className override the tile colour', () => {
    const { container } = render(
      <IconBox background className="bg-color-1">
        {icon}
      </IconBox>,
    )
    const root = container.firstElementChild as HTMLElement

    expect(root).toHaveClass('bg-color-1')
    expect(root).not.toHaveClass('bg-black-4')
  })

  it('renders a decorative dot badge', () => {
    const { container } = render(<IconBox badge>{icon}</IconBox>)
    const badge = container.querySelector('[data-slot="badge"]')

    expect(badge).toHaveAttribute('aria-hidden', 'true')
    expect(badge?.firstElementChild).toHaveClass('bg-indigo', 'rounded-full')
  })

  it('exposes the badge label to assistive technology', () => {
    render(
      <IconBox badge badgeLabel="Unread notifications">
        {icon}
      </IconBox>,
    )

    const label = screen.getByText('Unread notifications')
    expect(label).toHaveClass('sr-only')
    expect(label.parentElement).not.toHaveAttribute('aria-hidden')
  })

  it('renders a custom badge and positions it for the tile', () => {
    const { container } = render(
      <IconBox size={24} background badge={<span>3</span>}>
        {icon}
      </IconBox>,
    )
    const badge = container.querySelector('[data-slot="badge"]')

    expect(badge).toHaveTextContent('3')
    expect(badge).toHaveClass('top-[-2px]', 'end-[-2px]')
  })

  it('puts the icon on the Glass 1 tile with `glass`', () => {
    const { container } = render(
      <IconBox size={24} glass badge>
        {icon}
      </IconBox>,
    )
    const root = container.firstElementChild as HTMLElement

    expect(root).toHaveAttribute('data-glass', 'true')
    // The tile's padding and radius, with the glass fill.
    expect(root).toHaveClass('glass-1', 'p-1', 'rounded-12')
    expect(root).not.toHaveClass('bg-black-4')
    // `glass` implies the tile: the badge is placed for it.
    expect(container.querySelector('[data-slot="badge"]')).toHaveClass(
      'top-[-2px]',
      'end-[-2px]',
    )
  })

  it('is the Glass set 88px tile at 80: padding 4, radius 24', () => {
    const { container } = render(
      <IconBox size={80} glass badge>
        {icon}
      </IconBox>,
    )
    const root = container.firstElementChild as HTMLElement

    expect(root).toHaveClass('glass-1', 'p-1', 'rounded-24')
    expect(root).not.toHaveClass('p-3', 'rounded-28')
    expect(container.querySelector('[data-slot="badge"]')).toHaveClass(
      'top-[6px]',
      'end-[6px]',
    )
  })

  it('keeps the main set 104px tile at 80 with `background`', () => {
    const { container } = render(
      <IconBox size={80} background>
        {icon}
      </IconBox>,
    )
    expect(container.firstElementChild).toHaveClass('p-3', 'rounded-28')
  })

  it('renders no badge for badge={false}', () => {
    const { container } = render(<IconBox badge={false}>{icon}</IconBox>)

    expect(container.querySelector('[data-slot="badge"]')).toBeNull()
  })
})
