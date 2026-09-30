import { BellIcon, BugBeetleIcon, UserIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Avatar, AvatarFallback } from '../Avatar'
import { BadgeComponent } from '../Badge'
import { Typography } from '../Text'
import { ICON_BOX_SIZES, IconBox } from './IconBox'

const sizes = Object.values(ICON_BOX_SIZES)

const meta = {
  title: 'Components/IconBox',
  component: IconBox,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33138-1011',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Icon" component: sets the size of an icon, avatar or image (12–80), optionally on a Black/4% tile (`background`) and with a `badge`.',
      },
    },
  },
  tags: ['autodocs'],
  // Icons take the text colour; the story frame is text-secondary.
  decorators: [
    (Story) => (
      <div className="text-black">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      options: sizes,
      control: { type: 'select' },
    },
    background: { control: { type: 'boolean' } },
    glass: { control: { type: 'boolean' } },
    badge: { control: { type: 'boolean' } },
  },
  args: {
    size: 24,
    children: <BellIcon />,
  },
} satisfies Meta<typeof IconBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBackground: Story = {
  args: { background: true },
}

const GlassRow = () => (
  // Glass is for icons over a picture or a colour: a pastel gradient here.
  <div className="flex items-center gap-4 rounded-24 bg-linear-to-br from-indigo to-mint p-6 text-static-black">
    {([16, 24, 40, 80] as const).map((size) => (
      <IconBox key={size} size={size} glass>
        <BellIcon />
      </IconBox>
    ))}
    <IconBox size={24} glass badge badgeLabel="Unread notifications">
      <BugBeetleIcon />
    </IconBox>
  </div>
)

/**
 * The Figma `Glass` tile: White/20% with the "Glass 1" effect (a background
 * blur and a soft shadow), over a picture or a colour.
 */
export const Glass: Story = {
  render: () => <GlassRow />,
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[data-glass]') as HTMLElement
    await expect(box).toHaveClass('glass-1', 'p-1', 'rounded-8')
    await expect(getComputedStyle(box).backdropFilter).toContain('blur')
  },
}

export const GlassDark: Story = {
  render: () => <GlassRow />,
  globals: { theme: 'dark' },
}

export const WithBadge: Story = {
  args: { badge: true, badgeLabel: 'Unread notifications' },
}

export const WithBackgroundAndBadge: Story = {
  args: { background: true, badge: true },
}

const Grid = () => (
  <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-center gap-x-10 gap-y-6">
    <span />
    {['Plain', 'Background', 'Badge', 'Background + badge'].map((label) => (
      <Typography key={label} size={12} className="text-secondary">
        {label}
      </Typography>
    ))}
    {sizes.map((size) => (
      <div key={size} className="contents">
        <Typography size={12} className="text-secondary">
          {size}
        </Typography>
        <IconBox size={size}>
          <BellIcon />
        </IconBox>
        <IconBox size={size} background>
          <BellIcon />
        </IconBox>
        <IconBox size={size} badge>
          <BellIcon />
        </IconBox>
        <IconBox size={size} background badge>
          <BellIcon />
        </IconBox>
      </div>
    ))}
  </div>
)

export const AllSizes: Story = {
  render: () => <Grid />,
}

export const AllSizesDark: Story = {
  render: () => <Grid />,
  globals: { theme: 'dark' },
}

export const Avatar24: Story = {
  name: 'Avatar',
  render: () => (
    <div className="flex items-center gap-4">
      <IconBox size={24}>
        <Avatar>
          <AvatarFallback className="text-static-black">BW</AvatarFallback>
        </Avatar>
      </IconBox>
      <IconBox size={40} badge>
        <Avatar>
          <AvatarFallback className="text-static-black">EM</AvatarFallback>
        </Avatar>
      </IconBox>
    </div>
  ),
}

export const TintedBackground: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconBox size={16} background className="bg-color-2 text-static-black">
        <BugBeetleIcon />
      </IconBox>
      <IconBox size={16} background className="bg-color-1 text-static-black">
        <UserIcon />
      </IconBox>
    </div>
  ),
}

export const CountBadge: Story = {
  render: () => (
    <IconBox
      size={24}
      background
      badge={
        <BadgeComponent content="3" className="bg-indigo text-static-black" />
      }
    >
      <BellIcon />
    </IconBox>
  ),
}
