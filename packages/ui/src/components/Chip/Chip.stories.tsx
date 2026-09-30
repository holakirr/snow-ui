import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table'
import { Typography } from '../Text'
import { Chip, type ChipColor } from './Chip'

const COLORS: ChipColor[] = [
  'purple',
  'indigo',
  'blue',
  'green',
  'orange',
  'red',
  'grey',
]

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33305-29113',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Chip": a short coloured label in seven colours, tinted (`background`, H 20, padding 4/2, radius 4; `big`, a 28px pill) or a dot and coloured text (H 16), in 12/16 or, `big`, 14/20. The text mixes the Secondary colour with 45% of black (white in dark mode), so it reads at 4.5:1 or more.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: { options: COLORS, control: { type: 'select' } },
    big: { control: 'boolean' },
    background: { control: 'boolean' },
  },
  args: {
    children: 'Label',
    color: 'purple',
    big: false,
    background: true,
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const chip = canvas.getByText('Label')
    await expect(chip).toHaveAttribute('data-color', 'purple')
    await expect(chip).toHaveClass('rounded-4', 'px-1', 'py-0.5', 'text-12')
    await expect(chip.getBoundingClientRect().height).toBe(20)
    // A tinted chip has no dot.
    await expect(chip.querySelector('[data-slot="chip-dot"]')).toBeNull()
  },
}

const Matrix = () => (
  <div className="grid grid-cols-[auto_repeat(7,auto)] items-center gap-x-6 gap-y-4">
    <span />
    {COLORS.map((color) => (
      <Typography key={color} size={12} className="text-secondary capitalize">
        {color}
      </Typography>
    ))}
    {[
      { big: false, background: false, label: 'Dot' },
      { big: false, background: true, label: 'Background' },
      { big: true, background: false, label: 'Big, dot' },
      { big: true, background: true, label: 'Big, background' },
    ].map(({ label, ...variant }) => (
      <div key={label} className="contents">
        <Typography size={12} className="text-secondary">
          {label}
        </Typography>
        {COLORS.map((color) => (
          <Chip key={color} color={color} {...variant}>
            Label
          </Chip>
        ))}
      </div>
    ))}
  </div>
)

/**
 * The Figma set: seven colours, with and without `background`, 12/16 and
 * `big` (14/20).
 */
export const AllVariants: Story = {
  render: () => <Matrix />,
  play: async ({ canvas }) => {
    const labels = canvas.getAllByText('Label')
    // Rows of seven: dot, background, big dot, big background.
    const [dot, tinted, bigDot, bigTinted] = [0, 7, 14, 21].map(
      (index) => labels[index],
    )
    // Figma: H 20, radius 4 with the tint; Big, a pill: H 28, radius 80.
    await expect(tinted.getBoundingClientRect().height).toBe(20)
    await expect(getComputedStyle(tinted).borderTopLeftRadius).toBe('4px')
    await expect(bigTinted.getBoundingClientRect().height).toBe(28)
    await expect(getComputedStyle(bigTinted).borderTopLeftRadius).toBe('80px')
    await expect(getComputedStyle(bigTinted).paddingInlineStart).toBe('12px')
    // Figma: H 16 with the dot in a 12px box; Big, H 20 with a 16px ring.
    await expect(dot.getBoundingClientRect().height).toBe(16)
    await expect(
      dot.querySelector('[data-slot="chip-dot"]')?.getBoundingClientRect()
        .width,
    ).toBe(12)
    await expect(bigDot.getBoundingClientRect().height).toBe(20)
    await expect(
      bigDot.querySelector('[data-slot="chip-dot"]')?.getBoundingClientRect()
        .width,
    ).toBe(16)
  },
}

export const AllVariantsDark: Story = {
  render: () => <Matrix />,
  globals: { theme: 'dark' },
}

const orders = [
  { id: '#CM9801', project: 'Landing Page', status: 'In Progress' },
  { id: '#CM9802', project: 'CRM Admin pages', status: 'Complete' },
  { id: '#CM9803', project: 'Client Project', status: 'Pending' },
  { id: '#CM9804', project: 'Admin Dashboard', status: 'Approved' },
  { id: '#CM9805', project: 'App Landing Page', status: 'Rejected' },
] as const

const statusColor: Record<(typeof orders)[number]['status'], ChipColor> = {
  'In Progress': 'purple',
  Complete: 'green',
  Pending: 'blue',
  Approved: 'orange',
  Rejected: 'grey',
}

/**
 * The Figma "Order List" status column: dot chips (`background={false}`).
 */
export const TableStatus: Story = {
  render: () => (
    <Table className="w-[28rem]">
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.project}</TableCell>
            <TableCell>
              <Chip color={statusColor[order.status]} background={false}>
                {order.status}
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/**
 * `asChild` puts the chip's look on your element, e.g. a link to the
 * filtered list.
 */
export const AsChild: Story = {
  render: () => (
    // `relative hit-area`: a 24px pointer target around the 20px chip.
    <Chip asChild color="blue" className="relative hit-area hover:underline">
      <a href="#pending">Pending</a>
    </Chip>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Pending' })
    await expect(link).toHaveClass('rounded-4', 'hover:underline')
    await expect(link).toHaveAttribute('data-color', 'blue')
  },
}

/** Right-to-left text: the dot is on the right, before the text. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex items-center gap-4">
      <Chip color="green" background={false}>
        مكتمل
      </Chip>
      <Chip color="orange">قيد المراجعة</Chip>
    </div>
  ),
  play: async ({ canvas }) => {
    const chip = canvas.getByText('مكتمل')
    const dot = chip.querySelector('[data-slot="chip-dot"]') as HTMLElement
    await expect(dot.getBoundingClientRect().left).toBeGreaterThan(
      chip.getBoundingClientRect().left +
        chip.getBoundingClientRect().width / 2,
    )
  },
}
