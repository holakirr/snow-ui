import { StarIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Badge, BadgeComponent } from './Badge'

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

/** The Figma Badge set: "Dot" and "Number", alone and on an icon. */
export const Types: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <BadgeComponent />
      <BadgeComponent content="8" />
      <BadgeComponent content="24" />
      <Badge>
        <StarIcon size={24} />
      </Badge>
      <Badge content="8">
        <StarIcon size={24} />
      </Badge>
    </div>
  ),
}
