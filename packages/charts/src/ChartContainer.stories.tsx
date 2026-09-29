import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ChartContainer } from './ChartContainer'
import { ChartLegend, ChartLegendContent } from './ChartLegend'
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip'
import { type ChartConfig, seriesColor } from './config'
import { DashboardCard } from './test/DashboardCard'
import { chartSurface, visibleTooltip } from './test/play'

const meta: Meta<typeof ChartContainer> = {
  title: 'Charts/ChartContainer',
  component: ChartContainer,
  tags: ['autodocs', 'a11y'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      // The SnowUI Chart page: the chart kit (bars, gridlines, axis labels).
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25596-130956',
    },
  },
}

export default meta
type Story = StoryObj<typeof ChartContainer>

const data = [
  { month: 'Jan', desktop: 18600, mobile: 8000 },
  { month: 'Feb', desktop: 30500, mobile: 20000 },
  { month: 'Mar', desktop: 23700, mobile: 12000 },
  { month: 'Apr', desktop: 7300, mobile: 19000 },
  { month: 'May', desktop: 20900, mobile: 13000 },
  { month: 'Jun', desktop: 21400, mobile: 14000 },
]

const config = {
  desktop: { label: 'Desktop', color: 'primary' },
  mobile: { label: 'Mobile', color: 'mint' },
} satisfies ChartConfig

const tick = { fill: 'var(--color-text-secondary)', fontSize: 12 }

/**
 * Composable: Recharts parts inside `ChartContainer`. The container sets
 * `--chart-desktop` / `--chart-mobile` from the config (use them with
 * `seriesColor(key)`), sizes the chart and adds the data table; the tooltip
 * and the legend read the labels and colours from it.
 */
export const Composable: Story = {
  render: () => (
    <DashboardCard title="Visitors">
      {(titleId) => (
        <ChartContainer
          config={config}
          aria-labelledby={titleId}
          data={data}
          categoryKey="month"
          categoryLabel="Month"
          legend={<ChartLegendContent />}
        >
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-black-4)"
              strokeWidth={0.5}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: 'var(--color-black-20)', strokeWidth: 0.5 }}
              tick={tick}
              tickMargin={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={tick}
              tickMargin={16}
              width="auto"
              tickFormatter={(value: number) => `${value / 1000}K`}
            />
            <Bar
              dataKey="desktop"
              fill={seriesColor('desktop')}
              radius={8}
              maxBarSize={28}
            />
            <Bar
              dataKey="mobile"
              fill={seriesColor('mobile')}
              radius={8}
              maxBarSize={28}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-black-4)', stroke: 'none' }}
            />
          </BarChart>
        </ChartContainer>
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const figure = canvasElement.querySelector(
      '[data-slot="chart"]',
    ) as HTMLElement
    expect(figure.style.getPropertyValue('--chart-desktop')).toBe(
      'var(--color-primary)',
    )
    expect(figure.style.getPropertyValue('--chart-mobile')).toBe(
      'var(--color-mint)',
    )
    const surface = await chartSurface(canvasElement)
    expect(surface).toHaveAccessibleName('Visitors')
    // Keyboard focus shows the first month, → the next one.
    await userEvent.tab()
    let tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Jan'))
    expect(tooltip).toHaveTextContent('Desktop18,600')
    await userEvent.keyboard('{ArrowRight}')
    tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Feb'))
    expect(tooltip).toHaveTextContent('Mobile20,000')
    const table = within(canvasElement).getByRole('table', { name: 'Visitors' })
    expect(
      within(table).getByRole('columnheader', { name: 'Month' }),
    ).toBeInTheDocument()
  },
}

export const ComposableDark: Story = {
  ...Composable,
  globals: { theme: 'dark' },
  play: undefined,
}

/** Recharts' own legend (`<ChartLegend content={<ChartLegendContent />} />`), inside the plot area. */
export const RechartsLegend: Story = {
  render: () => (
    <DashboardCard title="Sessions">
      {(titleId) => (
        <ChartContainer
          config={config}
          aria-labelledby={titleId}
          data={data}
          categoryKey="month"
          height={260}
        >
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={tick}
              tickMargin={12}
            />
            <Line
              dataKey="desktop"
              stroke={seriesColor('desktop')}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="mobile"
              stroke={seriesColor('mobile')}
              dot={false}
              type="monotone"
              strokeDasharray="2 4"
            />
            <ChartTooltip content={<ChartTooltipContent variant="light" />} />
            <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
          </LineChart>
        </ChartContainer>
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const legend = await waitFor(() => {
      const found = canvasElement.querySelector('[data-slot="chart-legend"]')
      expect(found).not.toBeNull()
      return found as HTMLElement
    })
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Desktop', 'Mobile'])
  },
}

/**
 * `valueFormatter` and `locale`: the tooltip, the legend and the table format
 * values the same way (here euros in German).
 */
export const Formatters: Story = {
  render: () => (
    <DashboardCard title="Umsatz">
      {(titleId) => (
        <ChartContainer
          config={{ desktop: { label: 'Umsatz', color: 'indigo' } }}
          aria-labelledby={titleId}
          data={data}
          categoryKey="month"
          categoryLabel="Monat"
          locale="de-DE"
          valueFormatter={(value) =>
            new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }).format(value)
          }
          keyboardHint="Mit den Pfeiltasten links und rechts zwischen den Monaten wechseln."
        >
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={tick}
              tickMargin={12}
            />
            <Bar
              dataKey="desktop"
              fill={seriesColor('desktop')}
              radius={8}
              maxBarSize={28}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-black-4)', stroke: 'none' }}
            />
          </BarChart>
        </ChartContainer>
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table')
    expect(
      within(table).getByRole('cell', { name: /30\.500,00\s€/ }),
    ).toBeInTheDocument()
    const surface = await chartSurface(canvasElement)
    surface.focus()
    await userEvent.keyboard('{ArrowRight}')
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent(/30\.500,00\s€/))
  },
}

/** `loading`: a placeholder, `aria-busy` and the announced `loadingLabel`. */
export const Loading: Story = {
  render: () => (
    <DashboardCard title="Visitors">
      {(titleId) => (
        <ChartContainer config={config} aria-labelledby={titleId} loading>
          <BarChart data={data} />
        </ChartContainer>
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-slot="chart"]')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Loading chart',
    )
  },
}

export const LoadingDark: Story = {
  ...Loading,
  globals: { theme: 'dark' },
  play: undefined,
}

/** `empty`: the `emptyMessage` instead of the chart. */
export const Empty: Story = {
  render: () => (
    <DashboardCard title="Visitors">
      {(titleId) => (
        <ChartContainer
          config={config}
          aria-labelledby={titleId}
          empty
          emptyMessage="No visitors yet"
        >
          <BarChart data={[]} />
        </ChartContainer>
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText('No visitors yet')).toBeVisible()
  },
}

export const EmptyDark: Story = {
  ...Empty,
  globals: { theme: 'dark' },
  play: undefined,
}
