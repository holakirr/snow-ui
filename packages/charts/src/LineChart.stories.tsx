import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { LineChart } from './LineChart'
import { DashboardCard } from './test/DashboardCard'
import {
  revenue,
  revenueConfig,
  totalUsers,
  totalUsersConfig,
  weekly,
  weeklyConfig,
} from './test/fixtures'
import {
  chartSurface,
  DRAWN,
  endInteraction,
  hoverChartAt,
  visibleTooltip,
} from './test/play'

const usd = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs', 'a11y'],
  parameters: {
    // A dashboard block: the chart is as wide as its card.
    layout: 'padded',
    design: {
      type: 'figma',
      // Chart page, "ChartMotion" with the "Line 01" graphic.
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=30485-100231',
    },
  },
}

export default meta
type Story = StoryObj<typeof LineChart>

/** The Figma "Revenue" block: the current week (Primary) against the previous week (Cyan, dashed). */
export const Revenue: Story = {
  render: () => (
    <DashboardCard title="Revenue">
      {(titleId) => (
        <LineChart
          aria-labelledby={titleId}
          description="The current week ends at $26K, the previous week at $29K."
          data={revenue}
          xKey="month"
          config={revenueConfig}
          valueFormatter={usd}
          legendValues={{ current: '$58,211', previous: '$68,768' }}
          grid={false}
          fade
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The legend names both series.
    const legend = canvasElement.querySelector('[data-slot="chart-legend"]')
    expect(legend).toHaveTextContent('Current week$58,211')
    expect(legend).toHaveTextContent('Previous week$68,768')
    // The chart is named once, by the card title; its focusable plot is
    // the data points.
    const surface = await chartSurface(canvasElement)
    expect(canvas.getByRole('figure', { name: 'Revenue' })).toBeInTheDocument()
    expect(surface).toHaveAccessibleName('Data points')
    // The data table has every value, formatted.
    const table = canvas.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(7)
    expect(
      within(table).getByRole('cell', { name: '$26,000' }),
    ).toBeInTheDocument()
  },
}

/** Keyboard: Tab to the chart, then ← / → move the tooltip between months (and announce it). */
export const KeyboardNavigation: Story = {
  ...Revenue,
  play: async ({ canvasElement }) => {
    const surface = await chartSurface(canvasElement)
    await userEvent.tab()
    expect(surface).toHaveFocus()
    // Focus shows the first month; → moves to the next one.
    let tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Jan'))
    await userEvent.keyboard('{ArrowRight}')
    tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Feb'))
    expect(tooltip).toHaveTextContent('Current week$16,000')
    expect(tooltip).toHaveTextContent('Previous week$11,000')
    // The live region announces the same values.
    await waitFor(() =>
      expect(within(canvasElement).getByRole('status')).toHaveTextContent(
        'Feb: Current week $16,000, Previous week $11,000',
      ),
    )
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

/** Hovering a point shows the tooltip for its month. */
export const Hover: Story = {
  ...Revenue,
  play: async ({ canvasElement }) => {
    const ticks = await waitFor(() => {
      const found = canvasElement.querySelectorAll(
        '.recharts-xAxis-tick-labels text',
      )
      expect(found.length).toBeGreaterThan(3)
      return found
    }, DRAWN)
    hoverChartAt(canvasElement, ticks[3] as Element)
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Apr'))
    expect(tooltip).toHaveTextContent('$21,000')
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

export const RevenueDark: Story = {
  ...Revenue,
  globals: { theme: 'dark' },
  play: undefined,
}

/**
 * The Figma "Revenue" block: the current week turns dashed after April
 * (`projectionFrom`), the previous week is dashed (`dashed` in its config).
 */
export const Projection: Story = {
  render: () => (
    <DashboardCard title="Revenue">
      {(titleId) => (
        <LineChart
          aria-labelledby={titleId}
          data={revenue}
          xKey="month"
          config={revenueConfig}
          projectionFrom="Apr"
          valueFormatter={usd}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const surface = await chartSurface(canvasElement)
    surface.focus()
    for (let step = 0; step < 3; step++)
      await userEvent.keyboard('{ArrowRight}')
    const tooltip = await visibleTooltip(canvasElement)
    // April is on both the solid and the dashed line: listed once.
    await waitFor(() => expect(tooltip).toHaveTextContent('Apr'))
    expect(within(tooltip).getAllByRole('listitem')).toHaveLength(2)
    expect(tooltip).toHaveTextContent('$21,000')
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

export const ProjectionDark: Story = {
  ...Projection,
  globals: { theme: 'dark' },
  play: undefined,
}

/** Eight series take the palette in order (Primary, Blue, Green, Cyan, Purple, Mint, Indigo, Orange). */
export const ManySeries: Story = {
  render: () => (
    <DashboardCard title="Visits by source" width={760}>
      {(titleId) => (
        <LineChart
          aria-labelledby={titleId}
          data={weekly}
          xKey="day"
          config={weeklyConfig}
          dots
          tooltip="light"
        />
      )}
    </DashboardCard>
  ),
}

/** In right-to-left text the axes mirror: time runs from right to left, values on the right. */
export const RTL: Story = {
  ...Revenue,
  globals: { dir: 'rtl' },
  play: async ({ canvasElement }) => {
    const figure = canvasElement.querySelector('[data-slot="chart"]')
    expect(figure).toHaveAttribute('data-dir', 'rtl')
    const labels = await waitFor(() => {
      const found = [
        ...canvasElement.querySelectorAll('.recharts-xAxis-tick-labels text'),
      ]
      expect(found.length).toBe(6)
      return found
    }, DRAWN)
    const x = (label: Element) => label.getBoundingClientRect().left
    // January is on the right, June on the left.
    expect(
      x(labels.find((label) => label.textContent === 'Jan') as Element),
    ).toBeGreaterThan(
      x(labels.find((label) => label.textContent === 'Jun') as Element),
    )
    // The value axis is on the right.
    const yLabel = canvasElement.querySelector(
      '.recharts-yAxis-tick-labels text',
    )
    const plot = canvasElement.querySelector(
      '[data-slot="chart-plot"]',
    ) as Element
    expect(x(yLabel as Element)).toBeGreaterThan(
      plot.getBoundingClientRect().left +
        plot.getBoundingClientRect().width / 2,
    )
    // ← moves forward in time (to the left).
    const surface = await chartSurface(canvasElement)
    surface.focus()
    await userEvent.keyboard('{ArrowLeft}')
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Feb'))
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

/** Without data: the empty message instead of the chart. */
export const Empty: Story = {
  render: () => (
    <DashboardCard title="Total Users">
      {(titleId) => (
        <LineChart
          aria-labelledby={titleId}
          data={[]}
          xKey="month"
          config={totalUsersConfig}
          emptyMessage="No users in this period"
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('No users in this period')).toBeVisible()
    expect(canvas.queryByRole('table')).toBeNull()
    expect(canvasElement.querySelector('svg.recharts-surface')).toBeNull()
  },
}

/** While loading: a placeholder, `aria-busy` and an announcement. */
export const Loading: Story = {
  render: () => (
    <DashboardCard title="Total Users">
      {(titleId) => (
        <LineChart
          aria-labelledby={titleId}
          data={totalUsers}
          xKey="month"
          config={totalUsersConfig}
          loading
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const figure = canvasElement.querySelector('[data-slot="chart"]')
    expect(figure).toHaveAttribute('aria-busy', 'true')
    expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Loading chart',
    )
  },
}

/**
 * Numbers follow the locale: the `locale` prop, else the `SnowUIProvider`'s
 * (here the Russian of the Storybook "Locale" toolbar), else `en-US`.
 */
export const Locale: Story = {
  render: () => (
    <DashboardCard title="Total Users">
      {(titleId) => (
        <LineChart
          aria-labelledby={titleId}
          data={totalUsers}
          xKey="month"
          config={totalUsersConfig}
        />
      )}
    </DashboardCard>
  ),
  globals: { locale: 'ru' },
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table')
    // Russian groups thousands with a (narrow) no-break space.
    expect(
      within(table).getByRole('cell', { name: /^28\s500$/ }),
    ).toBeInTheDocument()
    const yTicks = await waitFor(() => {
      const found = [
        ...canvasElement.querySelectorAll('.recharts-yAxis-tick-labels text'),
      ].map((text) => text.textContent)
      expect(found.length).toBeGreaterThan(2)
      return found
    }, DRAWN)
    expect(yTicks.some((tick) => /тыс/.test(tick ?? ''))).toBe(true)
  },
}
