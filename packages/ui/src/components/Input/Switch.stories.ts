import type { Meta, StoryObj } from '@storybook/react-vite'

import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Input/Switch',
  component: Switch,
  tags: ['autodocs', 'a11y'],
  // A switch without a visible label needs an accessible name.
  args: { 'aria-label': 'Airplane mode' },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33319-52352',
    },
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

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const DisabledOff: Story = {
  args: {
    disabled: true,
  },
}
