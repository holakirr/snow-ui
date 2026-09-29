import { act, render, screen } from '@testing-library/react'
import { Bar, BarChart } from 'recharts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChartContainer } from './ChartContainer'

const chart = (
  <ChartContainer
    config={{ a: { label: 'A' } }}
    title="Chart"
    data={[{ x: 'Jan', a: 1 }]}
    categoryKey="x"
  >
    <BarChart data={[{ x: 'Jan', a: 1 }]}>
      <Bar dataKey="a" />
    </BarChart>
  </ChartContainer>
)

/** A Font Loading API whose `load` resolves when the test says so. */
const fakeFonts = () => {
  let resolve: () => void = () => {}
  const load = vi.fn(
    (_font: string, _text: string) =>
      new Promise<FontFace[]>((done) => {
        resolve = () => done([])
      }),
  )
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { load, ready: Promise.resolve() },
  })
  return { load, loaded: () => resolve() }
}

afterEach(() => {
  vi.useRealTimers()
  Reflect.deleteProperty(document, 'fonts')
})

describe('drawing once the font has loaded', () => {
  it('draws right away without a Font Loading API', () => {
    const { container } = render(chart)
    expect(container.querySelector('.recharts-wrapper')).not.toBeNull()
    expect(screen.getByRole('figure')).toHaveAttribute('data-chart-ready')
  })

  it('waits for the font of its text, then draws and flags it', async () => {
    const fonts = fakeFonts()
    const { container } = render(chart)
    // The figure, its name and its table are there; the plot isn't yet.
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(container.querySelector('.recharts-wrapper')).toBeNull()
    expect(screen.getByRole('figure')).not.toHaveAttribute('data-chart-ready')
    // It loads the element's font for the digits and the categories.
    expect(fonts.load).toHaveBeenCalledWith(
      expect.stringMatching(/12px/),
      expect.stringContaining('0123456789'),
    )
    expect(fonts.load.mock.calls[0]?.[1]).toContain('Jan')
    await act(async () => fonts.loaded())
    expect(container.querySelector('.recharts-wrapper')).not.toBeNull()
    expect(screen.getByRole('figure')).toHaveAttribute('data-chart-ready')
  })

  it('draws after 3 seconds if the font never arrives', () => {
    vi.useFakeTimers()
    fakeFonts()
    const { container } = render(chart)
    expect(container.querySelector('.recharts-wrapper')).toBeNull()
    act(() => vi.advanceTimersByTime(3000))
    expect(container.querySelector('.recharts-wrapper')).not.toBeNull()
  })

  it('is ready at once while loading or empty', () => {
    fakeFonts()
    render(
      <ChartContainer config={{}} title="Empty" empty>
        <BarChart data={[]} />
      </ChartContainer>,
    )
    expect(screen.getByRole('figure')).toHaveAttribute('data-chart-ready')
  })
})
