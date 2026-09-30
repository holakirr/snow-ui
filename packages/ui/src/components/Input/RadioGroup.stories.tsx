import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId } from 'react'
import { expect } from 'storybook/test'
import { hasInsetRing } from '../../test/colors'

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

/**
 * Invalid: `aria-invalid` on the group (the `role="radiogroup"`), which
 * `FormControl` sets while the field has an error (the kit draws its Error state on text fields; this extends their red stroke). Every
 * circle gets a Secondary/Red ring. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  render: function Render() {
    const id = useId()
    return (
      <RadioGroup aria-invalid aria-labelledby={`${id}-label`}>
        <Label id={`${id}-label`}>Density</Label>
        {['Default', 'Comfortable', 'Compact'].map((name) => (
          <div key={name} className="flex items-center space-x-2">
            <RadioGroupItem value={name} id={`${id}-${name}`} />
            <Label className="text-black" htmlFor={`${id}-${name}`}>
              {name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup')).toBeInvalid()
    for (const radio of canvas.getAllByRole('radio')) {
      await expect(
        await hasInsetRing(radio, 'text-control-border-invalid', '2px'),
      ).toBe(true)
    }
  },
}
