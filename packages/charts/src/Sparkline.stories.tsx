import { Card } from '@holakirr/snow-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Sparkline } from './Sparkline'

const meta: Meta<typeof Sparkline> = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs', 'a11y'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      // The SnowUI Chart page (the kit has no sparkline component).
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25596-130956',
    },
  },
  args: {
    title: 'Views, last 7 days',
    data: [12, 18, 15, 22, 30, 26, 34],
    color: 'primary',
    area: false,
    dashed: false,
    height: 32,
    width: 160,
  },
}

export default meta
type Story = StoryObj<typeof Sparkline>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const image = within(canvasElement).getByRole('figure', {
      name: 'Views, last 7 days',
    })
    // The graphic inside is hidden; the name describes it.
    expect(image.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  },
}

export const Area: Story = {
  args: { area: true, color: 'indigo' },
}

const kpis = [
  {
    label: 'Views',
    value: '7,265',
    change: '+11.01%',
    data: [5, 9, 7, 12, 10, 14, 16],
    color: 'primary',
  },
  {
    label: 'Visits',
    value: '3,671',
    change: '-0.03%',
    data: [9, 8, 10, 7, 9, 8, 8],
    color: 'blue',
  },
  {
    label: 'New Users',
    value: '256',
    change: '+15.03%',
    data: [2, 3, 5, 4, 6, 8, 9],
    color: 'green',
  },
  {
    label: 'Active Users',
    value: '2,318',
    change: '+6.08%',
    data: [10, 12, 11, 13, 15, 14, 17],
    color: 'purple',
  },
] as const

/** KPI cards: the number and its trend (the Figma dashboard's Views / Visits cards, plus a sparkline). */
export const KpiCards: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-7" style={{ width: 880 }}>
      {kpis.map((kpi) => (
        <Card key={kpi.label} variant="block" className="flex flex-col gap-2">
          <span className="font-semibold text-14 text-black">{kpi.label}</span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-24 text-black">
              {kpi.value}
            </span>
            <span className="text-12 text-black">{kpi.change}</span>
          </div>
          <Sparkline
            title={`${kpi.label}, last 7 days`}
            data={kpi.data}
            color={kpi.color}
            area
          />
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getAllByRole('figure')).toHaveLength(4)
    expect(
      canvas.getByRole('figure', { name: 'Visits, last 7 days' }),
    ).toBeVisible()
  },
}

export const KpiCardsDark: Story = {
  ...KpiCards,
  globals: { theme: 'dark' },
  play: undefined,
}

/** Right-to-left: the line runs from right to left (the latest value on the left). */
export const RTL: Story = {
  args: { area: true },
  globals: { dir: 'rtl' },
  play: async ({ canvasElement }) => {
    const figure = within(canvasElement).getByRole('figure', {
      name: 'Views, last 7 days',
    })
    expect(figure).toHaveAttribute('data-dir', 'rtl')
    expect(figure.querySelector('svg')).toHaveStyle({
      transform: 'matrix(-1, 0, 0, 1, 0, 0)',
    })
  },
}
