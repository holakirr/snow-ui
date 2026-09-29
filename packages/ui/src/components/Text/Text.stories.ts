import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from './Text'

const meta = {
  title: 'Components/Text/Text',
  component: Typography,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32814-289',
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Not in the generated table: the props are generic (polymorphic).
    className: {
      description: "Merged with the component's classes (yours win conflicts).",
      table: { type: { summary: 'string' } },
    },
  },
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
