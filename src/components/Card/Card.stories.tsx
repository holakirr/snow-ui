import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Input } from '../Input'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs', 'a11y'],
  argTypes: {
    bordered: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    bordered: false,
    className: 'w-[350px] flex flex-col gap-2 items-start',
  },
  render: (args) => (
    <Card {...args}>
      <Input placeholder="Email" name="email" />
      <Input placeholder="Password" type="password" name="password" />
      <Button variant="filled" size="lg">
        Login
      </Button>
    </Card>
  ),
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {}

export const BorderedCard: Story = {
  args: {
    bordered: true,
  },
}
