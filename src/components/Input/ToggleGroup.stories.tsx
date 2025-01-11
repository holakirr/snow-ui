import type { Meta, StoryObj } from '@storybook/react'

import {
  ArrowsDownIcon,
  ArrowsDownUpIcon,
  ArrowsUpIcon,
} from '@holakirr/snow-ui-icons'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/Input/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs', 'a11y'],
  args: {
    type: 'multiple',
  },
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'ToggleGroup component',
      },
    },
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="down" aria-label="Toggle down">
        <ArrowsDownIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="up" aria-label="Toggle up">
        <ArrowsUpIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="down-up" aria-label="Toggle down-up">
        <ArrowsDownUpIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Single: Story = {
  args: {
    type: 'single',
  },
}
