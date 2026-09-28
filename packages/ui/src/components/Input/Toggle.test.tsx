import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Toggle } from './Toggle'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

describe('Toggle', () => {
  it('turns into a Gray button when pressed', () => {
    render(<Toggle aria-label="bold">B</Toggle>)

    const toggle = screen.getByRole('button', { name: 'bold' })

    expect(toggle).toHaveClass('opacity-40', 'data-[state=on]:bg-black-4')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('data-state', 'on')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('uses the Figma Button sizes', () => {
    render(
      <Toggle aria-label="bold" size="sm">
        B
      </Toggle>,
    )

    expect(screen.getByRole('button')).toHaveClass(
      'min-h-6',
      'px-3',
      'rounded-12',
      'text-12',
    )
  })
})

describe('ToggleGroup', () => {
  it('renders the pill variant on a track, like the Tabs pill', () => {
    const { container } = render(
      <ToggleGroup type="single" variant="pill" size="sm" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )

    const group = container.firstElementChild
    const [a, b] = screen.getAllByRole('radio')

    expect(group).toHaveClass('bg-black-4', 'rounded-16', 'p-0.5', 'gap-0.5')
    expect(a).toHaveAttribute('data-state', 'on')
    expect(a).toHaveClass('data-[state=on]:bg-white-80', 'rounded-12')
    expect(b).toHaveAttribute('data-state', 'off')
  })

  it('lets an item override the group size', () => {
    render(
      <ToggleGroup type="multiple" size="sm">
        <ToggleGroupItem value="a" size="lg">
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    )

    expect(screen.getByRole('button')).toHaveClass('min-h-12', 'rounded-20')
  })
})
