import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Label } from '../Label'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Input/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  // A checkbox without a visible label needs an accessible name.
  args: { 'aria-label': 'Accept the terms' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-60046',
    },
    docs: {
      description: {
        component:
          'A control that allows the user to toggle between checked and not checked.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

/** Figma "Multiple". A click checks it, then it toggles as usual. */
export const Indeterminate: Story = {
  args: { defaultChecked: 'indeterminate' },
  play: async ({ canvas, userEvent, step }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' })
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed')

    await step('a click checks an indeterminate checkbox', async () => {
      await userEvent.click(checkbox)
      await expect(checkbox).toHaveAttribute('aria-checked', 'true')
      await expect(checkbox).toBeChecked()
    })

    await step('then it toggles between unchecked and checked', async () => {
      await userEvent.click(checkbox)
      await expect(checkbox).toHaveAttribute('aria-checked', 'false')
      await userEvent.keyboard(' ')
      await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
}

/** The Figma Checkbox set: False, True and Multiple (hover for the hover state). */
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(
        [
          ['unchecked', false],
          ['checked', true],
          ['indeterminate', 'indeterminate'],
        ] as const
      ).map(([name, checked]) => (
        <div key={name} className="flex items-center gap-2">
          <Checkbox id={`checkbox-${name}`} defaultChecked={checked} />
          <Label htmlFor={`checkbox-${name}`}>{name}</Label>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled" disabled />
        <Label htmlFor="checkbox-disabled">disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-checked" disabled defaultChecked />
        <Label htmlFor="checkbox-disabled-checked">disabled checked</Label>
      </div>
    </div>
  ),
}
