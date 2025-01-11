import type { Meta, StoryObj } from '@storybook/react'

import { Label } from '../Label'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Input/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'A group of radio buttons.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label className="text-black" htmlFor="r1">
          Default
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label className="text-black" htmlFor="r2">
          Comfortable
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label className="text-black" htmlFor="r3">
          Compact
        </Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label className="text-black" htmlFor="r1">
          Default
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" disabled />
        <Label className="text-black" htmlFor="r2">
          Comfortable
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label className="text-black" htmlFor="r3">
          Compact
        </Label>
      </div>
    </RadioGroup>
  ),
}
