import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId } from 'react'
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
  // `useId` keeps the ids unique if the story is on a page more than once.
  render: function Render() {
    const id = useId()
    return (
      <div className="flex items-center gap-6">
        {(
          [
            ['unchecked', false],
            ['checked', true],
            ['indeterminate', 'indeterminate'],
          ] as const
        ).map(([name, checked]) => (
          <div key={name} className="flex items-center gap-2">
            <Checkbox id={`${id}-${name}`} defaultChecked={checked} />
            <Label htmlFor={`${id}-${name}`}>{name}</Label>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Checkbox id={`${id}-disabled`} disabled />
          <Label htmlFor={`${id}-disabled`}>disabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id={`${id}-disabled-checked`} disabled defaultChecked />
          <Label htmlFor={`${id}-disabled-checked`}>disabled checked</Label>
        </div>
      </div>
    )
  },
}
