import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'
import { AvatarGroup } from './AvatarGroup'

const meta = {
  title: 'Components/Avatar/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'number',
    },
  },
  args: {
    items: 3,
  },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: [
      <Avatar key="1">
        <AvatarImage src="https://avatar.iran.liara.run/public/18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2">
        <AvatarImage src="https://avatar.iran.liara.run/public/50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3">
        <AvatarImage src="https://avatar.iran.liara.run/public/70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    ],
  },
}

export const WithMoreItems: Story = {
  args: {
    items: 2,
    children: [
      <Avatar key="1">
        <AvatarImage src="https://avatar.iran.liara.run/public/18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2">
        <AvatarImage src="https://avatar.iran.liara.run/public/50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3">
        <AvatarImage src="https://avatar.iran.liara.run/public/70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    ],
  },
}

export const WithSmallAvatars: Story = {
  args: {
    items: 3,
    children: [
      <Avatar key="1" size="sm">
        <AvatarImage src="https://avatar.iran.liara.run/public/18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2" size="sm">
        <AvatarImage src="https://avatar.iran.liara.run/public/50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="sm">
        <AvatarImage src="https://avatar.iran.liara.run/public/70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="sm">
        <AvatarImage src="https://avatar.iran.liara.run/public/90" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    ],
  },
}

export const WithMediumAvatars: Story = {
  args: {
    items: 2,
    children: [
      <Avatar key="1" size="md">
        <AvatarImage src="https://avatar.iran.liara.run/public/18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2" size="md">
        <AvatarImage src="https://avatar.iran.liara.run/public/50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="md">
        <AvatarImage src="https://avatar.iran.liara.run/public/70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="md">
        <AvatarImage src="https://avatar.iran.liara.run/public/90" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    ],
  },
}
