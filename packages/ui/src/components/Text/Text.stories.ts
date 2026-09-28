import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from './Text'

const meta = {
  title: 'Components/Text/Text',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    children: 'Text',
    className: 'text-black',
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
