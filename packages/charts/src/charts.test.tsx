import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { DonutChart } from './DonutChart'
import { LineChart } from './LineChart'
import { Sparkline } from './Sparkline'
import {
  projections,
  projectionsConfig,
  revenue,
  revenueConfig,
  totalUsers,
  totalUsersConfig,
  trafficByDevice,
  trafficByDeviceConfig,
  trafficByLocation,
  trafficByLocationConfig,
} from './test/fixtures'

afterEach(() => {
  vi.restoreAllMocks()
})

/** The x positions of the category axis labels, by label. */
const tickX = (container: HTMLElement, axis: 'xAxis' | 'yAxis' = 'xAxis') =>
  Object.fromEntries(
    [...container.querySelectorAll(`.recharts-${axis}-tick-labels text`)].map(
      (text) => [text.textContent, Number(text.getAttribute('x'))],
    ),
  )

describe('LineChart', () => {
  it('draws a line per series with the SnowUI axes, legend and table', async () => {
    const { container } = render(
      <LineChart
        title="Revenue"
        data={revenue}
        xKey="month"
        config={revenueConfig}
        legendValues={{ current: '$58K' }}
      />,
    )
    await waitFor(() =>
      expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(
        2,
      ),
    )
    const [current, previous] = container.querySelectorAll(
      '.recharts-line-curve',
    )
    expect(current).toHaveAttribute('stroke', 'var(--chart-current)')
    expect(current).toHaveAttribute('stroke-width', '1')
    expect(current).not.toHaveAttribute('stroke-dasharray')
    // `dashed` in the config.
    expect(previous).toHaveAttribute('stroke-dasharray', '2 4')
    // Axis labels: 12px text-secondary, compact values.
    const tick = container.querySelector('.recharts-xAxis-tick-labels text')
    expect(tick).toHaveAttribute('fill', 'var(--color-text-secondary)')
    expect(tick).toHaveAttribute('font-size', '12')
    expect(Object.keys(tickX(container, 'yAxis'))).toEqual([
      '0',
      '10K',
      '20K',
      '30K',
    ])
    // Gridlines and baseline.
    expect(
      container.querySelector('.recharts-cartesian-grid line'),
    ).toHaveAttribute('stroke', 'var(--color-black-4)')
    expect(container.querySelector('.recharts-xAxis line')).toHaveAttribute(
      'stroke',
      'var(--color-black-20)',
    )
    // Two series: a legend.
    expect(
      within(
        container.querySelector('[data-slot="chart-legend"]') as HTMLElement,
      )
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Current week$58K', 'Previous week'])
    expect(screen.getByRole('table', { name: 'Revenue' })).toBeInTheDocument()
  })

  it('dashes the lines after projectionFrom', async () => {
    const { container } = render(
      <LineChart
        title="Revenue"
        data={revenue}
        xKey="month"
        config={revenueConfig}
        projectionFrom="Apr"
        fade
        dots
        curve="linear"
      />,
    )
    await waitFor(() =>
      expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(
        3,
      ),
    )
    const curves = [...container.querySelectorAll('.recharts-line-curve')]
    const dashes = curves.map((curve) => curve.getAttribute('stroke-dasharray'))
    // The current week solid, then dashed; the previous week dashed throughout.
    expect(dashes).toEqual([null, '2 4', '2 4'])
    // `fade`: the strokes are horizontal gradients.
    expect(curves[0]?.getAttribute('stroke')).toMatch(
      /^url\(#snow-chart-.+-fade-0\)$/,
    )
    expect(
      container.querySelectorAll(
        'linearGradient[gradientUnits="userSpaceOnUse"]',
      ),
    ).toHaveLength(2)
    expect(container.querySelectorAll('.recharts-line-dots')).not.toHaveLength(
      0,
    )
    // The table keeps the original values.
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(revenue.length + 1)
  })

  it('shows no legend for a single series and hides axes, grid and tooltip on request', async () => {
    const { container } = render(
      <LineChart
        title="Current"
        data={revenue}
        xKey="month"
        config={revenueConfig}
        series={['current']}
        grid={false}
        xAxis={false}
        yAxis={false}
        tooltip={false}
      />,
    )
    await waitFor(() =>
      expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(
        1,
      ),
    )
    expect(container.querySelector('[data-slot="chart-legend"]')).toBeNull()
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull()
    expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull()
    expect(
      container.querySelectorAll('.recharts-cartesian-axis-tick-labels text'),
    ).toHaveLength(0)
  })

  it('mirrors the axes in right-to-left text', async () => {
    const { container, rerender } = render(
      <LineChart
        title="Users"
        data={totalUsers}
        xKey="month"
        config={totalUsersConfig}
      />,
    )
    await waitFor(() => expect(Object.keys(tickX(container))).toHaveLength(7))
    const ltr = tickX(container)
    expect(ltr.Jan).toBeLessThan(ltr.Jul as number)
    rerender(
      <LineChart
        title="Users"
        data={totalUsers}
        xKey="month"
        config={totalUsersConfig}
        dir="rtl"
      />,
    )
    await waitFor(() => {
      const rtl = tickX(container)
      expect(rtl.Jan).toBeGreaterThan(rtl.Jul as number)
    })
    // The value axis moves to the right.
    const yLabel = container.querySelector('.recharts-yAxis-tick-labels text')
    expect(yLabel).toHaveAttribute('text-anchor', 'start')
    expect(container.querySelector('[data-slot="chart"]')).toHaveAttribute(
      'data-dir',
      'rtl',
    )
  })

  it('shows the empty message without data', () => {
    render(
      <LineChart
        title="Users"
        data={[]}
        xKey="month"
        config={totalUsersConfig}
        emptyMessage="Nothing"
      />,
    )
    expect(screen.getByText('Nothing')).toBeInTheDocument()
  })
})

describe('AreaChart', () => {
  it('fills each series with a gradient of its colour, from its opacity to 0', async () => {
    const { container } = render(
      <AreaChart
        title="Users"
        data={totalUsers}
        xKey="month"
        config={totalUsersConfig}
        stacked
      />,
    )
    await waitFor(() =>
      expect(container.querySelectorAll('.recharts-area-area')).toHaveLength(2),
    )
    const gradients = container.querySelectorAll('linearGradient[x2="0"]')
    expect(gradients).toHaveLength(2)
    const stops = (index: number) =>
      [...(gradients[index] as Element).querySelectorAll('stop')].map(
        (stop) => (stop as SVGStopElement).style.stopOpacity,
      )
    // This year: 10% → 0 (Figma); last year: opacity 0 (a line only).
    expect(stops(0)).toEqual(['0.1', '0'])
    expect(stops(1)).toEqual(['0', '0'])
    const area = container.querySelector('.recharts-area-area')
    expect(area?.getAttribute('fill')).toMatch(/^url\(#snow-chart-.+-area-0\)$/)
  })
})

describe('BarChart', () => {
  it('colours each bar by its category', async () => {
    const { container } = render(
      <BarChart
        title="Traffic by device"
        data={trafficByDevice}
        xKey="device"
        config={trafficByDeviceConfig}
        colorBy="category"
      />,
    )
    const figure = container.querySelector('[data-slot="chart"]') as HTMLElement
    expect(figure.style.getPropertyValue('--chart-Windows')).toBe(
      'var(--color-blue)',
    )
    await waitFor(() =>
      expect(
        container.querySelectorAll('.recharts-bar-rectangle path'),
      ).toHaveLength(6),
    )
    const bars = [...container.querySelectorAll('.recharts-bar-rectangle path')]
    expect(bars.map((bar) => bar.getAttribute('fill'))).toEqual(
      trafficByDevice.map(({ device }) => `var(--chart-${device})`),
    )
    // One series: no legend; the table has the users column only.
    expect(container.querySelector('[data-slot="chart-legend"]')).toBeNull()
    expect(
      within(screen.getByRole('table')).getAllByRole('columnheader'),
    ).toHaveLength(2)
  })

  it('stacks series with their opacity and lists categories in the legend on request', async () => {
    const { container } = render(
      <BarChart
        title="Projections vs actuals"
        data={projections}
        xKey="month"
        config={projectionsConfig}
        colorBy="category"
        stacked
      />,
    )
    await waitFor(() =>
      expect(
        container.querySelectorAll('.recharts-bar-rectangle path'),
      ).toHaveLength(12),
    )
    const rest = container.querySelectorAll('.recharts-bar')[1]
    expect(rest?.querySelector('path')).toHaveAttribute('fill-opacity', '0.2')
    // Two series: a legend of the series.
    expect(
      within(
        container.querySelector('[data-slot="chart-legend"]') as HTMLElement,
      )
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Actual', 'Rest of projection'])

    const single = render(
      <BarChart
        title="Devices"
        data={trafficByDevice}
        xKey="device"
        config={{ users: { label: 'Users' } }}
        colorBy="category"
        legend
      />,
    )
    // Missing category colours come from the palette.
    const figure = single.container.querySelector(
      '[data-slot="chart"]',
    ) as HTMLElement
    expect(figure.style.getPropertyValue('--chart-Linux')).toBe(
      'var(--color-primary)',
    )
    expect(figure.style.getPropertyValue('--chart-Mac')).toBe(
      'var(--color-blue)',
    )
    expect(
      within(
        single.container.querySelector(
          '[data-slot="chart-legend"]',
        ) as HTMLElement,
      ).getAllByRole('listitem'),
    ).toHaveLength(6)
  })

  it('draws horizontal bars, mirrored in right-to-left text', async () => {
    const { container } = render(
      <BarChart
        title="Devices"
        data={trafficByDevice}
        xKey="device"
        config={trafficByDeviceConfig}
        horizontal
        dir="rtl"
        radius={4}
        barSize={20}
      />,
    )
    await waitFor(() =>
      expect(Object.keys(tickX(container))).not.toHaveLength(0),
    )
    // Values along x, from the right.
    const x = tickX(container)
    expect(x['0']).toBeGreaterThan(x['30K'] as number)
    // Categories on the right.
    expect(
      container.querySelector('.recharts-yAxis-tick-labels text'),
    ).toHaveAttribute('text-anchor', 'start')
  })
})

describe('DonutChart', () => {
  it('draws a slice per category with the legend of shares and the table', async () => {
    const { container } = render(
      <DonutChart
        title="Traffic by location"
        data={trafficByLocation}
        nameKey="country"
        valueKey="visits"
        config={trafficByLocationConfig}
        valueLabel="Visits"
        centerLabel="Total"
        centerValue="100%"
      />,
    )
    const svg = container.querySelector('svg.recharts-surface')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('tabindex')
    await waitFor(() =>
      expect(
        container.querySelectorAll('.recharts-pie-sector path'),
      ).toHaveLength(4),
    )
    const sectors = [...container.querySelectorAll('.recharts-pie-sector path')]
    expect(sectors[0]).toHaveAttribute('fill', 'var(--chart-United_20States)')
    const legend = container.querySelector(
      '[data-slot="chart-legend"]',
    ) as HTMLElement
    expect(legend).toHaveAttribute('data-layout', 'vertical')
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'United States52.1%',
      'Canada22.8%',
      'Mexico13.9%',
      'Other11.2%',
    ])
    expect(
      container.querySelector('.snow-chart-donut__center'),
    ).toHaveTextContent('Total100%')
    const table = screen.getByRole('table', { name: 'Traffic by location' })
    expect(
      within(table).getByRole('columnheader', { name: 'Visits' }),
    ).toBeInTheDocument()
    expect(
      within(table).getByRole('cell', { name: '52.1' }),
    ).toBeInTheDocument()
    // Not a keyboard stop: no hint.
    expect(screen.queryByText(/arrow keys/)).toBeNull()
  })

  it('shows values or nothing in the legend, and the empty state without a total', () => {
    const { container, rerender } = render(
      <DonutChart
        title="Visits"
        data={trafficByLocation}
        nameKey="country"
        valueKey="visits"
        legend="value"
        valueFormatter={(value) => `${value} visits`}
      />,
    )
    expect(
      container.querySelector('[data-slot="chart-legend"]'),
    ).toHaveTextContent('United States52.1 visits')
    rerender(
      <DonutChart
        title="Visits"
        data={trafficByLocation}
        nameKey="country"
        valueKey="visits"
        legend="none"
      />,
    )
    expect(container.querySelector('.snow-chart-legend__value')).toBeNull()
    rerender(
      <DonutChart
        title="Visits"
        data={trafficByLocation}
        nameKey="country"
        valueKey="visits"
        legend={false}
        tooltip={false}
      />,
    )
    expect(container.querySelector('[data-slot="chart-legend"]')).toBeNull()
    rerender(
      <DonutChart
        title="Visits"
        data={[{ country: 'None', visits: 0 }]}
        nameKey="country"
        valueKey="visits"
      />,
    )
    expect(screen.getByText('No data')).toBeInTheDocument()
  })
})

describe('Sparkline', () => {
  it('is a named image of a line', async () => {
    const { container } = render(
      <Sparkline
        title="Views, last 7 days"
        data={[1, 3, 2, 5]}
        color="indigo"
        dashed
      />,
    )
    const image = screen.getByRole('img', { name: 'Views, last 7 days' })
    expect(image).toHaveStyle({ height: '32px', width: '100%' })
    expect(image.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    await waitFor(() =>
      expect(container.querySelector('.recharts-line-curve')).not.toBeNull(),
    )
    const line = container.querySelector('.recharts-line-curve')
    expect(line).toHaveAttribute('stroke', 'var(--color-indigo)')
    expect(line).toHaveAttribute('stroke-dasharray', '2 4')
  })

  it('reads rows with a data key and fills the area', async () => {
    const { container } = render(
      <Sparkline
        aria-label="Sales"
        data={[{ sales: 4 }, { sales: '6' }, { sales: null }]}
        dataKey="sales"
        area
        curve="linear"
        height={48}
        width={120}
      />,
    )
    expect(screen.getByRole('img', { name: 'Sales' })).toHaveStyle({
      width: '120px',
    })
    await waitFor(() =>
      expect(container.querySelector('.recharts-area-area')).not.toBeNull(),
    )
    expect(container.querySelector('linearGradient stop')).toHaveStyle({
      stopColor: 'var(--color-primary)',
    })
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
    expect(screen.getByRole('img', { name: 'Trend' })).toBeInTheDocument()
  })
})
