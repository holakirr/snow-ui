import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { BarChart } from './BarChart'
import { DashboardCard } from './test/DashboardCard'
import {
  projections,
  projectionsConfig,
  trafficByDevice,
  trafficByDeviceConfig,
} from './test/fixtures'
import {
  chartSurface,
  DRAWN,
  endInteraction,
  hoverChartAt,
  visibleTooltip,
} from './test/play'

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs', 'a11y'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      // Chart page: "ChartMotion" with 12 vertical bars.
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=30485-100226',
    },
  },
}

export default meta
type Story = StoryObj<typeof BarChart>

const monthly = [
  { month: 'Jan', desktop: 18600, mobile: 8000 },
  { month: 'Feb', desktop: 30500, mobile: 20000 },
  { month: 'Mar', desktop: 23700, mobile: 12000 },
  { month: 'Apr', desktop: 7300, mobile: 19000 },
  { month: 'May', desktop: 20900, mobile: 13000 },
  { month: 'Jun', desktop: 21400, mobile: 14000 },
]

const monthlyConfig = {
  desktop: { label: 'Desktop', color: 'primary' },
  mobile: { label: 'Mobile', color: 'indigo' },
} as const

/** The Figma "Traffic by Device" block: one bar per device, each in its colour (`colorBy="category"`). */
export const TrafficByDevice: Story = {
  render: () => (
    <DashboardCard title="Traffic by Device" width={432}>
      {(titleId) => (
        <BarChart
          aria-labelledby={titleId}
          data={trafficByDevice}
          xKey="device"
          config={trafficByDeviceConfig}
          colorBy="category"
          categoryLabel="Device"
          grid={false}
          height={196}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const bars = await waitFor(() => {
      const found = canvasElement.querySelectorAll(
        '.recharts-bar-rectangle path',
      )
      expect(found).toHaveLength(6)
      return found
    }, DRAWN)
    // Each bar has its device's colour.
    expect(bars[0]).toHaveAttribute('fill', 'var(--chart-Linux)')
    expect(bars[3]).toHaveAttribute('fill', 'var(--chart-Windows)')
    // Hover: the tooltip shows the device, with its colour.
    hoverChartAt(canvasElement, bars[3] as Element)
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Windows'))
    expect(tooltip).toHaveTextContent('Users30,000')
    const swatch = tooltip.querySelector('.snow-chart-swatch') as HTMLElement
    expect(swatch.style.getPropertyValue('--snow-chart-swatch')).toBe(
      'var(--chart-Windows)',
    )
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

export const TrafficByDeviceDark: Story = {
  ...TrafficByDevice,
  globals: { theme: 'dark' },
  play: undefined,
}

/**
 * The Figma "Projections vs Actuals" block: the actual value with the rest of
 * the projection stacked on top at 20% (`opacity: 0.2`); the stack is rounded
 * as one bar.
 */
export const ProjectionsVsActuals: Story = {
  render: () => (
    <DashboardCard title="Projections vs Actuals" width={432}>
      {(titleId) => (
        <BarChart
          aria-labelledby={titleId}
          data={projections}
          xKey="month"
          config={projectionsConfig}
          colorBy="category"
          stacked
          legend={false}
          grid={false}
          height={168}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const surface = await chartSurface(canvasElement)
    surface.focus()
    // Focus shows January; → moves to February.
    await userEvent.keyboard('{ArrowRight}')
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Feb'))
    expect(tooltip).toHaveTextContent('Actual22,500')
    expect(tooltip).toHaveTextContent('Rest of projection3,750')
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

export const ProjectionsVsActualsDark: Story = {
  ...ProjectionsVsActuals,
  globals: { theme: 'dark' },
  play: undefined,
}

/** Two series side by side, with the legend and gridlines. */
export const Grouped: Story = {
  render: () => (
    <DashboardCard title="Visitors">
      {(titleId) => (
        <BarChart
          aria-labelledby={titleId}
          data={monthly}
          xKey="month"
          config={monthlyConfig}
          tooltip="light"
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const legend = within(
      canvasElement.querySelector('[data-slot="chart-legend"]') as HTMLElement,
    )
    expect(legend.getAllByRole('listitem')).toHaveLength(2)
    const bars = await waitFor(() => {
      const found = canvasElement.querySelectorAll(
        '.recharts-bar-rectangle path',
      )
      expect(found).toHaveLength(12)
      return found
    }, DRAWN)
    hoverChartAt(canvasElement, bars[1] as Element)
    const tooltip = await visibleTooltip(canvasElement)
    expect(tooltip).toHaveAttribute('data-variant', 'light')
    await waitFor(() => expect(tooltip).toHaveTextContent('Feb'))
    expect(tooltip).toHaveTextContent('Desktop30,500')
    expect(tooltip).toHaveTextContent('Mobile20,000')
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

export const GroupedDark: Story = {
  ...Grouped,
  globals: { theme: 'dark' },
  play: undefined,
}

/** `horizontal`: categories down the side, bars growing to the right. */
export const Horizontal: Story = {
  render: () => (
    <DashboardCard title="Traffic by Device" width={480}>
      {(titleId) => (
        <BarChart
          aria-labelledby={titleId}
          data={trafficByDevice}
          xKey="device"
          config={trafficByDeviceConfig}
          colorBy="category"
          horizontal
          height={280}
        />
      )}
    </DashboardCard>
  ),
}

/** Right-to-left: horizontal bars grow to the left from the categories on the right. */
export const HorizontalRTL: Story = {
  ...Horizontal,
  globals: { dir: 'rtl' },
  play: async ({ canvasElement }) => {
    const bars = await waitFor(() => {
      const found = canvasElement.querySelectorAll(
        '.recharts-bar-rectangle path',
      )
      expect(found).toHaveLength(6)
      return found
    }, DRAWN)
    const plot = (
      canvasElement.querySelector('[data-slot="chart-plot"]') as Element
    ).getBoundingClientRect()
    const bar = (bars[0] as Element).getBoundingClientRect()
    // The bar starts on the right of the plot.
    expect(bar.right).toBeGreaterThan(plot.left + plot.width * 0.75)
    expect(canvasElement.querySelector('[data-slot="chart"]')).toHaveAttribute(
      'data-dir',
      'rtl',
    )
  },
}

/** Vertical bars in right-to-left text: the first month on the right, the values on the right. */
export const RTL: Story = {
  ...Grouped,
  globals: { dir: 'rtl' },
  play: async ({ canvasElement }) => {
    const labels = await waitFor(() => {
      const found = [
        ...canvasElement.querySelectorAll('.recharts-xAxis-tick-labels text'),
      ]
      expect(found).toHaveLength(6)
      return found
    }, DRAWN)
    const left = (text: string) =>
      (
        labels.find((label) => label.textContent === text) as Element
      ).getBoundingClientRect().left
    expect(left('Jan')).toBeGreaterThan(left('Jun'))
  },
}

export const Empty: Story = {
  render: () => (
    <DashboardCard title="Traffic by Device" width={432}>
      {(titleId) => (
        <BarChart
          aria-labelledby={titleId}
          data={[]}
          xKey="month"
          config={monthlyConfig}
          height={196}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText('No data')).toBeVisible()
  },
}
