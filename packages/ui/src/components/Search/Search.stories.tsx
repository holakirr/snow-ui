import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'
import { animationsEnded } from '../../test/animations'
import { colorOf, hasInsetRing } from '../../test/colors'
import { Typography } from '../Text'
import { Search } from './Search'

const meta = {
  title: 'Components/Search',
  component: Search,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-43630',
    },
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

/**
 * The kit's In progress (`status="progress"`, added in 5.2): while results
 * load, a turning ring in Black/100% takes the clear button's place, and
 * the input is `aria-busy`.
 */
export const InProgress: Story = {
  args: { defaultValue: 'Typing', status: 'progress' },
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('searchbox')
    const ring = canvasElement.querySelector(
      'svg.animate-spinner-turn',
    ) as SVGElement
    await expect(input).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('button')).toBeNull()
    const { width, height } = ring.getBoundingClientRect()
    await expect([width, height]).toEqual([16, 16])
    await expect(getComputedStyle(ring).color).toBe(
      colorOf('text-black', canvasElement),
    )
  },
}

/** The clear button's keyboard focus: `focus-ring`, at full opacity. */
export const ClearButtonFocus: Story = {
  // A behaviour check: the same look as Typing plus the focus ring.
  tags: ['skip-visual'],
  args: { defaultValue: 'Typing' },
  play: async ({ canvas }) => {
    await userEvent.tab()
    await userEvent.tab()
    const clear = canvas.getByRole('button', { name: 'Clear search' })
    await expect(clear).toHaveFocus()
    // Focus fades it to full opacity: a busy runner may take longer than
    // `waitFor`'s timeout to render the transition.
    await animationsEnded(clear)
    await waitFor(() => expect(getComputedStyle(clear).opacity).toBe('1'))
    const style = getComputedStyle(clear)
    await expect(style.outlineStyle).toBe('solid')
    await expect(style.outlineWidth).toBe('2px')
    await expect(style.outlineOffset).toBe('2px')
  },
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
        <Typography size={12} className="text-secondary">
          Value: “{value}”
        </Typography>
      </div>
    )
  },
}

const Variants = () => (
  <div className="grid grid-cols-[auto_repeat(2,10rem)] items-center gap-x-8 gap-y-4">
    <span />
    <Typography size={12} className="text-secondary">
      Gray
    </Typography>
    <Typography size={12} className="text-secondary">
      Outline
    </Typography>
    {[
      { label: 'Default', props: {} },
      { label: 'Typing', props: { defaultValue: 'Typing' } },
      { label: 'Disabled', props: { disabled: true } },
    ].map(({ label, props }) => (
      <div key={label} className="contents">
        <Typography size={12} className="text-secondary">
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
    <Typography size={12} className="text-secondary">
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

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (the kit's Error stroke; the kit draws its Warning icon on Input and Textarea only). A 1px Secondary/Red stroke on both types. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  args: {
    defaultValue: 'a',
    'aria-invalid': true,
  },
  render: (args) => (
    <div className="flex gap-4">
      <Search {...args} />
      <Search {...args} variant="outline" />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const input of canvas.getAllByRole('searchbox', { name: 'Search' })) {
      await expect(input).toBeInvalid()
      const field = input.parentElement as HTMLElement
      await expect(
        await hasInsetRing(field, 'text-control-border-invalid', '1px'),
      ).toBe(true)
    }
  },
}
