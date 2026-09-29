import type { Meta, StoryObj } from '@storybook/react-vite'
import { photos } from '../../test/photos'
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
        <AvatarImage src={photos[0]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2">
        <AvatarImage src={photos[1]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3">
        <AvatarImage src={photos[2]} alt="User 70" />
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
        <AvatarImage src={photos[0]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2">
        <AvatarImage src={photos[1]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3">
        <AvatarImage src={photos[2]} alt="User 70" />
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
        <AvatarImage src={photos[0]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2" size="sm">
        <AvatarImage src={photos[1]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="sm">
        <AvatarImage src={photos[2]} alt="User 70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="4" size="sm">
        <AvatarImage src={photos[3]} alt="User 90" />
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
        <AvatarImage src={photos[0]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2" size="md">
        <AvatarImage src={photos[1]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="md">
        <AvatarImage src={photos[2]} alt="User 70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="4" size="md">
        <AvatarImage src={photos[3]} alt="User 90" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    ],
  },
}

export const Dark: Story = {
  ...WithMoreItems,
  globals: { theme: 'dark' },
}
