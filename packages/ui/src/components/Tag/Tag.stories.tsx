import { DotIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { Typography } from '../Text'
import { Tag, type TagState } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { label: 'Tag' },
  argTypes: {
    state: {
      options: ['default', 'active', 'static'],
      control: { type: 'radio' },
    },
    shape: {
      options: ['default', 'arrow-left', 'arrow-right'],
      control: { type: 'radio' },
    },
  },
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
    leftContent: <DotIcon size={12} weight="fill" />,
  },
}

export const WithDotAndClose: Story = {
  args: {
    dot: true,
    onClose: () => {},
  },
}

export const Active: Story = {
  args: {
    dot: true,
    state: 'active',
    onClose: () => {},
  },
}

export const Static: Story = {
  args: {
    state: 'static',
  },
}

export const ArrowLeft: Story = {
  args: {
    shape: 'arrow-left',
  },
}

export const ArrowRight: Story = {
  args: {
    shape: 'arrow-right',
  },
}

const states: TagState[] = ['default', 'active', 'static']

/**
 * The Figma Tag set: every state with and without the dot and close icons,
 * and the arrow types (hover a default tag to see its hover state).
 */
export const Matrix: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(6,auto)] items-center gap-x-6 gap-y-4">
      {states.map((state) => (
        <Fragment key={state}>
          <Typography size={12} className="text-secondary">
            {state}
          </Typography>
          <Tag label="Tag" state={state} dot onClose={() => {}} />
          <Tag label="Tag" state={state} dot />
          <Tag label="Tag" state={state} onClose={() => {}} />
          <Tag label="Tag" state={state} />
          <Tag label="Tag" state={state} shape="arrow-left" />
          <Tag label="Tag" state={state} shape="arrow-right" />
        </Fragment>
      ))}
    </div>
  ),
}
