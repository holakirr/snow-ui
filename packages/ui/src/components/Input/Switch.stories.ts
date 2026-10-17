import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
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
 * error (the kit draws its Error state on text fields; this extends their red stroke). A 1px Secondary/Red stroke inside the track. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole('switch')

    await expect(control).toBeInvalid()
    await expect(
      await hasInsetRing(control, 'text-control-border-invalid', '1px'),
    ).toBe(true)
  },
}

/** The 28px icon frame in the source Account Settings status row. */
export const AccountStatus: Story = {
  args: { size: 28 },
  play: async ({ canvas, userEvent }) => {
    const control = canvas.getByRole('switch')
    const thumb = control.querySelector('[data-slot="switch-thumb"]')
    if (!thumb) throw new Error('Switch thumb is missing')
    const track = control.getBoundingClientRect()
    const styles = getComputedStyle(control)
    await expect(track.width).toBe(24.5)
    await expect(track.height).toBe(14)
    await expect(Number.parseFloat(styles.marginLeft) * 2 + track.width).toBe(
      28,
    )
    await expect(Number.parseFloat(styles.marginTop) * 2 + track.height).toBe(
      28,
    )
    await expect(thumb.getBoundingClientRect().width).toBe(10.5)
    const start = thumb.getBoundingClientRect().x
    await userEvent.click(control)
    await expect(control).toBeChecked()
    await waitFor(() =>
      expect(Math.abs(thumb.getBoundingClientRect().x - start)).toBeCloseTo(
        10.5,
        2,
      ),
    )
    await userEvent.keyboard(' ')
    await expect(control).not.toBeChecked()
    await waitFor(() =>
      expect(thumb.getBoundingClientRect().x).toBeCloseTo(start, 2),
    )
  },
}
