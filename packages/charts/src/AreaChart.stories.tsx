import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { AreaChart } from './AreaChart'
import { DashboardCard } from './test/DashboardCard'
import {
  totalUsers,
  totalUsersConfig,
  weekly,
  weeklyConfig,
} from './test/fixtures'
import { chartSurface, visibleTooltip } from './test/play'

const meta: Meta<typeof AreaChart> = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs', 'a11y'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      // Chart page, "ChartMotion" with the "Line 01" graphic (line + area).
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=30485-100231',
    },
  },
}

export default meta
type Story = StoryObj<typeof AreaChart>

/**
 * The Figma "Total Users" block: this year with a Primary gradient under the
 * line (10% to transparent), last year dashed without fill (`opacity: 0`).
 */
export const TotalUsers: Story = {
  render: () => (
    <DashboardCard title="Total Users">
      {(titleId) => (
        <AreaChart
          aria-labelledby={titleId}
          description="This year's users peak at 28.5K in May; last year's reach 29.5K in July."
          data={totalUsers}
          xKey="month"
          config={totalUsersConfig}
          grid={false}
          fade
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const surface = await chartSurface(canvasElement)
    await userEvent.tab()
    expect(surface).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    const tooltip = await visibleTooltip(canvasElement)
    await waitFor(() => expect(tooltip).toHaveTextContent('Feb'))
    expect(tooltip).toHaveTextContent('This year8,500')
    // The description is the figure's accessible description.
    expect(
      within(canvasElement).getByRole('figure', { name: 'Total Users' }),
    ).toHaveAccessibleDescription(/peak at 28.5K in May/)
    // Two areas: the second has no fill (opacity 0).
    const stops = canvasElement.querySelectorAll('linearGradient stop')
    expect(stops.length).toBeGreaterThan(0)
  },
}

export const TotalUsersDark: Story = {
  ...TotalUsers,
  globals: { theme: 'dark' },
  play: undefined,
}

/** `stacked`: the series add up; each keeps its gradient. */
export const Stacked: Story = {
  render: () => (
    <DashboardCard title="Visits by source" width={760}>
      {(titleId) => (
        <AreaChart
          aria-labelledby={titleId}
          data={weekly}
          xKey="day"
          config={{
            a: { ...weeklyConfig.a, opacity: 0.3 },
            b: { ...weeklyConfig.b, opacity: 0.3 },
            c: { ...weeklyConfig.c, opacity: 0.3 },
          }}
          stacked
          yTickFormatter={(value) => `${Number(value) / 1000}K`}
        />
      )}
    </DashboardCard>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table')
    // Three series, seven days: a header row and a row per day.
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4)
    expect(within(table).getAllByRole('row')).toHaveLength(8)
  },
}

export const StackedDark: Story = {
  ...Stacked,
  globals: { theme: 'dark' },
  play: undefined,
}
