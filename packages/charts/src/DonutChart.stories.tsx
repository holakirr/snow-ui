import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { DonutChart } from './DonutChart'
import { DashboardCard } from './test/DashboardCard'
import { trafficByLocation, trafficByLocationConfig } from './test/fixtures'
import {
  DRAWN,
  endInteraction,
  hoverChartAt,
  visibleTooltip,
} from './test/play'

const meta: Meta<typeof DonutChart> = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs', 'a11y'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      // Chart page: "DonutChart".
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=30485-100244',
    },
  },
}

export default meta
type Story = StoryObj<typeof DonutChart>

/** The Figma "Traffic by Location" block: the ring and a legend with each country's share. */
export const TrafficByLocation: Story = {
  render: () => (
    <DashboardCard title="Traffic by Location" width={432}>
      {(titleId) => (
        <DonutChart
          aria-labelledby={titleId}
          data={trafficByLocation}
          nameKey="country"
          valueKey="visits"
          config={trafficByLocationConfig}
          categoryLabel="Country"
          valueLabel="Visits (%)"
          style={{ paddingInline: 20, minHeight: 196 }}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The legend lists each country with its share.
    const legend = canvasElement.querySelector(
      '[data-slot="chart-legend"]',
    ) as HTMLElement
    const items = within(legend).getAllByRole('listitem')
    expect(items).toHaveLength(4)
    expect(items[0]).toHaveTextContent('United States52.1%')
    // The ring is hidden from assistive technology and not a tab stop; the
    // legend and the table carry the values.
    const svg = await waitFor(() => {
      const found = canvasElement.querySelector('svg.recharts-surface')
      expect(found).not.toBeNull()
      return found
    }, DRAWN)
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('tabindex')
    const table = within(
      canvas.getByRole('figure', { name: 'Traffic by Location' }),
    ).getByRole('table')
    expect(
      within(table).getByRole('columnheader', { name: 'Visits (%)' }),
    ).toBeInTheDocument()
    // Hovering a slice shows its value.
    const sectors = await waitFor(() => {
      const found = canvasElement.querySelectorAll('.recharts-pie-sector path')
      expect(found).toHaveLength(4)
      return found
    }, DRAWN)
    hoverChartAt(canvasElement, sectors[1] as Element)
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Canada22.8'))
    // End without focus or hover: the screenshot of the story must
    // not depend on when the interaction state is torn down.
    await endInteraction(canvasElement)
  },
}

export const TrafficByLocationDark: Story = {
  ...TrafficByLocation,
  globals: { theme: 'dark' },
  play: undefined,
}

/** A centre label (Figma SemicircleChart: "Percentage 58%") and the legend below. */
export const CenterLabel: Story = {
  render: () => (
    <DashboardCard title="Total Sales" width={280}>
      {(titleId) => (
        <DonutChart
          aria-labelledby={titleId}
          data={[
            { channel: 'Direct', sales: 300.56 },
            { channel: 'Affiliate', sales: 135.18 },
            { channel: 'Sponsored', sales: 154.02 },
            { channel: 'E-mail', sales: 48.96 },
          ]}
          nameKey="channel"
          valueKey="sales"
          config={{
            Direct: { color: 'primary' },
            Affiliate: { color: 'mint' },
            Sponsored: { color: 'indigo' },
            'E-mail': { color: 'blue' },
          }}
          size={160}
          thickness={24}
          centerLabel="Total"
          centerValue="$639"
          legend="value"
          legendPosition="bottom"
          valueFormatter={(value) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          }
          style={{ alignItems: 'center' }}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('$639')).toBeVisible()
    expect(
      canvas.getByText('$300.56', { selector: '.snow-chart-legend__value' }),
    ).toBeVisible()
  },
}

export const CenterLabelDark: Story = {
  ...CenterLabel,
  globals: { theme: 'dark' },
  play: undefined,
}

/** Right-to-left: the legend and the layout mirror; the ring keeps going clockwise. */
export const RTL: Story = {
  ...TrafficByLocation,
  globals: { dir: 'rtl' },
  play: async ({ canvasElement }) => {
    const plot = (
      canvasElement.querySelector('[data-slot="chart-plot"]') as Element
    ).getBoundingClientRect()
    const legend = (
      canvasElement.querySelector('[data-slot="chart-legend"]') as Element
    ).getBoundingClientRect()
    expect(plot.left).toBeGreaterThan(legend.left)
  },
}

export const Empty: Story = {
  render: () => (
    <DashboardCard title="Traffic by Location" width={432}>
      {(titleId) => (
        <DonutChart
          aria-labelledby={titleId}
          data={[]}
          nameKey="country"
          valueKey="visits"
          emptyMessage="No visits yet"
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText('No visits yet')).toBeVisible()
  },
}
