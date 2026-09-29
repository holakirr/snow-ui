import type { Meta, StoryObj } from '@storybook/react-vite'
import { SIZES } from '../../constants'
import { photos } from '../../test/photos'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar/Avatar',
  component: Avatar,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-47953',
    },
  },
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
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </>
    ),
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar size="sm">
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={photos[0]} alt="holakirr" />
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
