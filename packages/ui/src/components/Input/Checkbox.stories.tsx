import type { Meta, StoryObj } from '@storybook/react-vite'
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

/** Figma "Multiple". */
export const Indeterminate: Story = {
  args: { checked: 'indeterminate' },
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
