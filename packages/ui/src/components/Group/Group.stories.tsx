import {
  BellIcon,
  ClockCounterClockwiseIcon,
  SidebarIcon,
  StarIcon,
  SunIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { IconBox } from '../IconBox'
import { IconText } from '../IconText'
import { Typography } from '../Text'
import { Group } from './Group'

const iconButton = (label: string, icon: ReactNode) => (
  <Button
    key={label}
    aria-label={label}
    leftContent={<IconBox size={16}>{icon}</IconBox>}
    className="p-1 rounded-12"
  />
)

const buttons = [
  iconButton('Theme', <SunIcon />),
  iconButton('History', <ClockCounterClockwiseIcon />),
  iconButton('Notifications', <BellIcon />),
  iconButton('Toggle sidebar', <SidebarIcon />),
]

const meta = {
  title: 'Components/Group',
  component: Group,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Group": lays out any items (icon buttons, IconText rows, tags) in a row or a column, 8px apart by default; `vertical` and `reverse` as in Figma.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    vertical: { control: { type: 'boolean' } },
    reverse: { control: { type: 'boolean' } },
    gap: { options: [0, 4, 8, 12, 16], control: { type: 'radio' } },
  },
  args: {
    'aria-label': 'Toolbar',
    children: buttons,
  },
} satisfies Meta<typeof Group>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = {
  args: { vertical: true },
}

export const Reverse: Story = {
  args: { reverse: true },
}

export const VerticalReverse: Story = {
  args: { vertical: true, reverse: true },
}

const numbered = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <IconText
      // biome-ignore lint/suspicious/noArrayIndexKey: static demo items
      key={index}
      interactive
      icon={
        <IconBox size={16}>
          <StarIcon />
        </IconBox>
      }
    >
      {String(index + 1)}
    </IconText>
  ))

const Variants = () => (
  <div className="flex flex-col gap-8">
    {[
      { label: 'Row', props: {} },
      { label: 'Row, reverse', props: { reverse: true } },
      { label: 'Gap 4', props: { gap: 4 as const } },
    ].map(({ label, props }) => (
      <div key={label} className="flex flex-col gap-2">
        <Typography size={12} className="text-secondary">
          {label}
        </Typography>
        <Group aria-label={label} className="w-80" {...props}>
          {numbered(3)}
        </Group>
      </div>
    ))}
    <div className="flex gap-10">
      {[
        { label: 'Column', props: { vertical: true } },
        { label: 'Column, reverse', props: { vertical: true, reverse: true } },
      ].map(({ label, props }) => (
        <div key={label} className="flex flex-col gap-2">
          <Typography size={12} className="text-secondary">
            {label}
          </Typography>
          <Group aria-label={label} {...props}>
            {numbered(3)}
          </Group>
        </div>
      ))}
    </div>
  </div>
)

export const AllVariants: Story = {
  render: () => <Variants />,
}

export const AllVariantsDark: Story = {
  render: () => <Variants />,
  globals: { theme: 'dark' },
}
