import type { Meta, StoryObj } from '@storybook/react'

import { Text } from '../Text'
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
      <Text>Content above</Text>
      <Separator {...args} />
      <Text>Content below</Text>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-[100px] items-center gap-4">
      <Text>Left content</Text>
      <Separator {...args} />
      <Text>Right content</Text>
    </div>
  ),
}

export const CustomStyles: Story = {
  args: {
    className: 'bg-red-500',
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text>Custom styled separator</Text>
      <Separator {...args} />
      <Text>Below content</Text>
    </div>
  ),
}
