import { type MessagesOverrides, SnowUIProvider } from '@holakirr/snow-ui'
import { render, screen, within } from '@testing-library/react'
import { Bar, BarChart as RechartsBarChart, XAxis } from 'recharts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { ChartContainer } from './ChartContainer'
import type { ChartConfig } from './config'
import { DonutChart } from './DonutChart'
import { LineChart } from './LineChart'
import { Sparkline } from './Sparkline'
import {
  totalUsers,
  totalUsersConfig,
  trafficByLocation,
  trafficByLocationConfig,
} from './test/fixtures'

afterEach(() => {
  vi.restoreAllMocks()
})

const german: MessagesOverrides = {
  charts: {
    empty: 'Keine Daten',
    loading: 'Diagramm lädt',
    keyboardHint: 'Pfeiltasten wechseln den Datenpunkt.',
    navigation: 'Datenpunkte',
    value: 'Wert',
    point: 'Punkt',
  },
}

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig
const data = [{ month: 'Jan', desktop: 1 }]
const chart = (
  <RechartsBarChart data={data}>
    <XAxis dataKey="month" />
    <Bar dataKey="desktop" />
  </RechartsBarChart>
)

const headers = (figure: HTMLElement) =>
  within(within(figure).getByRole('table'))
    .getAllByRole('columnheader')
    .map((cell) => cell.textContent)

describe('chart messages (SnowUIProvider messages.charts)', () => {
  it("translates the ChartContainer's strings", () => {
    const { rerender } = render(
      <SnowUIProvider messages={german}>
        <ChartContainer config={config} title="Besucher">
          {chart}
        </ChartContainer>
      </SnowUIProvider>,
    )
    expect(
      screen.getByRole('application', { name: 'Datenpunkte' }),
    ).toHaveAccessibleDescription('Pfeiltasten wechseln den Datenpunkt.')

    rerender(
      <SnowUIProvider messages={german}>
        <ChartContainer config={config} title="Besucher" empty>
          {chart}
        </ChartContainer>
      </SnowUIProvider>,
    )
    expect(screen.getByText('Keine Daten')).toBeInTheDocument()

    rerender(
      <SnowUIProvider messages={german}>
        <ChartContainer config={config} title="Besucher" loading>
          {chart}
        </ChartContainer>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Diagramm lädt')
  })

  it('lets the props win over the messages', () => {
    render(
      <SnowUIProvider messages={german}>
        <ChartContainer
          config={config}
          title="Besucher"
          navigationLabel="Monate"
          keyboardHint="← →"
        >
          {chart}
        </ChartContainer>
      </SnowUIProvider>,
    )

    expect(
      screen.getByRole('application', { name: 'Monate' }),
    ).toHaveAccessibleDescription('← →')
  })

  it('translates the table headers of DonutChart and Sparkline', () => {
    render(
      <SnowUIProvider messages={german}>
        <DonutChart
          title="Traffic"
          data={trafficByLocation}
          nameKey="country"
          valueKey="visits"
          config={trafficByLocationConfig}
        />
        <Sparkline title="Views" data={[1, 3, 2]} />
      </SnowUIProvider>,
    )

    expect(headers(screen.getByRole('figure', { name: 'Traffic' }))).toEqual([
      'country',
      'Wert',
    ])
    expect(headers(screen.getByRole('figure', { name: 'Views' }))).toEqual([
      'Punkt',
      'Wert',
    ])
  })
})

describe('navigationLabel', () => {
  it.each([
    ['LineChart', LineChart],
    ['AreaChart', AreaChart],
    ['BarChart', BarChart],
  ] as const)('names the focusable plot of %s', (_name, Chart) => {
    render(
      <Chart
        title="Total users"
        data={totalUsers}
        xKey="month"
        config={totalUsersConfig}
        navigationLabel="Months"
      />,
    )

    expect(
      screen.getByRole('application', { name: 'Months' }),
    ).toBeInTheDocument()
  })
})

describe('null props', () => {
  it('keep a null emptyMessage empty and a null table header as in 0.1', () => {
    const { container } = render(
      <SnowUIProvider messages={german}>
        <ChartContainer
          config={config}
          title="Besucher"
          empty
          emptyMessage={null}
        >
          {chart}
        </ChartContainer>
        <Sparkline title="Views" data={[1, 3, 2]} categoryLabel={null} />
      </SnowUIProvider>,
    )

    expect(container.querySelector('.snow-chart__state')).toHaveTextContent('')
    // The header falls back to the column's key, as before the messages.
    expect(headers(screen.getByRole('figure', { name: 'Views' }))).toEqual([
      'point',
      'Wert',
    ])
  })
})
