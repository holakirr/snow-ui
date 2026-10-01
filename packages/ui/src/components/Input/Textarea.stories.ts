import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { colorOf, hasInsetRing, hasMoreContrast } from '../../test/colors'
import { settleLayout } from '../../test/layout'

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
 * Figma "Textarea" with its counter (`showCount`): "4/200" against the
 * `maxLength`, in the bottom-end corner next to the resize handle. Screen
 * readers read "4 of 200 characters" with the field.
 */
export const WithCount: Story = {
  args: {
    defaultValue: 'Text',
    maxLength: 200,
    showCount: true,
    containerClassName: 'w-60',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' })
    const count = canvasElement.querySelector(
      '[data-slot="textarea-count"]',
    ) as HTMLElement

    await expect(count).toHaveTextContent('4/200')
    await expect(textarea).toHaveAccessibleDescription('4 of 200 characters')

    // Figma: 4px above the bottom edge, 20px from the end (the corner is the
    // resize handle's).
    const field = textarea.getBoundingClientRect()
    const box = count.getBoundingClientRect()
    await expect(field.bottom - box.bottom).toBe(4)
    await expect(field.right - box.right).toBe(20)

    await userEvent.type(textarea, '!')
    await expect(count).toHaveTextContent('5/200')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Text')
    textarea.blur()
  },
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (the kit's Error stroke; its Warning icon is opt-in: see Error Icon). The Input stroke in Secondary/Red, 1px. Pair it with the error text: see Form.
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
 * The kit's Error icon (`showErrorIcon`, added in 5.2): while the textarea is
 * invalid, a 16px `Warning` at the end of the first row, in the red of the
 * stroke; the text stops 8px before it. It wraps the textarea in a `<div>`,
 * like `showCount`.
 */
export const ErrorIcon: Story = {
  args: {
    defaultValue:
      'Too short, and a line long enough to wrap before the Warning icon',
    'aria-invalid': true,
    showErrorIcon: true,
  },
  play: async ({ canvas, canvasElement }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' })
    const icon = canvasElement.querySelector(
      '[data-slot="textarea-error-icon"]',
    ) as HTMLElement
    await settleLayout(canvasElement)

    await expect(textarea).toBeInvalid()
    const box = textarea.getBoundingClientRect()
    const glyph = icon.getBoundingClientRect()
    await expect(glyph.width).toBe(16)
    await expect(glyph.height).toBe(16)
    // 16px from the end, centred on the first 20px line (12px padding).
    await expect(box.right - glyph.right).toBe(16)
    await expect(glyph.top - box.top).toBe(14)
    await expect(getComputedStyle(icon).color).toBe(
      colorOf(
        'text-control-border-invalid',
        textarea.parentElement ?? textarea,
      ),
    )
    // The text stops 8px before the icon: 40px end padding.
    await expect(getComputedStyle(textarea).paddingRight).toBe('40px')
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
