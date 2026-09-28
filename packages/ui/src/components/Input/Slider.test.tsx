import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { Slider } from './Slider'

beforeAll(() => {
  // Radix Slider measures thumbs with ResizeObserver, which jsdom lacks.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Slider', () => {
  it('renders one thumb by default', () => {
    render(<Slider />)

    expect(screen.getAllByRole('slider')).toHaveLength(1)
  })

  it('renders two thumbs for a range', () => {
    render(<Slider defaultValue={[20, 80]} />)

    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(2)
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20')
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80')
  })

  it('renders a thumb per value for a controlled range', () => {
    render(<Slider value={[10, 40, 90]} />)

    expect(screen.getAllByRole('slider')).toHaveLength(3)
  })
})
