import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputSmall } from './InputSmall'

const meta: Meta<typeof InputSmall> = {
  title: 'Components/Input/Input Small',
  component: InputSmall,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-43630',
    },
  },
  tags: ['autodocs'],
  args: {
    placeholder: 'Placeholder',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof InputSmall>

export const Default: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    defaultValue: 'Value',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Input with value',
    defaultValue: 'Initial value',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}
