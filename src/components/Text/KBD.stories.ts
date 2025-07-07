import type { Meta, StoryObj } from '@storybook/react-vite'

import { KBD } from './KBD'

const meta = {
  title: 'Components/Text/KBD',
  component: KBD,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    keys: ['⌘', 'K'],
  },
} satisfies Meta<typeof KBD>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
