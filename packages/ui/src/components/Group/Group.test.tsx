import { composeStories } from '@storybook/react'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Group } from './Group'
import * as stories from './Group.stories'

const { Default, Vertical, Reverse, VerticalReverse } = composeStories(stories)

describe('Group', () => {
  it('is a labelled group of items in a row, 8px apart', async () => {
    await Default.run()

    const group = screen.getByRole('group', { name: 'Toolbar' })
    expect(group).toHaveClass('inline-flex', 'flex-row', 'gap-2', 'rounded-12')
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('stacks vertically', async () => {
    await Vertical.run()

    expect(screen.getByRole('group')).toHaveClass('flex-col')
  })

  it('reverses a row', async () => {
    await Reverse.run()

    expect(screen.getByRole('group')).toHaveClass('flex-row-reverse')
  })

  it('reverses a column', async () => {
    await VerticalReverse.run()

    const group = screen.getByRole('group')
    expect(group).toHaveClass('flex-col-reverse')
    expect(group).not.toHaveClass('flex-row-reverse')
  })

  it.each([
    [0, 'gap-0'],
    [4, 'gap-1'],
    [12, 'gap-3'],
    [16, 'gap-4'],
  ] as const)('maps gap %i to %s', (gap, className) => {
    const { container } = render(<Group gap={gap} />)

    expect(within(container).getByRole('group')).toHaveClass(className)
  })

  it('accepts another role', () => {
    render(<Group role="toolbar" aria-label="Formatting" />)

    expect(
      screen.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeInTheDocument()
  })
})
