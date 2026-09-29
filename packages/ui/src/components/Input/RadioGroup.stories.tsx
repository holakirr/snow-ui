import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId } from 'react'

import { Label } from '../Label'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Input/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-74134',
    },
    docs: {
      description: {
        component: 'A group of radio buttons.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

// The ids come from `useId`, so they stay unique when several stories share
// a page (the docs) and each `<Label htmlFor>` names its own radio.
export const Default: Story = {
  render: function Render() {
    const id = useId()
    return (
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id={`${id}-default`} />
          <Label className="text-black" htmlFor={`${id}-default`}>
            Default
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="comfortable" id={`${id}-comfortable`} />
          <Label className="text-black" htmlFor={`${id}-comfortable`}>
            Comfortable
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compact" id={`${id}-compact`} />
          <Label className="text-black" htmlFor={`${id}-compact`}>
            Compact
          </Label>
        </div>
      </RadioGroup>
    )
  },
}

export const WithDisabled: Story = {
  render: function Render() {
    const id = useId()
    return (
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id={`${id}-default`} />
          <Label className="text-black" htmlFor={`${id}-default`}>
            Default
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="comfortable"
            id={`${id}-comfortable`}
            disabled
          />
          <Label className="text-black" htmlFor={`${id}-comfortable`}>
            Comfortable
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compact" id={`${id}-compact`} />
          <Label className="text-black" htmlFor={`${id}-compact`}>
            Compact
          </Label>
        </div>
      </RadioGroup>
    )
  },
}
