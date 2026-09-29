import type { Meta, StoryObj } from '@storybook/react-vite'

import { KBD } from './KBD'

const meta = {
  title: 'Components/Text/KBD',
  component: KBD,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33257-43265',
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['solid', 'border'],
      control: { type: 'radio' },
    },
  },
  args: {
    keys: ['⌘', 'K'],
  },
} satisfies Meta<typeof KBD>

export default meta
type Story = StoryObj<typeof meta>

/** Figma Kbd "Solid": a Black/4% fill. */
export const Default: Story = {
  args: {},
}

/** Figma Kbd "Border": a 0.5px Black/10% stroke. */
export const Border: Story = {
  args: {
    variant: 'border',
  },
}

export const SingleKey: Story = {
  args: {
    keys: ['/'],
    variant: 'border',
  },
}
