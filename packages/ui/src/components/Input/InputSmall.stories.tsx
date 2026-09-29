import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { hasInsetRing } from '../../test/colors'

import { InputSmall } from './InputSmall'

const meta: Meta<typeof InputSmall> = {
  title: 'Components/Input/Input Small',
  component: InputSmall,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-43630',
    },
  },
  tags: ['autodocs'],
  args: {
    placeholder: 'Placeholder',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof InputSmall>

export const Default: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    defaultValue: 'Value',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Input with value',
    defaultValue: 'Initial value',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (no Figma state). A 1px Secondary/Red stroke on both variants. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  args: {
    'aria-label': 'Name',
    defaultValue: 'Value',
    'aria-invalid': true,
  },
  render: (args) => (
    <div className="flex gap-4">
      <InputSmall {...args} />
      <InputSmall {...args} variant="outline" />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const input of canvas.getAllByRole('textbox', { name: 'Name' })) {
      await expect(input).toBeInvalid()
      await expect(await hasInsetRing(input, 'text-red', '1px')).toBe(true)
    }
  },
}
