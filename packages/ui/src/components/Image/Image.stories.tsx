import { StarIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { Typography } from '../Text'
import { Image, type ImageSize } from './Image'

const SIZES: Exclude<ImageSize, 'free'>[] = [
  12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80,
]

/**
 * A stand-in picture (hills under a sky), as an SVG data URI: the stories
 * load no remote image.
 */
const picture = (sky: string, hill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="${sky}"/><circle cx="116" cy="48" r="16" fill="#fff" fill-opacity=".9"/><path d="M0 120 Q40 80 80 110 T160 100 V160 H0Z" fill="${hill}"/></svg>`,
  )}`

const pictures = [
  picture('#adadfb', '#5b5bd6'),
  picture('#7dbbff', '#6be6d3'),
  picture('#ffb55b', '#b899eb'),
  picture('#71dd8c', '#7dbbff'),
] as const

const meta = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-47953',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Image": a rounded-square (squircle where the browser supports `corner-shape`) frame, 12 to 80px or `free`, for a picture, a logo or an icon (`icon`), with the Hover and Selected states and the Option mark of an image picker.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { options: [...SIZES, 'free'], control: { type: 'select' } },
    icon: { control: 'boolean' },
    interactive: { control: 'boolean' },
    selected: { control: 'boolean' },
    option: { control: 'boolean' },
  },
  args: {
    size: 80,
    icon: false,
    interactive: false,
    selected: false,
    option: false,
    children: <img src={pictures[0]} alt="Hills under a lilac sky" />,
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', { name: 'Hills under a lilac sky' })
    const frame = img.closest('[data-size]') as HTMLElement
    await expect(frame).toHaveAttribute('data-size', '80')
    const box = img.getBoundingClientRect()
    // The picture fills the 80px frame.
    await expect([box.width, box.height]).toEqual([80, 80])
  },
}

/** A 16:9 picture, to show that the frame crops it. */
const wide = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="#7dbbff"/><path d="M0 70 Q40 40 80 60 T160 55 V90 H0Z" fill="#6be6d3"/></svg>',
)}`

/**
 * A `<picture>` (art direction, modern formats) fills the frame like an
 * `<img>`: its `<img>` is stretched and cropped too.
 */
export const Picture: Story = {
  // A behaviour check: the same look as Default.
  tags: ['!autodocs', 'skip-visual'],
  render: () => (
    <Image size={40}>
      <picture>
        <source srcSet={wide} type="image/svg+xml" />
        <img src={wide} alt="Hills under a blue sky" />
      </picture>
    </Image>
  ),
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', {
      name: 'Hills under a blue sky',
    }) as HTMLImageElement
    await img.decode()
    const box = img.getBoundingClientRect()
    await expect([box.width, box.height]).toEqual([40, 40])
  },
}

/** Figma radius of each `Size`. */
const RADII: Record<(typeof SIZES)[number], number> = {
  12: 4,
  16: 4,
  20: 4,
  24: 8,
  28: 8,
  32: 8,
  40: 12,
  48: 12,
  56: 16,
  64: 20,
  72: 20,
  80: 20,
}

/** Figma `Size`: 12 to 80px. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {SIZES.map((size) => (
        <Image key={size} size={size}>
          <img src={pictures[1]} alt="" />
        </Image>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const size of SIZES) {
      const frame = canvasElement.querySelector(
        `[data-size="${size}"]`,
      ) as HTMLElement
      await expect(frame.getBoundingClientRect().width).toBe(size)
      await expect(getComputedStyle(frame).borderTopLeftRadius).toBe(
        `${RADII[size]}px`,
      )
    }
  },
}

/** `size="free"`: the frame takes the size of a class. */
export const Free: Story = {
  args: {
    size: 'free',
    className: 'h-24 w-40',
    children: <img src={pictures[2]} alt="Hills under an orange sky" />,
  },
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img')
    const box = img.getBoundingClientRect()
    await expect([box.width, box.height]).toEqual([160, 96])
    // Figma: the Free frame's radius is 20.
    await expect(
      getComputedStyle(img.closest('[data-size]') as HTMLElement)
        .borderTopLeftRadius,
    ).toBe('20px')
  },
}

/**
 * Figma `Icon`: the content sits inset on the Black/4% tile, e.g. an app
 * logo or an icon.
 */
export const Icon: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {([24, 40, 56, 80] as const).map((size) => (
        <Image key={size} size={size} icon>
          <img src={pictures[3]} alt="" />
        </Image>
      ))}
      <Image size={40} icon className="text-black">
        <StarIcon aria-label="Favourites" />
      </Image>
    </div>
  ),
}

/**
 * Figma `State` and `Option`: Default, Hover (`interactive`, hover it),
 * Selected (a 2px Primary ring), and the option mark unchecked and checked.
 */
export const States: Story = {
  render: () => (
    <div className="grid grid-cols-5 items-end gap-6">
      {(
        [
          ['Default', {}],
          ['Interactive', { interactive: true }],
          ['Selected', { selected: true }],
          ['Option', { interactive: true, option: true }],
          ['Option, selected', { option: true, selected: true }],
        ] as const
      ).map(([label, props]) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <Image size={64} {...props}>
            <img src={pictures[0]} alt="" />
          </Image>
          <Typography size={12} className="text-secondary">
            {label}
          </Typography>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frames = canvasElement.querySelectorAll('[data-size]')
    const [, , selected, option, checked] = [...frames]
    await expect(selected).toHaveAttribute('data-state', 'selected')
    await expect(
      option.querySelector('[data-slot="radio-mark"]'),
    ).toHaveAttribute('data-state', 'unchecked')
    await expect(
      checked.querySelector('[data-slot="radio-mark"]'),
    ).toHaveAttribute('data-state', 'checked')
  },
}

export const StatesDark: Story = {
  ...States,
  globals: { theme: 'dark' },
}

/** The option mark at every size. */
export const OptionSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[false, true].map((selected) => (
        <div key={String(selected)} className="flex items-end gap-3">
          {SIZES.map((size) => (
            <Image key={size} size={size} option selected={selected}>
              <img src={pictures[1]} alt="" />
            </Image>
          ))}
        </div>
      ))}
    </div>
  ),
}

const COVERS = [
  { name: 'Lilac', src: pictures[0] },
  { name: 'Sky', src: pictures[1] },
  { name: 'Sunset', src: pictures[2] },
  { name: 'Meadow', src: pictures[3] },
]

const CoverPicker = () => {
  const [cover, setCover] = useState('Sky')
  return (
    <fieldset className="flex gap-3">
      <legend className="sr-only">Cover</legend>
      {COVERS.map(({ name, src }) => (
        // A native radio, visually hidden: the label (the image) is the
        // target, arrow keys move the choice, the focus ring is the label's.
        <label
          key={name}
          className="relative rounded-20 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black-80"
        >
          <input
            type="radio"
            name="cover"
            value={name}
            checked={name === cover}
            onChange={() => setCover(name)}
            className="sr-only"
          />
          <Image size={64} interactive option selected={name === cover}>
            <img src={src} alt="" />
          </Image>
          <span className="sr-only">{name}</span>
        </label>
      ))}
    </fieldset>
  )
}

/**
 * An image picker: each Image is the label of a visually hidden native
 * radio, which says which one is selected; the mark shows it.
 */
export const Picker: Story = {
  render: () => <CoverPicker />,
  play: async ({ canvas, userEvent }) => {
    const sky = canvas.getByRole('radio', { name: 'Sky' })
    await expect(sky).toBeChecked()

    await userEvent.click(canvas.getByText('Sunset'))
    const sunset = canvas.getByRole('radio', { name: 'Sunset' })
    await expect(sunset).toBeChecked()
    await expect(
      sunset.parentElement?.querySelector('[data-slot="radio-mark"]'),
    ).toHaveAttribute('data-state', 'checked')

    // Arrow keys move the choice, as in any radio group.
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'Meadow' })).toBeChecked()
  },
}

/** Right-to-left text: the option mark is on the top left. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <Image size={64} option selected>
      <img src={pictures[2]} alt="تلال" />
    </Image>
  ),
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', { name: 'تلال' })
    const frame = img.closest('[data-size]') as HTMLElement
    const mark = frame.querySelector('[data-slot="radio-mark"]') as HTMLElement
    await expect(mark.getBoundingClientRect().left).toBeLessThan(
      frame.getBoundingClientRect().left + 20,
    )
  },
}
