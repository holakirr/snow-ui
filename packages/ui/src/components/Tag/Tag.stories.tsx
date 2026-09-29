import { DotIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { expect } from 'storybook/test'
import { Typography } from '../Text'
import { Tag, type TagState } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33307-661',
    },
  },
  tags: ['autodocs'],
  args: { label: 'Tag' },
  argTypes: {
    state: {
      options: ['default', 'active', 'static'],
      control: { type: 'radio' },
    },
    shape: {
      options: [
        'default',
        'arrow-start',
        'arrow-end',
        'arrow-left',
        'arrow-right',
      ],
      control: { type: 'radio' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {
  args: {
    onRemove: undefined,
  },
}

export const WithStartContent: Story = {
  args: {
    startContent: <DotIcon size={12} weight="fill" />,
  },
}

export const WithDotAndRemove: Story = {
  args: {
    dot: true,
    onRemove: () => {},
  },
}

export const Active: Story = {
  args: {
    dot: true,
    state: 'active',
    onRemove: () => {},
  },
}

export const Static: Story = {
  args: {
    state: 'static',
  },
}

/** The Figma "Left arrow" tag: the tip on the start side. */
export const ArrowStart: Story = {
  args: {
    shape: 'arrow-start',
  },
}

export const ArrowEnd: Story = {
  args: {
    shape: 'arrow-end',
  },
}

/**
 * Right-to-left text: the start content and the remove button swap sides,
 * `arrow-start` / `arrow-end` flip with them, and `arrow-left` /
 * `arrow-right` keep pointing left / right.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <Tag label="تصميم" dot onRemove={() => {}} />
        <Tag label="تصميم" state="active" dot onRemove={() => {}} />
      </div>
      <div className="flex items-center gap-2">
        <Tag label="البداية" shape="arrow-start" />
        <Tag label="النهاية" shape="arrow-end" />
        <Tag label="يسار" shape="arrow-left" />
        <Tag label="يمين" shape="arrow-right" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const remove = canvas.getAllByRole('button', {
      name: 'Remove tag تصميم',
    })[0]
    const label = canvas.getAllByText('تصميم')[0]
    // The remove button is at the end: on the left.
    await expect(remove.getBoundingClientRect().right).toBeLessThanOrEqual(
      label.getBoundingClientRect().left,
    )

    const tipOf = (text: string) => {
      const tag = canvas.getByText(text).closest('div') as HTMLElement
      const tip = tag.querySelector('svg') as SVGElement
      return tip.getBoundingClientRect().left <
        tag.getBoundingClientRect().left + 8
        ? 'left'
        : 'right'
    }
    await expect(tipOf('البداية')).toBe('right')
    await expect(tipOf('النهاية')).toBe('left')
    await expect(tipOf('يسار')).toBe('left')
    await expect(tipOf('يمين')).toBe('right')
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
          <Tag label="Tag" state={state} dot onRemove={() => {}} />
          <Tag label="Tag" state={state} dot />
          <Tag label="Tag" state={state} onRemove={() => {}} />
          <Tag label="Tag" state={state} />
          <Tag label="Tag" state={state} shape="arrow-start" />
          <Tag label="Tag" state={state} shape="arrow-end" />
        </Fragment>
      ))}
    </div>
  ),
}
