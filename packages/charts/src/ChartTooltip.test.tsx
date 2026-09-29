import { act, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Bar, BarChart } from 'recharts'
import { describe, expect, it } from 'vitest'
import { ChartContainer } from './ChartContainer'
import { ChartLegendContent } from './ChartLegend'
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartTooltipItem,
} from './ChartTooltip'
import type { ChartConfig } from './config'

const config = {
  desktop: { label: 'Desktop', color: 'primary' },
  mobile: { label: 'Mobile', color: 'mint', dashed: true },
} satisfies ChartConfig

const payload: ChartTooltipItem[] = [
  {
    dataKey: 'desktop',
    name: 'desktop',
    value: 18600,
    color: '#000',
    payload: { month: 'Jan' },
  },
  {
    dataKey: 'mobile',
    name: 'mobile',
    value: 8000,
    color: '#0f0',
    payload: { month: 'Jan' },
  },
]

/** Renders tooltip content inside a chart (for its config and formatters). */
const inChart = (
  content: ReactNode,
  props: {
    locale?: string
    valueFormatter?: (value: number, key: string) => string
    categoryFormatter?: (value: unknown) => string
  } = {},
) =>
  render(
    <ChartContainer
      config={config}
      title="Visitors"
      {...props}
      overlay={content}
    >
      <BarChart data={[]} />
    </ChartContainer>,
  )

const tooltip = () =>
  document.querySelector('[data-slot="chart-tooltip"]') as HTMLElement

describe('ChartTooltipContent', () => {
  it('renders nothing while inactive or without values', () => {
    inChart(
      <ChartTooltipContent active={false} payload={payload} label="Jan" />,
    )
    expect(tooltip()).toBeNull()
    inChart(<ChartTooltipContent active payload={[]} label="Jan" />)
    expect(tooltip()).toBeNull()
  })

  it('shows the category and each series with its label, colour and formatted value', () => {
    inChart(<ChartTooltipContent active payload={payload} label="Jan" />)
    const content = tooltip()
    expect(content).toHaveAttribute('data-variant', 'dark')
    expect(
      content.querySelector('.snow-chart-tooltip__label'),
    ).toHaveTextContent('Jan')
    const rows = within(content).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual([
      'Desktop18,600',
      'Mobile8,000',
    ])
    const swatches = content.querySelectorAll('.snow-chart-swatch')
    expect(swatches[0]).toHaveStyle({
      '--snow-chart-swatch': 'var(--chart-desktop)',
    })
    // A dashed series gets a hollow marker.
    expect(swatches[1]).toHaveAttribute('data-dashed', 'true')
  })

  it('uses the chart locale and formatters, or its own', () => {
    inChart(<ChartTooltipContent active payload={payload} label="Jan" />, {
      locale: 'de-DE',
      categoryFormatter: (value) => `${value}.`,
    })
    expect(tooltip()).toHaveTextContent('Jan.Desktop18.600Mobile8.000')
    act(() => document.body.replaceChildren())
    inChart(
      <ChartTooltipContent
        active
        payload={payload}
        label="Jan"
        variant="light"
        valueFormatter={(value, key) => `${key}=${value}`}
        labelFormatter={(label, items) => `${label} (${items.length})`}
      />,
      { valueFormatter: () => 'ignored' },
    )
    expect(tooltip()).toHaveAttribute('data-variant', 'light')
    expect(tooltip()).toHaveTextContent(
      'Jan (2)Desktopdesktop=18600Mobilemobile=8000',
    )
  })

  it('lists a series once when a projection repeats it', () => {
    inChart(
      <ChartTooltipContent
        active
        label="Apr"
        payload={[
          payload[0] as ChartTooltipItem,
          { ...payload[0], dataKey: '__snow_projection__desktop' },
        ]}
      />,
    )
    expect(within(tooltip()).getAllByRole('listitem')).toHaveLength(1)
  })

  it('shows the own value of a stacked series, not its running sum', () => {
    inChart(
      <ChartTooltipContent
        active
        label="Jan"
        payload={[
          {
            dataKey: '__snow_stack__desktop',
            name: 'desktop',
            value: [0, 18600],
            payload: { desktop: 18600, mobile: 8000 },
          },
          {
            dataKey: '__snow_stack__mobile',
            name: 'mobile',
            value: [18600, 26600],
            payload: { desktop: 18600, mobile: 8000 },
          },
        ]}
      />,
    )
    expect(
      within(tooltip())
        .getAllByRole('listitem')
        .map((row) => row.textContent),
    ).toEqual(['Desktop18,600', 'Mobile8,000'])
  })

  it('hides the label and the indicators on request', () => {
    inChart(
      <ChartTooltipContent
        active
        payload={payload}
        label="Jan"
        hideLabel
        hideIndicator
      />,
    )
    expect(tooltip().querySelector('.snow-chart-tooltip__label')).toBeNull()
    expect(tooltip().querySelector('.snow-chart-swatch')).toBeNull()
  })

  it('finds the config key in a payload field (nameKey) and colours by another (colorKey)', () => {
    const Icon = () => <svg data-testid="icon" />
    render(
      <ChartContainer
        config={{
          users: { label: 'Users' },
          Linux: { label: 'Linux', color: 'cyan', icon: Icon },
        }}
        title="Devices"
        overlay={
          <>
            <ChartTooltipContent
              active
              label="Linux"
              colorKey="device"
              payload={[
                {
                  name: 'users',
                  dataKey: 'users',
                  value: 15000,
                  payload: { device: 'Linux' },
                },
              ]}
            />
            <ChartTooltipContent
              active
              hideLabel
              nameKey="device"
              payload={[
                { name: 'x', value: 52.1, payload: { device: 'Linux' } },
              ]}
            />
          </>
        }
      >
        <BarChart data={[]} />
      </ChartContainer>,
    )
    const [byColor, byName] = document.querySelectorAll(
      '[data-slot="chart-tooltip"]',
    )
    expect(byColor?.querySelector('.snow-chart-swatch')).toHaveStyle({
      '--snow-chart-swatch': 'var(--chart-Linux)',
    })
    expect(byColor).toHaveTextContent('LinuxUsers15,000')
    // The series icon replaces the dot.
    expect(
      within(byName as HTMLElement).getByTestId('icon'),
    ).toBeInTheDocument()
    expect(byName).toHaveTextContent('Linux52.1')
  })

  it('falls back to the payload colour and shows ranges and text values', () => {
    render(
      <ChartTooltipContent
        active
        label="Q1"
        config={{ range: { label: 'Range' } }}
        payload={[
          { name: 'range', value: [10, 20] },
          { name: 'other', value: 'n/a', fill: '#123456' },
        ]}
      />,
    )
    const content = tooltip()
    // Outside a ChartContainer, the config sets its own properties.
    expect(content.style.getPropertyValue('--chart-range')).toBe(
      'var(--color-primary)',
    )
    expect(content).toHaveTextContent('Q1Range10 – 20')
    expect(content.querySelectorAll('.snow-chart-swatch')[1]).toHaveStyle({
      '--snow-chart-swatch': '#123456',
    })
    expect(content).toHaveTextContent('othern/a')
  })

  it('announces the values while the chart has keyboard focus', () => {
    const { rerender } = inChart(
      <ChartTooltipContent active={false} payload={payload} label="Jan" />,
    )
    act(() => screen.getByRole('application').focus())
    rerender(
      <ChartContainer
        config={config}
        title="Visitors"
        overlay={<ChartTooltipContent active payload={payload} label="Jan" />}
      >
        <BarChart data={[]} />
      </ChartContainer>,
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'Jan: Desktop 18,600, Mobile 8,000',
    )
  })
})

describe('ChartTooltip', () => {
  it('is a Recharts tooltip with the SnowUI content', () => {
    const { container } = render(
      <ChartContainer config={config} title="Visitors" dir="rtl">
        <BarChart data={[{ m: 'Jan', desktop: 1 }]}>
          <Bar dataKey="desktop" />
          <ChartTooltip />
        </BarChart>
      </ChartContainer>,
    )
    expect(
      container.querySelector('.recharts-tooltip-wrapper'),
    ).toBeInTheDocument()
  })
})

describe('ChartLegendContent', () => {
  it('lists every series of the config with its colour', () => {
    inChart(<ChartLegendContent aria-label="Series" />)
    const legend = screen.getByRole('list', { name: 'Series' })
    expect(legend).toHaveAttribute('data-layout', 'horizontal')
    const items = within(legend).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Desktop', 'Mobile'])
    expect(items[0]?.querySelector('.snow-chart-swatch')).toHaveStyle({
      '--snow-chart-swatch': 'var(--chart-desktop)',
    })
    expect(items[1]?.querySelector('.snow-chart-swatch')).toHaveAttribute(
      'data-dashed',
      'true',
    )
  })

  it('shows values after the labels in a vertical layout', () => {
    inChart(
      <ChartLegendContent
        keys={['mobile']}
        values={{ mobile: '22.8%' }}
        layout="vertical"
        hideIndicator
      />,
    )
    const legend = screen.getByRole('list')
    expect(legend).toHaveAttribute('data-layout', 'vertical')
    expect(legend).toHaveTextContent('Mobile22.8%')
    expect(legend.querySelector('.snow-chart-swatch')).toBeNull()
  })

  it('maps the payload of Recharts’ legend to config keys', () => {
    inChart(
      <ChartLegendContent
        payload={[
          { dataKey: 'mobile', value: 'mobile' },
          { dataKey: (row: unknown) => row, value: 'desktop' },
        ]}
      />,
    )
    expect(
      within(screen.getByRole('list'))
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Mobile', 'Desktop'])
  })

  it('works outside a chart with its own config, and renders nothing without series', () => {
    const Icon = () => <svg data-testid="legend-icon" />
    const { container } = render(
      <>
        <ChartLegendContent
          config={{ a: { label: 'Alpha', color: 'red', icon: Icon } }}
        />
        <ChartLegendContent config={{}} />
      </>,
    )
    const legends = container.querySelectorAll('ul')
    expect(legends).toHaveLength(1)
    expect(
      (legends[0] as HTMLElement).style.getPropertyValue('--chart-a'),
    ).toBe('var(--color-red)')
    expect(screen.getByTestId('legend-icon')).toBeInTheDocument()
  })
})
