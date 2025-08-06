import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from '../Text'
import { Separator } from './Separator'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Visually or semantically separates content',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is purely decorative',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Typography>Content above</Typography>
      <Separator {...args} />
      <Typography>Content below</Typography>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-[100px] items-center gap-4">
      <Typography>Left content</Typography>
      <Separator {...args} />
      <Typography>Right content</Typography>
    </div>
  ),
}

export const CustomStyles: Story = {
  args: {
    className: 'bg-red-500',
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Typography>Custom styled separator</Typography>
      <Separator {...args} />
      <Typography>Below content</Typography>
    </div>
  ),
}
