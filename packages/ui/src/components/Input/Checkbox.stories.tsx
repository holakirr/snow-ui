import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Input/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
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
