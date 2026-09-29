import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '../Button'
import { Typography } from '../Text'
import { Spinner, type SpinnerSize } from './Spinner'

const SIZES: SpinnerSize[] = [12, 16, 20, 24, 32, 40, 48]

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A library extension built from the kit\'s "Loading A" icon: its ring (a 3/24 stroke with round caps) turns in the current text colour. A `role="status"` region with visually hidden "Loading" (`messages.spinner.label`). For reduced motion the ring stops and pulses.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { options: SIZES, control: { type: 'select' } },
    label: { control: 'text' },
  },
  args: {
    size: 20,
    className: 'text-black',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const spinner = canvas.getByRole('status')
    await expect(spinner).toHaveTextContent('Loading')
    await expect(spinner).toHaveClass('size-5')

    // The ring turns and its arc grows and shrinks, in CSS (not SMIL), so
    // `prefers-reduced-motion` can stop it: then the ring stands still and
    // the arc pulses (the `storybook-prefs` test run emulates it).
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const ring = spinner.querySelector('svg') as SVGSVGElement
    await expect(ring).toHaveAttribute('aria-hidden', 'true')
    await expect(getComputedStyle(ring).animationName).toBe(
      reduced ? 'none' : 'spinner-turn',
    )
    await expect(
      getComputedStyle(ring.querySelector('circle') as SVGCircleElement)
        .animationName,
    ).toBe(reduced ? 'pulse' : 'spinner-arc')
  },
}

/** The kit's icon sizes, 12 to 48px. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {SIZES.map((size) => (
        <Spinner key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

/**
 * The ring is the current text colour: here `text-black`, `text-secondary`,
 * `indigo-text` and `red-text`, and the `white` label of a Filled button.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="text-black" />
      <Spinner className="text-secondary" />
      <Spinner className="text-indigo-text" />
      <Spinner className="text-red-text" />
      <span className="flex size-9 items-center justify-center rounded-12 bg-primary text-white">
        <Spinner />
      </span>
    </div>
  ),
}

/**
 * In a busy button the label already says what is happening, so the spinner
 * is `aria-hidden` and the button `aria-busy` and disabled.
 */
export const InButton: Story = {
  render: () => (
    <Button
      variant="filled"
      size="md"
      label="Saving…"
      disabled
      aria-busy
      startContent={<Spinner size={16} aria-hidden />}
    />
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Saving…' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    // Hidden from assistive technology: no second "Loading" status.
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
  },
}

/**
 * Next to visible text: the text is the status, so the spinner is
 * `aria-hidden` and the row is the `role="status"` region.
 */
export const WithText: Story = {
  render: () => (
    <div role="status" className="flex items-center gap-2 text-black">
      <Spinner size={16} aria-hidden />
      <Typography size={14}>Loading the report…</Typography>
    </div>
  ),
  play: async ({ canvas }) => {
    const statuses = canvas.getAllByRole('status')
    await expect(statuses).toHaveLength(1)
    await expect(statuses[0]).toHaveTextContent('Loading the report…')
  },
}

/** The label comes from `SnowUIProvider` messages: here the Russian example. */
export const Localized: Story = {
  tags: ['!autodocs'],
  globals: { locale: 'ru' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Загрузка')
  },
}

export const SizesDark: Story = {
  ...Sizes,
  globals: { theme: 'dark' },
}
