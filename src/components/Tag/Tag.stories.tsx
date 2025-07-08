import { DotIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { label: 'Tag' },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {
  args: {
    onClose: undefined,
  },
}

export const WithLeftContent: Story = {
  args: {
    leftContent: <DotIcon size={16} weight="fill" />,
  },
}
