import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './Text'

const meta = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    children: 'Text',
    className: 'text-black',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
