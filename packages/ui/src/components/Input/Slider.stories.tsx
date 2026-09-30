import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, waitFor } from 'storybook/test'
import { animationsEnded } from '../../test/animations'
import { colorOf, hasInsetRing } from '../../test/colors'

import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Input/Slider',
  component: Slider,
  tags: ['autodocs', 'a11y'],
  args: {
    className: 'w-60',
    // Goes to the thumb (`role="slider"`); a range gets "…, minimum/maximum".
    'aria-label': 'Volume',
  },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-205091',
    },
    docs: {
      description: {
        component:
          'One value: the Figma "Slider2" bar. Two or more: the "SliderBar" range.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

/** The slider root of a thumb (the thumb has `data-orientation` too). */
const rootOf = (thumb: HTMLElement): HTMLElement => {
  const root = thumb.parentElement?.closest<HTMLElement>('[data-orientation]')
  if (!root) throw new Error('No slider root')
  return root
}

/** The handle lines of the bar (one per layer): shown in the Active state. */
const handleLines = (bar: HTMLElement) => [
  ...bar.querySelectorAll<HTMLElement>('[aria-hidden] > span.h-2'),
]

export const Default: Story = {
  args: {
    defaultValue: [50],
  },
}

/**
 * The Figma "Slider2" states, 160×32: Progress 0, 28, 74 and 100%, with the
 * label ("Text", `label`) and the value (`showValue`). The label is white
 * where the fill is under it, the value `text-secondary` on the track and
 * White/60% on the fill (see Accessibility).
 */
export const Progress: Story = {
  render: () => (
    <div className="flex w-40 flex-col gap-3">
      {[0, 28, 74, 100].map((value) => (
        <Slider key={value} label="Text" showValue defaultValue={[value]} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const thumbs = canvas.getAllByRole('slider', { name: 'Text' })
    await expect(thumbs.map((thumb) => thumb.ariaValueText)).toEqual([
      '0%',
      '28%',
      '74%',
      '100%',
    ])
  },
}

/**
 * The Figma "Active" state: while the pointer is over the bar or drags it,
 * and while its thumb has keyboard focus, a 2×8px handle line shows 4px
 * inside the fill's end (4px from the start at 0%) and the value darkens.
 * Keyboard focus also rings the bar (`focus-ring`).
 */
export const Active: Story = {
  render: () => (
    <div className="flex w-40 flex-col gap-3">
      <Slider label="Text" showValue defaultValue={[28]} />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const thumb = canvas.getByRole('slider', { name: 'Text' })
    const bar = rootOf(thumb)
    const [line] = handleLines(bar)
    await expect(getComputedStyle(line).opacity).toBe('0')

    await userEvent.tab()
    await expect(thumb).toHaveFocus()
    // The line fades in: a busy runner may take longer than `waitFor`'s
    // timeout to render the transition.
    await animationsEnded(line)
    await waitFor(() => expect(getComputedStyle(line).opacity).toBe('1'))
    await expect(getComputedStyle(bar).outlineStyle).toBe('solid')
    await expect(getComputedStyle(bar).outlineColor).toBe(
      colorOf('text-black-80', canvasElement),
    )

    await userEvent.keyboard('{ArrowRight}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '29')
    await expect(thumb).toHaveAttribute('aria-valuetext', '29%')
    await expect(bar).toHaveTextContent('29%')
    await userEvent.keyboard('{ArrowLeft}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '28')
  },
}

/**
 * `label` and `showValue` on a bar of any width. The label names the thumb
 * too; `valueFormatter` formats the value (and `aria-valuetext`).
 */
export const WithLabelAndValue: Story = {
  args: {
    'aria-label': undefined,
    label: 'Brightness',
    showValue: true,
    defaultValue: [64],
  },
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole('slider', { name: 'Brightness' })
    await expect(thumb).toHaveAttribute('aria-valuetext', '64%')
  },
}

export const Disabled: Story = {
  args: {
    'aria-label': undefined,
    label: 'Volume',
    showValue: true,
    defaultValue: [50],
    disabled: true,
  },
}

/**
 * Two or more values: the Figma "SliderBar", a 3px Black/4% track with a
 * Primary range between 28px thumbs.
 */
export const WithTwoValues: Story = {
  args: {
    defaultValue: [25, 75],
  },
}

/**
 * A range with `showValue`: the values beside the track, the first by the
 * minimum. Each text is as wide as the widest of `min` and `max`, so the
 * track doesn't move while they change.
 */
export const RangeWithValues: Story = {
  args: {
    'aria-label': 'Price',
    className: 'w-80',
    showValue: true,
    valueFormatter: (value) => `$${value}`,
    max: 500,
    step: 10,
    defaultValue: [120, 380],
    onValueChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const minimum = canvas.getByRole('slider', { name: 'Price, minimum' })
    const maximum = canvas.getByRole('slider', { name: 'Price, maximum' })
    await expect(minimum).toHaveAttribute('aria-valuetext', '$120')
    await expect(maximum).toHaveAttribute('aria-valuetext', '$380')

    const track = rootOf(minimum).firstElementChild
    if (!track) throw new Error('No track')
    // The layout requests Inter; measure once it has replaced the fallback.
    track.getBoundingClientRect()
    await document.fonts.ready
    const before = track.getBoundingClientRect().width
    minimum.focus()
    await userEvent.keyboard('{Home}')
    await expect(minimum).toHaveAttribute('aria-valuetext', '$0')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([0, 380])
    // Within a pixel: where glyph advances round to whole pixels (Linux),
    // "$120" and "$500" may differ by one. Without the reserved width the
    // track moves by about 18px.
    await expect(
      Math.abs(track.getBoundingClientRect().width - before),
    ).toBeLessThanOrEqual(1)
  },
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (no Figma state). It goes to the thumbs (the elements with
 * `role="slider"`), with `aria-describedby`; the bar gets a 1px
 * Secondary/Red stroke, a range red thumb borders. Pair it with the error
 * text: see Form.
 */
export const Invalid: Story = {
  render: (args) => (
    <div className="flex w-60 flex-col gap-6">
      <Slider {...args} label="Volume" showValue defaultValue={[80]} />
      <Slider {...args} aria-label="Price" defaultValue={[20, 80]} />
    </div>
  ),
  args: {
    'aria-invalid': true,
    'aria-label': undefined,
    className: undefined,
  },
  play: async ({ canvas, canvasElement }) => {
    const red = colorOf('text-control-border-invalid', canvasElement)
    const thumbs = canvas.getAllByRole('slider')
    for (const thumb of thumbs) await expect(thumb).toBeInvalid()

    const bar = rootOf(canvas.getByRole('slider', { name: 'Volume' }))
    // The track's last layer draws the stroke over the fill.
    const stroke = bar.firstElementChild?.lastElementChild
    if (!stroke) throw new Error('No stroke layer')
    await expect(
      await hasInsetRing(stroke, 'text-control-border-invalid', '1px'),
    ).toBe(true)

    for (const name of ['Price, minimum', 'Price, maximum']) {
      const thumb = canvas.getByRole('slider', { name })
      await expect(getComputedStyle(thumb).borderTopColor).toBe(red)
    }
  },
}

/**
 * Right-to-left text: the bar fills from the right, the label is on the
 * right and ArrowLeft increases the value.
 */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex w-60 flex-col gap-6">
      <Slider label="الصوت" showValue defaultValue={[28]} />
      <Slider aria-label="السعر" showValue defaultValue={[20, 80]} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const thumb = canvas.getByRole('slider', { name: 'الصوت' })
    const bar = rootOf(thumb)
    const fill = bar.querySelector('span[data-orientation].bg-primary')
    await waitFor(() =>
      expect(fill?.getBoundingClientRect().right).toBeCloseTo(
        bar.getBoundingClientRect().right,
        0,
      ),
    )
    thumb.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '29')
  },
}

/**
 * With more contrast (`prefers-contrast: more` or `data-contrast="more"`):
 * a `control-border` stroke around the bar and the range's track, and a
 * `control-border-strong` border on the range's thumbs.
 */
export const MoreContrast: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div data-contrast="more" className="flex w-60 flex-col gap-6">
      <Slider label="Volume" showValue defaultValue={[28]} />
      <Slider aria-label="Price" defaultValue={[20, 80]} />
    </div>
  ),
}

/** Controlled: `value` and `onValueChange`, the texts follow the value. */
export const Controlled: Story = {
  tags: ['!autodocs'],
  render: () => {
    const [value, setValue] = useState([40])
    return (
      <div className="flex w-60 flex-col gap-3">
        <Slider
          label="Opacity"
          showValue
          value={value}
          onValueChange={setValue}
        />
        <output className="text-12 text-secondary">{value[0]}</output>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    const thumb = canvas.getByRole('slider', { name: 'Opacity' })
    thumb.focus()
    await userEvent.keyboard('{End}')
    await expect(thumb).toHaveAttribute('aria-valuetext', '100%')
    await expect(canvas.getByText('100')).toBeInTheDocument()
  },
}
