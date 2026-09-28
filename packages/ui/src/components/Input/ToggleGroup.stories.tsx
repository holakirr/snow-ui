import {
  ArrowsDownIcon,
  ArrowsDownUpIcon,
  ArrowsUpIcon,
} from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { SIZES, TOGGLE_VARIANTS } from '../../constants'
import { Typography } from '../Text'
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

/** Figma Tab "Pill": the items sit on a blurred Black/4% track. */
export const Pill: Story = {
  args: {
    type: 'single',
    variant: 'pill',
    defaultValue: 'up',
  },
}

/** Figma Tab "Solid": the pressed item is a Gray button. */
export const Solid: Story = {
  args: {
    type: 'single',
    defaultValue: 'up',
  },
}

/** Every variant and size, with the middle item pressed. */
export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-10 gap-y-6">
      <span />
      {Object.values(SIZES).map((size) => (
        <Typography key={size} size={12} className="text-secondary">
          {size}
        </Typography>
      ))}
      {Object.values(TOGGLE_VARIANTS).map((variant) => (
        <Fragment key={variant}>
          <Typography size={12} className="text-secondary">
            {variant}
          </Typography>
          {Object.values(SIZES).map((size) => (
            <ToggleGroup
              key={size}
              type="single"
              variant={variant}
              size={size}
              defaultValue="up"
            >
              <ToggleGroupItem value="down" aria-label="Toggle down">
                <ArrowsDownIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="up" aria-label="Toggle up">
                <ArrowsUpIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="text">
                <Typography className="text-inherit">Text</Typography>
              </ToggleGroupItem>
            </ToggleGroup>
          ))}
        </Fragment>
      ))}
    </div>
  ),
}
