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
const fakeFonts = (covered: (text: string) => boolean = () => false) => {
  let resolve: () => void = () => {}
  const load = vi.fn(
    (_font: string, _text: string) =>
      new Promise<FontFace[]>((done) => {
        resolve = () => done([])
      }),
  )
  const check = vi.fn((_font: string, text: string) => covered(text))
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { load, check, ready: Promise.resolve() },
  })
  return { load, check, loaded: () => resolve() }
}

const chartWith = (category: string) => (
  <ChartContainer
    config={{ a: { label: 'A' } }}
    title="Chart"
    data={[{ x: category, a: 1 }]}
    categoryKey="x"
  >
    <BarChart data={[{ x: category, a: 1 }]}>
      <Bar dataKey="a" />
    </BarChart>
  </ChartContainer>
)

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

  it('loads the font for new text and measures the plot again', async () => {
    const fonts = fakeFonts()
    const { container, rerender } = render(chartWith('Jan'))
    await act(async () => fonts.loaded())
    const plot = container.querySelector('.recharts-wrapper')
    expect(plot).not.toBeNull()

    // New text the loaded faces don't cover (e.g. another script).
    rerender(chartWith('Янв'))
    expect(fonts.load).toHaveBeenCalledTimes(2)
    expect(fonts.load.mock.calls[1]?.[1]).toContain('Янв')
    // The plot stays drawn meanwhile, but the chart isn't final yet.
    expect(container.querySelector('.recharts-wrapper')).not.toBeNull()
    expect(screen.getByRole('figure')).not.toHaveAttribute('data-chart-ready')

    await act(async () => fonts.loaded())
    // Remounted, so Recharts measured the new labels with the loaded font.
    const remeasured = container.querySelector('.recharts-wrapper')
    expect(remeasured).not.toBeNull()
    expect(remeasured).not.toBe(plot)
    expect(screen.getByRole('figure')).toHaveAttribute('data-chart-ready')
  })

  it('keeps the plot when the loaded faces already cover new text', async () => {
    const fonts = fakeFonts((text) => !text.includes('Янв'))
    const { container, rerender } = render(chartWith('Jan'))
    // First draw always waits for load (check isn't enough before drawing).
    await act(async () => fonts.loaded())
    const plot = container.querySelector('.recharts-wrapper')

    rerender(chartWith('Feb'))
    expect(fonts.load).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.recharts-wrapper')).toBe(plot)
    expect(screen.getByRole('figure')).toHaveAttribute('data-chart-ready')
  })
})
