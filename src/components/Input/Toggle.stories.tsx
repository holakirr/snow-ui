import { DefaultIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react'
import { SIZES, TOGGLE_VARIANTS } from '../../constants'
import { Text } from '../Text'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Input/Toggle',
  component: Toggle,
  tags: ['autodocs', 'a11y'],
  args: {
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
}

export const Disabled: Story = {
  args: {
    disabled: true,
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

      <Text>Toggle</Text>
    </Toggle>
  ),
}
