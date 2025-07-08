import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: <Button variant="filled">Badge</Button> },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {},
}

export const WithContent: Story = {
  args: {
    content: '1',
  },
}

export const WithLongContent: Story = {
  args: {
    content: '10+',
  },
}
