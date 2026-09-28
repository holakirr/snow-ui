import { BellIcon, BugBeetleIcon, UserIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '../Avatar'
import { BadgeComponent } from '../Badge'
import { Typography } from '../Text'
import { ICON_BOX_SIZES, IconBox } from './IconBox'

const sizes = Object.values(ICON_BOX_SIZES)

const meta = {
  title: 'Components/IconBox',
  component: IconBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Icon" component: sets the size of an icon, avatar or image (12–80), optionally on a Black/4% tile (`background`) and with a `badge`.',
      },
    },
  },
  tags: ['autodocs'],
  // Icons take the text colour; the story frame is Black/40%.
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
