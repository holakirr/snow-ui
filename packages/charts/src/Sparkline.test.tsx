import { SnowUIProvider } from '@holakirr/snow-ui'
import { render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Sparkline, sparklinePath, sparklineSegments } from './Sparkline'

afterEach(() => {
  vi.restoreAllMocks()
})

/** The `d` of the line paths (not the areas). */
const lines = (container: HTMLElement) =>
  [...container.querySelectorAll('path[fill="none"]')].map((path) =>
    path.getAttribute('d'),
  )

describe('sparklineSegments', () => {
  it('spreads the values over a 100 × 100 box, the largest at the top', () => {
    expect(sparklineSegments([0, 5, 10])).toEqual([
      [
        [0, 100],
        [50, 50],
        [100, 0],
      ],
    ])
  })

  it('splits the line at gaps and centres a flat series', () => {
    expect(sparklineSegments([3, 3, null, 3])).toEqual([
      [
        [0, 50],
        [100 / 3, 50],
      ],
      [[100, 50]],
    ])
    expect(sparklineSegments([7])).toEqual([[[50, 50]]])
    expect(sparklineSegments([])).toEqual([])
  })
})

describe('sparklinePath', () => {
  it('draws straight segments, a dot for a lone point, nothing for none', () => {
    expect(
      sparklinePath(
        [
          [0, 100],
          [50, 0],
          [100, 50],
        ],
        false,
      ),
    ).toBe('M0,100L50,0L100,50')
    expect(sparklinePath([[50, 50]], true)).toBe('M50,50h0')
    expect(sparklinePath([], true)).toBe('')
  })

  it('draws a monotone curve that never overshoots the points', () => {
    const path = sparklinePath(
      [
        [0, 100],
        [25, 0],
        [50, 0],
        [100, 50],
      ],
      true,
    )
    expect(path.startsWith('M0,100C')).toBe(true)
    // Every coordinate stays within the points' range (no overshoot above 0
    // or below 100); the flat run keeps its control points flat.
    const numbers = [...path.matchAll(/-?\d+(\.\d+)?/g)].map(([n]) => Number(n))
    const ys = numbers.filter((_, i) => i % 2 === 1)
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...ys)).toBeLessThanOrEqual(100)
    expect(path).toContain('C33.33,0 41.67,0 50,0')
  })
})

describe('Sparkline', () => {
  it('is a named figure with a hidden graphic and the values in a table', () => {
    const { container } = render(
      <Sparkline
        title="Views, last 7 days"
        description="Up from 1 to 5"
        data={[1, 3, 2, 5]}
        color="indigo"
        dashed
        locale="de-DE"
        valueFormatter={(value) => `${value} views`}
      />,
    )
    const figure = screen.getByRole('figure', { name: 'Views, last 7 days' })
    expect(figure).toHaveAccessibleDescription('Up from 1 to 5')
    expect(figure).toHaveStyle({ height: '32px', width: '100%' })
    const svg = figure.querySelector('svg') as SVGSVGElement
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none')
    const [line] = container.querySelectorAll('path')
    expect(line).toHaveAttribute('stroke', 'var(--color-indigo)')
    expect(line).toHaveAttribute('stroke-dasharray', '2 4')
    expect(line).toHaveAttribute('vector-effect', 'non-scaling-stroke')
    const table = within(figure).getByRole('table')
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Point', 'Value'])
    expect(
      within(table)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['1 views', '3 views', '2 views', '5 views'])
  })

  it('reads rows, leaves gaps for missing values and fills the area', () => {
    const { container } = render(
      <Sparkline
        aria-label="Sales"
        data={[
          { day: 'Mon', sales: 4 },
          { day: 'Tue', sales: '6' },
          { day: 'Wed', sales: null },
          { day: 'Thu', sales: 5 },
        ]}
        dataKey="sales"
        categoryKey="day"
        categoryLabel="Day"
        area
        curve="linear"
        height={48}
        width={120}
      />,
    )
    const figure = screen.getByRole('figure', { name: 'Sales' })
    expect(figure).toHaveStyle({ width: '120px', height: '48px' })
    // Two runs: Mon–Tue and Thu.
    expect(lines(container)).toEqual(['M0,100L33.33,0', 'M100,50h0'])
    expect(container.querySelectorAll('path[fill^="url("]')).toHaveLength(2)
    expect(container.querySelector('linearGradient stop')).toHaveStyle({
      stopColor: 'var(--color-primary)',
    })
    const table = within(figure).getByRole('table')
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Mon', 'Tue', 'Wed', 'Thu'])
    expect(within(table).getAllByRole('cell')[2]).toHaveTextContent('–')
  })

  it('treats NaN and infinite numbers as gaps, like missing row values', () => {
    const { container } = render(
      <Sparkline
        title="Trend"
        data={[0, Number.NaN, 10, Number.POSITIVE_INFINITY, 5]}
        curve="linear"
      />,
    )
    // The finite values keep their scale (0 to 10); the others split the line.
    expect(lines(container)).toEqual(['M0,100h0', 'M50,0h0', 'M100,50h0'])
    expect(
      within(screen.getByRole('table'))
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['0', '–', '10', '–', '5'])
  })

  it('renders on the server', () => {
    const html = renderToString(
      <Sparkline title="Trend" data={[1, 2, 3]} table={false} />,
    )
    expect(html).toContain('<figure')
    expect(html).toMatch(/<path d="M0,100C[^"]+"/)
    expect(html).not.toContain('<table')
  })

  it('runs from right to left in right-to-left text', () => {
    const flipped = () =>
      screen.getByRole('figure').querySelector('svg')?.style.transform
    const { rerender } = render(
      <Sparkline title="Trend" data={[1, 2, 3]} dir="rtl" />,
    )
    expect(screen.getByRole('figure')).toHaveAttribute('dir', 'rtl')
    expect(flipped()).toBe('scaleX(-1)')
    rerender(
      <SnowUIProvider dir="rtl">
        <Sparkline title="Trend" data={[1, 2, 3]} />
      </SnowUIProvider>,
    )
    expect(flipped()).toBe('scaleX(-1)')
    rerender(
      <div style={{ direction: 'rtl' }}>
        <Sparkline title="Trend" data={[1, 2, 3]} />
      </div>,
    )
    expect(screen.getByRole('figure')).toHaveAttribute('data-dir', 'rtl')
    expect(flipped()).toBe('scaleX(-1)')
    rerender(<Sparkline title="Trend" data={[1, 2, 3]} />)
    expect(flipped()).toBe('')
  })

  it('warns without an accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Sparkline data={[1, 2]} />)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('A Sparkline needs'),
    )
    render(
      <>
        <span id="label">Trend</span>
        <Sparkline aria-labelledby="label" data={[1, 2]} />
      </>,
    )
    expect(screen.getByRole('figure', { name: 'Trend' })).toBeInTheDocument()
  })
})
