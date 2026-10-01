import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { hasInsetRing, hasMoreContrast } from '../../test/colors'

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
 * error (the kit's Error stroke; the kit draws its Warning icon on Input and Textarea only). A 1px Secondary/Red stroke on both variants. Pair it with the error text: see Form.
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
      await expect(
        await hasInsetRing(input, 'text-control-border-invalid', '1px'),
      ).toBe(true)
    }
  },
}

/**
 * Invalid and read-only: the red stroke stays on hover and focus, on both
 * variants. The same picture as Invalid at rest, so no screenshot.
 */
export const InvalidReadOnly: Story = {
  ...Invalid,
  tags: ['!autodocs', 'skip-visual'],
  args: { ...Invalid.args, readOnly: true },
  play: async ({ canvas, userEvent }) => {
    for (const input of canvas.getAllByRole('textbox', { name: 'Name' })) {
      const isRed = (width = '1px') =>
        hasInsetRing(input, 'text-control-border-invalid', width)
      await userEvent.hover(input)
      await expect(await isRed()).toBe(true)
      await userEvent.click(input)
      await expect(input).toHaveFocus()
      // 2px on focus with more contrast: the focus indicator.
      await expect(await isRed(hasMoreContrast(input) ? '2px' : '1px')).toBe(
        true,
      )
    }
  },
}
