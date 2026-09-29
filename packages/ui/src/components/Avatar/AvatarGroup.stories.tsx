import type { Meta, StoryObj } from '@storybook/react-vite'
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

/**
 * A stand-in for a user photo: a silhouette on a colour of the palette, as
 * an SVG data URI, so the stories and the docs page load no remote image.
 */
const photo = (background: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="${background}"/><circle cx="32" cy="26" r="12" fill="#fff" fill-opacity=".85"/><rect x="12" y="42" width="40" height="30" rx="15" fill="#fff" fill-opacity=".85"/></svg>`,
  )}`

// The palette's purple, blue, mint and orange.
const photos = {
  18: photo('#b899eb'),
  50: photo('#7dbbff'),
  70: photo('#6be6d3'),
  90: photo('#ffb55b'),
}

export const Default: Story = {
  args: {
    children: [
      <Avatar key="1">
        <AvatarImage src={photos[18]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2">
        <AvatarImage src={photos[50]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3">
        <AvatarImage src={photos[70]} alt="User 70" />
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
        <AvatarImage src={photos[18]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2">
        <AvatarImage src={photos[50]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3">
        <AvatarImage src={photos[70]} alt="User 70" />
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
        <AvatarImage src={photos[18]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2" size="sm">
        <AvatarImage src={photos[50]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="sm">
        <AvatarImage src={photos[70]} alt="User 70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="4" size="sm">
        <AvatarImage src={photos[90]} alt="User 90" />
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
        <AvatarImage src={photos[18]} alt="User 18" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="2" size="md">
        <AvatarImage src={photos[50]} alt="User 50" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="3" size="md">
        <AvatarImage src={photos[70]} alt="User 70" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
      <Avatar key="4" size="md">
        <AvatarImage src={photos[90]} alt="User 90" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    ],
  },
}

export const Dark: Story = {
  ...WithMoreItems,
  globals: { theme: 'dark' },
}
