import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Typography } from '../Text'
import { Search } from './Search'

const meta = {
  title: 'Components/Search',
  component: Search,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Search": a 28px search field with a search icon, an optional keyboard shortcut hint (`shortcut`) and a clear button that appears while it has a value (Escape clears too). `gray` and `outline` types; `lg` is the 48px field of the SearchPopup.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { options: ['gray', 'outline'], control: { type: 'radio' } },
    size: { options: ['sm', 'lg'], control: { type: 'radio' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    'aria-label': 'Search',
    placeholder: 'Search',
    shortcut: ['/'],
    className: 'w-40',
  },
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Gray: Story = {}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Typing: Story = {
  args: { defaultValue: 'Typing' },
}

export const WithoutShortcut: Story = {
  args: { shortcut: undefined },
}

export const Large: Story = {
  args: { size: 'lg', className: 'w-96', shortcut: ['⌘', 'K'] },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('Landing page')
    return (
      <div className="flex flex-col gap-2">
        <Search
          {...args}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Typography size={12} className="text-black-40">
          Value: “{value}”
        </Typography>
      </div>
    )
  },
}

const Variants = () => (
  <div className="grid grid-cols-[auto_repeat(2,10rem)] items-center gap-x-8 gap-y-4">
    <span />
    <Typography size={12} className="text-black-40">
      Gray
    </Typography>
    <Typography size={12} className="text-black-40">
      Outline
    </Typography>
    {[
      { label: 'Default', props: {} },
      { label: 'Typing', props: { defaultValue: 'Typing' } },
      { label: 'Disabled', props: { disabled: true } },
    ].map(({ label, props }) => (
      <div key={label} className="contents">
        <Typography size={12} className="text-black-40">
          {label}
        </Typography>
        {(['gray', 'outline'] as const).map((variant) => (
          <Search
            key={variant}
            variant={variant}
            aria-label={`${label} ${variant} search`}
            shortcut={['/']}
            {...props}
          />
        ))}
      </div>
    ))}
    <Typography size={12} className="text-black-40">
      Large
    </Typography>
    <div className="col-span-2">
      <Search size="lg" aria-label="Large search" shortcut={['⌘', 'K']} />
    </div>
  </div>
)

export const AllVariants: Story = {
  render: () => <Variants />,
}

export const AllVariantsDark: Story = {
  render: () => <Variants />,
  globals: { theme: 'dark' },
}
