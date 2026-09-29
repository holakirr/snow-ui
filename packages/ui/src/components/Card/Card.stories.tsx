import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Input } from '../Input'
import { Typography } from '../Text'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs', 'a11y'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-44142',
    },
    docs: {
      description: {
        component:
          'A surface for grouped content. `variant="default"` is the Figma Card component (radius 16, padding 12/16, Surface/1) with the Static, Default (`interactive`), Hover and Selected states; `variant="block"` is the dashboard block (radius 20, padding 24, Background/2).',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'block'] },
    interactive: { control: 'boolean' },
    selected: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    interactive: false,
    selected: false,
    bordered: false,
  },
}

export default meta
type Story = StoryObj<typeof Card>

const Rows = ({ count }: { count: number }) =>
  Array.from({ length: count }, (_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
    <Typography key={i}>Text</Typography>
  ))

/** Radio-like marker that the Figma Hover and Selected states show. */
const Marker = ({ checked }: { checked?: boolean }) => (
  <span
    aria-hidden
    className={
      checked
        ? 'absolute top-3 right-4 size-5 rounded-full border-[6px] border-primary bg-background-3'
        : 'absolute top-3 right-4 size-5 rounded-full border border-black-20 bg-background-3'
    }
  />
)

export const Default: Story = {
  args: { className: 'w-[180px] flex flex-col gap-1' },
  render: (args) => (
    <Card {...args}>
      <Rows count={2} />
    </Card>
  ),
}

/** Figma `Count` = 1–4: the number of text rows. */
export const Count: Story = {
  render: (args) => (
    <div className="flex items-start gap-4">
      {[1, 2, 3, 4].map((count) => (
        <Card key={count} {...args} className="w-[120px] flex flex-col gap-1">
          <Rows count={count} />
        </Card>
      ))}
    </div>
  ),
}

const states = [
  { label: 'Static', props: {} },
  { label: 'Default (interactive)', props: { interactive: true } },
  { label: 'Hover', props: { bordered: true }, marker: 'empty' },
  { label: 'Selected', props: { selected: true }, marker: 'checked' },
] as const

/** Figma `State`: Static, Default (hover it), Hover and Selected. */
export const States: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {states.map(({ label, props, ...rest }) => (
        <div key={label} className="flex flex-col gap-2">
          <Typography size={12} className="text-secondary">
            {label}
          </Typography>
          <Card {...props} className="relative w-[180px] flex flex-col gap-1">
            <Rows count={2} />
            {'marker' in rest && <Marker checked={rest.marker === 'checked'} />}
          </Card>
        </div>
      ))}
    </div>
  ),
}

export const StatesDark: Story = {
  ...States,
  globals: { theme: 'dark' },
}

/** Interactive cards used as a single-choice list. */
export const Selectable: Story = {
  render: () => {
    const [value, setValue] = useState('Starter')

    return (
      <div role="radiogroup" aria-label="Plan" className="flex gap-4">
        {['Starter', 'Pro', 'Team'].map((plan) => (
          <Card
            key={plan}
            role="radio"
            aria-checked={value === plan}
            tabIndex={0}
            interactive
            selected={value === plan}
            onClick={() => setValue(plan)}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault()
                setValue(plan)
              }
            }}
            className="relative w-[160px] flex flex-col gap-1"
          >
            <Typography semibold>{plan}</Typography>
            <Typography size={12} className="text-secondary">
              Plan
            </Typography>
            {value === plan && <Marker checked />}
          </Card>
        ))}
      </div>
    )
  },
}

/** The dashboard block: radius 20, padding 24, Background/2. */
export const Block: Story = {
  args: { variant: 'block', className: 'w-[420px] flex flex-col gap-4' },
  render: (args) => (
    <Card {...args}>
      <Typography semibold>Traffic by Website</Typography>
      <div className="flex flex-col gap-2">
        {['Google', 'YouTube', 'Instagram', 'Pinterest'].map((site) => (
          <div key={site} className="flex justify-between">
            <Typography size={12}>{site}</Typography>
            <Typography size={12} className="text-secondary">
              12.5K
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  ),
}

/** Dashboard stat tiles: blocks tinted with `color-1` / `color-2`. */
export const StatTiles: Story = {
  render: () => (
    <div className="flex gap-4">
      {[
        ['Views', '7,265', 'bg-color-1'],
        ['Visits', '3,671', 'bg-color-2'],
      ].map(([label, value, tint]) => (
        <Card
          key={label}
          variant="block"
          className={`w-[202px] flex flex-col gap-2 text-static-black ${tint}`}
        >
          <Typography semibold>{label}</Typography>
          <Typography size={24} semibold>
            {value}
          </Typography>
        </Card>
      ))}
    </div>
  ),
}

export const BlockDark: Story = {
  ...Block,
  globals: { theme: 'dark' },
}

export const LoginForm: Story = {
  args: {
    variant: 'block',
    className: 'w-[350px] flex flex-col gap-2 items-start',
  },
  render: (args) => (
    <Card {...args}>
      <Input placeholder="Email" name="email" />
      <Input placeholder="Password" type="password" name="password" />
      <Button variant="filled" size="lg">
        Login
      </Button>
    </Card>
  ),
}
