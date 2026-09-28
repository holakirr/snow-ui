import { DefaultIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { SIZES, TOGGLE_VARIANTS } from '../../constants'
import { Typography } from '../Text'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Input/Toggle',
  component: Toggle,
  tags: ['autodocs', 'a11y'],
  args: {
    'aria-label': 'Toggle',
    children: <DefaultIcon />,
  },
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'Toggle component',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: {},
  play: async ({ canvas, userEvent, step }) => {
    const toggle = canvas.getByRole('button', { name: 'Toggle' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await step('a click turns it on and off', async () => {
      await userEvent.click(toggle)
      await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      await expect(toggle).toHaveAttribute('data-state', 'on')
      await userEvent.click(toggle)
      await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    })

    await step('Space and Enter toggle it too', async () => {
      toggle.focus()
      await userEvent.keyboard(' ')
      await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      await userEvent.keyboard('{Enter}')
      await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    })
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Toggle' })
    await expect(toggle).toBeDisabled()
    // Out of the tab order, and it stays off.
    await userEvent.tab()
    await expect(toggle).not.toHaveFocus()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const Variants: Story = {
  render: (args) => (
    <div
      className="grid grid-cols-2 gap-4 place-items-center"
      title="Buttons all variants"
    >
      {Object.values(TOGGLE_VARIANTS).map((variant) => (
        <Toggle key={variant} variant={variant} {...args} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <div
      className="grid grid-cols-3 gap-4 place-items-center"
      title="Buttons all variants"
    >
      {Object.values(SIZES).map((size) => (
        <Toggle key={size} size={size} {...args} />
      ))}
    </div>
  ),
}

export const WithText: Story = {
  render: (args) => (
    <Toggle variant="outline" {...args}>
      <DefaultIcon />

      <Typography>Toggle</Typography>
    </Toggle>
  ),
}

export const Pressed: Story = {
  args: {
    defaultPressed: true,
  },
}

export const DisabledPressed: Story = {
  args: {
    disabled: true,
    defaultPressed: true,
  },
}
