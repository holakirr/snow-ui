import type { Meta, StoryObj } from '@storybook/react-vite'
import { SIZES } from '../../constants'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    size: SIZES.lg,
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    children: (
      <>
        <AvatarImage src="https://avatars.githubusercontent.com/u/19807798?v=4" />
        <AvatarFallback>HK</AvatarFallback>
      </>
    ),
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar size="sm">
        <AvatarImage src="https://avatars.githubusercontent.com/u/19807798?v=4" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src="https://avatars.githubusercontent.com/u/19807798?v=4" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://avatars.githubusercontent.com/u/19807798?v=4" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FallbackOnly: Story = {
  args: {
    children: <AvatarFallback>HK</AvatarFallback>,
  },
}
