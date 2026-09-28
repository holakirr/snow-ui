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
        component:
          'Visually or semantically separates content. Defaults to the Black/10% divider of the Figma dashboards; `hairline` draws it 0.5px thick.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
    },
    hairline: {
      control: 'boolean',
      description: 'Draw a 0.5px hairline',
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

export const Hairline: Story = {
  args: {
    hairline: true,
  },
  render: (args) => (
    <div className="flex w-[240px] flex-col gap-2">
      <Typography>1px (default)</Typography>
      <Separator />
      <Typography>0.5px hairline</Typography>
      <Separator {...args} />
      <Typography>Below content</Typography>
    </div>
  ),
}

export const Dark: Story = {
  ...Hairline,
  globals: { theme: 'dark' },
}

export const CustomStyles: Story = {
  args: {
    className: 'bg-primary',
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Typography>Custom styled separator</Typography>
      <Separator {...args} />
      <Typography>Below content</Typography>
    </div>
  ),
}
