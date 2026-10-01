import { StarIcon } from '@holakirr/snow-ui-icons'
import { BellIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { colorOf, settledColor } from '../../test/colors'
import { Button } from '../Button'
import { Badge, BadgeComponent } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32792-840',
    },
  },
  tags: ['autodocs'],
  args: { children: <Button variant="filled">Badge</Button> },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {},
}

export const WithContent: Story = {
  args: {
    content: '1',
  },
}

export const WithLongContent: Story = {
  args: {
    content: '10+',
  },
}

/** The Figma Badge set: "Dot" and "Number", alone and on an icon. */
export const Types: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <BadgeComponent />
      <BadgeComponent content="8" />
      <BadgeComponent content="24" />
      <Badge>
        <StarIcon size={24} />
      </Badge>
      <Badge content="8">
        <StarIcon size={24} />
      </Badge>
    </div>
  ),
}

/** The computed background of an element with `className`, in `container`. */
const backgroundOf = (className: string, container: HTMLElement) => {
  const probe = container.ownerDocument.createElement('span')
  probe.className = className
  container.appendChild(probe)
  const { backgroundColor } = getComputedStyle(probe)
  probe.remove()
  return backgroundColor
}

const ColorSet = () => (
  <div className="flex flex-col gap-6">
    {(['indigo', 'red'] as const).map((color) => (
      <div key={color} className="flex items-center gap-8">
        <BadgeComponent color={color} aria-label={`${color} dot`} />
        <BadgeComponent color={color} content="12" />
        <Badge color={color}>
          <BellIcon size={24} />
        </Badge>
        <Badge color={color} content="12">
          <BellIcon size={24} />
        </Badge>
      </div>
    ))}
  </div>
)

/**
 * `color` (added in 5.2): the kit's Badge docs ("Can change the color and
 * style of the Badge") show the number on Secondary/Indigo and on red. The
 * red number's pill is `red-text` with the per-mode `white` (5.21:1, 8.65:1
 * in dark mode): Figma's white on Secondary/Red is 3.36:1. The red dot keeps
 * Secondary/Red.
 */
export const Colors: Story = {
  render: () => <ColorSet />,
  play: async ({ canvas, canvasElement }) => {
    const [number] = canvas.getAllByRole('status', { name: '12' }).slice(2)
    const dot = canvas.getByRole('status', { name: 'red dot' })
    // After the transitions (the theme may switch after the first paint).
    await settledColor(number)
    await settledColor(dot)
    await expect(getComputedStyle(number).backgroundColor).toBe(
      backgroundOf('bg-red-text', canvasElement),
    )
    await expect(getComputedStyle(number).color).toBe(
      colorOf('text-white', canvasElement),
    )
    await expect(getComputedStyle(dot).backgroundColor).toBe(
      backgroundOf('bg-red', canvasElement),
    )
  },
}

export const ColorsDark: Story = {
  render: () => <ColorSet />,
  globals: { theme: 'dark' },
}

/**
 * Right-to-left text: the badge sits on the top left corner of its
 * children (the top end).
 */
export const ColorsRTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <Badge color="red" content="12" data-testid="wrapper">
      <BellIcon size={24} />
    </Badge>
  ),
  play: async ({ canvas }) => {
    const wrapper = canvas.getByTestId('wrapper').getBoundingClientRect()
    const badge = canvas.getByRole('status').getBoundingClientRect()
    // Centred on the start (left) edge in right-to-left text.
    await expect(badge.left + badge.width / 2).toBeCloseTo(wrapper.left, 0)
  },
}
