import { SnowUIProvider } from '@holakirr/snow-ui'
import { act, render, screen, within } from '@testing-library/react'
import type { Locale } from 'date-fns'
import { createRef } from 'react'
import { Bar, BarChart, XAxis } from 'recharts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChartContainer } from './ChartContainer'
import type { ChartConfig } from './config'
import { useChart } from './context'

const data = [
  { month: 'Jan', desktop: 18600, mobile: 8000 },
  { month: 'Feb', desktop: 30500, mobile: null },
]

const config = {
  desktop: { label: 'Desktop', color: 'primary' },
  mobile: { label: 'Mobile', color: 'mint' },
} satisfies ChartConfig

const chart = (
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <Bar dataKey="desktop" />
  </BarChart>
)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ChartContainer', () => {
  it('sets a CSS custom property per series and sizes the plot', () => {
    const { container } = render(
      <ChartContainer config={config} title="Visitors" height={200} width={300}>
        {chart}
      </ChartContainer>,
    )
    const figure = container.querySelector('figure') as HTMLElement
    expect(figure).toHaveClass('snow-chart')
    expect(figure.style.getPropertyValue('--chart-desktop')).toBe(
      'var(--color-primary)',
    )
    expect(figure.style.getPropertyValue('--chart-mobile')).toBe(
      'var(--color-mint)',
    )
    const plot = container.querySelector('[data-slot="chart-plot"]')
    expect(plot).toHaveStyle({ height: '200px', width: '300px' })
  })

  it('names the figure and the chart surface by its title', () => {
    render(
      <ChartContainer
        config={config}
        title="Visitors"
        description="Up 20% since January"
      >
        {chart}
      </ChartContainer>,
    )
    const figure = screen.getByRole('figure', { name: 'Visitors' })
    expect(figure).toHaveAccessibleDescription('Up 20% since January')
    const surface = screen.getByRole('application', { name: 'Visitors' })
    expect(surface).toHaveAccessibleDescription(
      'Up 20% since January Use the left and right arrow keys to move between data points.',
    )
  })

  it('uses aria-labelledby or aria-label instead of a title', () => {
    const { rerender } = render(
      <>
        <h2 id="heading">Sessions</h2>
        <ChartContainer config={config} aria-labelledby="heading">
          {chart}
        </ChartContainer>
      </>,
    )
    expect(screen.getByRole('figure', { name: 'Sessions' })).toBeInTheDocument()
    expect(
      screen.getByRole('application', { name: 'Sessions' }),
    ).toBeInTheDocument()
    rerender(
      <ChartContainer config={config} aria-label="Signups" keyboardHint={false}>
        {chart}
      </ChartContainer>,
    )
    expect(screen.getByRole('figure', { name: 'Signups' })).toBeInTheDocument()
    expect(
      screen.getByRole('application', { name: 'Signups' }),
    ).not.toHaveAttribute('aria-describedby')
  })

  it('warns in development when the chart has no accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<ChartContainer config={config}>{chart}</ChartContainer>)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('A chart needs an accessible name'),
    )
  })

  it('renders the data as a visually hidden table', () => {
    render(
      <ChartContainer
        config={config}
        title="Visitors"
        data={data}
        categoryKey="month"
        categoryLabel="Month"
        valueFormatter={(value, key) => `${key}: ${value}`}
      >
        {chart}
      </ChartContainer>,
    )
    const table = screen.getByRole('table', { name: 'Visitors' })
    expect(table).toHaveClass('snow-chart-sr-only')
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Month', 'Desktop', 'Mobile'])
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Jan', 'Feb'])
    expect(
      within(table)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['desktop: 18600', 'mobile: 8000', 'desktop: 30500', '–'])
  })

  it('formats table values and categories in the locale by default', () => {
    render(
      <ChartContainer
        config={config}
        title="Visitors"
        data={data}
        categoryKey="month"
        tableSeries={['desktop']}
        locale="de-DE"
        categoryFormatter={(value) => `${value} 2025`}
      >
        {chart}
      </ChartContainer>,
    )
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('columnheader')).toHaveLength(2)
    expect(
      within(table).getByRole('rowheader', { name: 'Jan 2025' }),
    ).toBeInTheDocument()
    expect(
      within(table).getByRole('cell', { name: '18.600' }),
    ).toBeInTheDocument()
  })

  it('leaves the table out with table={false} or without a category key', () => {
    const { rerender } = render(
      <ChartContainer
        config={config}
        title="Visitors"
        data={data}
        categoryKey="month"
        table={false}
      >
        {chart}
      </ChartContainer>,
    )
    expect(screen.queryByRole('table')).toBeNull()
    rerender(
      <ChartContainer config={config} title="Visitors" data={data}>
        {chart}
      </ChartContainer>,
    )
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('shows the empty message instead of the chart', () => {
    const { container } = render(
      <ChartContainer
        config={config}
        title="Visitors"
        data={data}
        categoryKey="month"
        empty
        emptyMessage="Nothing yet"
        legend={<span>Legend</span>}
      >
        {chart}
      </ChartContainer>,
    )
    expect(screen.getByText('Nothing yet')).toHaveClass('snow-chart__state')
    expect(container.querySelector('svg')).toBeNull()
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.queryByText('Legend')).toBeNull()
  })

  it('shows a placeholder, aria-busy and the loading label while loading', () => {
    const { container } = render(
      <ChartContainer
        config={config}
        title="Visitors"
        loading
        loadingLabel="Fetching"
      >
        {chart}
      </ChartContainer>,
    )
    expect(screen.getByRole('figure')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Fetching')
    expect(
      container.querySelectorAll('.snow-chart__skeleton-bar'),
    ).toHaveLength(6)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('places the legend before or after the plot', () => {
    const { container, rerender } = render(
      <ChartContainer config={config} title="Visitors" legend={<p>Legend</p>}>
        {chart}
      </ChartContainer>,
    )
    const order = () =>
      [...(container.querySelector('figure') as HTMLElement).children]
        .map((child) => child.getAttribute('data-slot') ?? child.textContent)
        .filter((item) => item === 'Legend' || item === 'chart-plot')
    expect(order()).toEqual(['Legend', 'chart-plot'])
    expect(container.querySelector('figure')).toHaveAttribute(
      'data-legend',
      'top',
    )
    rerender(
      <ChartContainer
        config={config}
        title="Visitors"
        legend={<p>Legend</p>}
        legendPosition="end"
      >
        {chart}
      </ChartContainer>,
    )
    expect(order()).toEqual(['chart-plot', 'Legend'])
    expect(container.querySelector('figure')).toHaveAttribute(
      'data-legend',
      'end',
    )
  })

  it('forwards its ref and extra props to the figure', () => {
    const ref = createRef<HTMLElement>()
    render(
      <ChartContainer
        ref={ref}
        config={config}
        title="Visitors"
        id="chart"
        className="extra"
        data-testid="c"
      >
        {chart}
      </ChartContainer>,
    )
    expect(ref.current).toBe(screen.getByTestId('c'))
    expect(ref.current).toHaveAttribute('id', 'chart')
    expect(ref.current).toHaveClass('snow-chart', 'extra')
    const callback = vi.fn()
    render(
      <ChartContainer ref={callback} config={config} title="Other">
        {chart}
      </ChartContainer>,
    )
    expect(callback).toHaveBeenCalledWith(expect.any(HTMLElement))
  })
})

describe('direction and locale', () => {
  const Probe = () => {
    const context = useChart()
    return (
      <output>
        {context?.dir} {context?.locale}
      </output>
    )
  }

  it('defaults to left-to-right and en-US', () => {
    render(
      <ChartContainer config={config} title="Probe" overlay={<Probe />}>
        {chart}
      </ChartContainer>,
    )
    expect(screen.getByText('ltr en-US')).toBeInTheDocument()
    expect(screen.getByRole('figure')).toHaveAttribute('data-dir', 'ltr')
  })

  it('takes the direction and language of SnowUIProvider', () => {
    render(
      <SnowUIProvider dir="rtl" locale={{ code: 'ar-EG' } as Locale}>
        <ChartContainer config={config} title="Probe" overlay={<Probe />}>
          {chart}
        </ChartContainer>
      </SnowUIProvider>,
    )
    expect(screen.getByText('rtl ar-EG')).toBeInTheDocument()
    expect(screen.getByRole('figure')).toHaveAttribute('data-dir', 'rtl')
  })

  it('prefers its own dir and locale props', () => {
    render(
      <SnowUIProvider dir="rtl" locale={{ code: 'ar-EG' } as Locale}>
        <ChartContainer
          config={config}
          title="Probe"
          dir="ltr"
          locale="fr-FR"
          overlay={<Probe />}
        >
          {chart}
        </ChartContainer>
      </SnowUIProvider>,
    )
    expect(screen.getByText('ltr fr-FR')).toBeInTheDocument()
  })

  it('reads the computed direction of the page without a provider', () => {
    render(
      <div style={{ direction: 'rtl' }}>
        <ChartContainer config={config} title="Probe" overlay={<Probe />}>
          {chart}
        </ChartContainer>
      </div>,
    )
    expect(screen.getByRole('figure')).toHaveAttribute('data-dir', 'rtl')
  })

  it('announces text only while the chart has focus', () => {
    let announce: ((text: string) => void) | undefined
    const Grab = () => {
      announce = useChart()?.announce
      return null
    }
    render(
      <>
        <button type="button">Outside</button>
        <ChartContainer config={config} title="Probe" overlay={<Grab />}>
          {chart}
        </ChartContainer>
      </>,
    )
    const status = screen.getByRole('status')
    act(() => announce?.('Jan: Desktop 18,600'))
    expect(status).toBeEmptyDOMElement()
    act(() => screen.getByRole('application').focus())
    act(() => announce?.('Jan: Desktop 18,600'))
    expect(status).toHaveTextContent('Jan: Desktop 18,600')
  })
})
