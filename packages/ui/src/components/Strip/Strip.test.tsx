import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Strip } from './Strip'
import * as stories from './Strip.stories'

const { Default, Vertical, Progress, Examples } = composeStories(stories)

const segmentsOf = (element: Element) => Array.from(element.children)

describe('Strip', () => {
  it('is a decorative row of equal 2px segments', async () => {
    await Default.run()
    const strip = document.querySelector('[data-orientation]') as HTMLElement

    expect(strip).toHaveAttribute('aria-hidden', 'true')
    expect(strip).not.toHaveAttribute('role')
    expect(strip).toHaveClass('flex-row', 'gap-2', 'w-40')
    expect(segmentsOf(strip)).toHaveLength(4)
    for (const segment of segmentsOf(strip)) {
      expect(segment).toHaveClass('flex-1', 'h-0.5', 'bg-black')
      expect(segment).toHaveAttribute('data-state', 'filled')
    }
  })

  it('stacks vertically', async () => {
    await Vertical.run()
    const strip = document.querySelector(
      '[data-orientation="vertical"]',
    ) as HTMLElement

    expect(strip).toHaveClass('flex-col')
    expect(segmentsOf(strip)[0]).toHaveClass('w-0.5')
  })

  it('is a progressbar when it has a value', async () => {
    await Progress.run()

    const bar = screen.getByRole('progressbar', { name: 'Storage used' })
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '7')
    expect(bar).toHaveAttribute('aria-valuenow', '4')
    expect(bar).not.toHaveAttribute('aria-hidden')

    const states = segmentsOf(bar).map((segment) =>
      segment.getAttribute('data-state'),
    )
    expect(states).toEqual([
      'filled',
      'filled',
      'filled',
      'filled',
      'empty',
      'empty',
      'empty',
    ])
    expect(segmentsOf(bar)[4]).toHaveClass('bg-black-10', 'rounded-full', 'h-1')
  })

  it('can be a meter', async () => {
    await Examples.run()

    expect(
      screen.getByRole('meter', { name: 'Password strength' }),
    ).toHaveAttribute('aria-valuetext', 'Weak')
  })

  it('clamps the value and the count', () => {
    render(<Strip count={0} value={5} aria-label="Clamped" />)

    const bar = screen.getByRole('progressbar', { name: 'Clamped' })
    expect(segmentsOf(bar)).toHaveLength(1)
    expect(bar).toHaveAttribute('aria-valuenow', '1')
  })
})
