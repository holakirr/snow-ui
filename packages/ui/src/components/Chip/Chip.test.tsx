import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Chip, type ChipColor } from './Chip'

const dotOf = (chip: HTMLElement) =>
  chip.querySelector('[data-slot="chip-dot"]')

describe('Chip', () => {
  it('is a tinted 12/16 purple chip by default: H 20, padding 4/2, radius 4', () => {
    render(<Chip>Label</Chip>)
    const chip = screen.getByText('Label')

    expect(chip.tagName).toBe('SPAN')
    expect(chip).toHaveAttribute('data-color', 'purple')
    expect(chip).toHaveClass(
      'rounded-4',
      'px-1',
      'py-0.5',
      'text-12',
      'bg-(--chip-fill)',
      'text-(--chip-color)',
    )
    expect(dotOf(chip)).toBeNull()
  })

  it.each<[ChipColor, string]>([
    ['purple', 'purple'],
    ['indigo', 'indigo'],
    ['blue', 'blue'],
    ['green', 'green'],
    ['orange', 'orange'],
    ['red', 'red'],
  ])('mixes %s text with 45% black and tints it 10%', (color, token) => {
    render(<Chip color={color}>Label</Chip>)
    expect(screen.getByText('Label')).toHaveClass(
      `[--chip-color:color-mix(in_srgb,var(--color-${token}),var(--color-black)_45%)]`,
      `[--chip-fill:color-mix(in_srgb,var(--color-${token})_10%,transparent)]`,
      `[--chip-dot:var(--color-${token})]`,
    )
  })

  it('is text-secondary on Black/4% when grey', () => {
    render(<Chip color="grey">Label</Chip>)
    expect(screen.getByText('Label')).toHaveClass(
      '[--chip-color:var(--color-text-secondary)]',
      '[--chip-fill:var(--color-black-4)]',
      '[--chip-dot:var(--color-black-40)]',
    )
  })

  it('is a 14/20 pill when big: H 28, padding 12/4, radius 80', () => {
    render(<Chip big>Label</Chip>)
    const chip = screen.getByText('Label')
    expect(chip).toHaveClass('text-14', 'rounded-80', 'px-3', 'py-1')
    expect(chip).not.toHaveClass('text-12', 'rounded-4', 'px-1', 'py-0.5')
  })

  it('shows a decorative dot, and no tint, without background', () => {
    const { rerender } = render(<Chip background={false}>Label</Chip>)
    let chip = screen.getByText('Label')
    let dot = dotOf(chip) as HTMLElement

    expect(chip).not.toHaveClass('bg-(--chip-fill)', 'rounded-4', 'px-1')
    expect(dot).toHaveAttribute('aria-hidden', 'true')
    expect(dot).toHaveClass('size-3')
    expect(dot.firstElementChild).toHaveClass('size-[4.5px]', 'bg-(--chip-dot)')

    rerender(
      <Chip background={false} big>
        Label
      </Chip>,
    )
    chip = screen.getByText('Label')
    dot = dotOf(chip) as HTMLElement
    expect(dot).toHaveClass('size-4')
    // Big: the Figma Dot's ring.
    expect(dot.firstElementChild).toHaveClass(
      'size-[7px]',
      'border-(--chip-dot)',
    )
  })

  it('merges classes, so a custom colour wins', () => {
    render(<Chip className="[--chip-color:var(--color-black)]">Label</Chip>)
    const chip = screen.getByText('Label')
    expect(chip).toHaveClass('[--chip-color:var(--color-black)]')
    expect(chip.className).not.toContain('--color-purple),var(--color-black)')
  })

  it('renders its child with asChild, the dot before its children', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Chip
        asChild
        ref={ref}
        color="green"
        background={false}
        className="underline"
      >
        <a href="#done" className="px-2">
          Done
        </a>
      </Chip>,
    )
    const link = screen.getByRole('link', { name: 'Done' })

    expect(link).toHaveClass('underline', 'px-2', 'text-12')
    expect(link).toHaveAttribute('data-color', 'green')
    expect(link.firstElementChild).toHaveAttribute('data-slot', 'chip-dot')
    expect(ref.current).toBe(link)
  })
})
