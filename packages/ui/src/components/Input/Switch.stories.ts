import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { hasInsetRing } from '../../test/colors'

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

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (no Figma state). A 1px Secondary/Red stroke inside the track. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole('switch')

    await expect(control).toBeInvalid()
    await expect(await hasInsetRing(control, 'text-red', '1px')).toBe(true)
  },
}
