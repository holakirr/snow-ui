import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { hasInsetRing, hasMoreContrast } from '../../test/colors'

import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Input/Textarea',
  component: Textarea,
  tags: ['autodocs', 'a11y'],
  // A textarea without a visible label needs an accessible name.
  args: { 'aria-label': 'Message', placeholder: 'Type your message' },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-83401',
    },
    docs: {
      description: {
        component: 'Textarea component',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (no Figma state). The Input stroke in Secondary/Red, 1px. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  args: {
    defaultValue: 'Too short',
    'aria-invalid': true,
  },
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' })

    await expect(textarea).toBeInvalid()
    await expect(
      await hasInsetRing(textarea, 'text-control-border-invalid', '1px'),
    ).toBe(true)
  },
}

/**
 * Invalid and read-only (the Figma "Static"): the red stroke stays on hover
 * and focus. The same picture as Invalid at rest, so no screenshot.
 */
export const InvalidReadOnly: Story = {
  tags: ['!autodocs', 'skip-visual'],
  args: {
    defaultValue: 'Too short',
    readOnly: true,
    'aria-invalid': true,
  },
  play: async ({ canvas, userEvent, step }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' })
    const isRed = (width = '1px') =>
      hasInsetRing(textarea, 'text-control-border-invalid', width)

    await expect(await isRed()).toBe(true)
    await step('hovered', async () => {
      await userEvent.hover(textarea)
      await expect(await isRed()).toBe(true)
    })
    await step('focused', async () => {
      await userEvent.click(textarea)
      await expect(textarea).toHaveFocus()
      // 2px on focus with more contrast: the focus indicator.
      await expect(await isRed(hasMoreContrast(textarea) ? '2px' : '1px')).toBe(
        true,
      )
    })
  },
}
