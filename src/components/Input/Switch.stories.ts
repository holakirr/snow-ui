import type { Meta, StoryObj } from '@storybook/react'

import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Input/Switch',
  component: Switch,
  tags: ['autodocs', 'a11y'],
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'Switch component',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
  },
}
