import { ArrowLineRightIcon, StarIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment, useState } from 'react'
import { expect, fn } from 'storybook/test'
import { BUTTON_VARIANTS, ROLES, SIZES } from '../../constants'
import { colorOf, settledColor } from '../../test/colors'
import { Typography } from '../Text/Text'
import { Button } from './Button'

const leftIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-arrow-left"
    viewBox="0 0 16 16"
    role={ROLES.img}
  >
    <title>Left Icon</title>
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    />
  </svg>
)

const rightIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-arrow-right"
    viewBox="0 0 16 16"
    role={ROLES.img}
  >
    <title>Right Icon</title>
    <path
      fillRule="evenodd"
      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
    />
  </svg>
)

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-43615',
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Not in the generated table: the props are generic (polymorphic).
    className: {
      description: "Merged with the component's classes (yours win conflicts).",
      table: { type: { summary: 'string' } },
    },
    variant: {
      options: Object.values(BUTTON_VARIANTS),
      control: { type: 'radio' },
    },
    size: {
      options: Object.values(SIZES),
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  args: {
    label: Button.displayName,
    // I use filled to see better in snapshots but the default is borderless
    variant: 'filled',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Borderless: Story = {
  args: {
    variant: 'borderless',
  },
}

export const Gray: Story = {
  args: {
    variant: 'gray',
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

/**
 * A Bare button's colour comes from `--button-fg`, which hover and keyboard
 * focus switch to black. A `text-*` class sets the colour in every state
 * instead ("Delete"); `[--button-fg:…]` changes only the rest colour.
 */
export const BareCustomColor: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="bare" label="Archive" />
      <Button variant="bare" label="Delete" className="text-red-text" />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const archive = canvas.getByRole('button', { name: 'Archive' })
    const remove = canvas.getByRole('button', { name: 'Delete' })
    const red = colorOf('text-red-text', canvasElement)

    await expect(await settledColor(archive)).toBe(
      colorOf('text-secondary', canvasElement),
    )
    await expect(await settledColor(remove)).toBe(red)

    await step('keyboard focus turns the default one black', async () => {
      await userEvent.tab()
      await expect(archive).toHaveFocus()
      await expect(archive.matches(':focus-visible')).toBe(true)
      await expect(await settledColor(archive)).toBe(
        colorOf('text-black', canvasElement),
      )
    })

    await step('and keeps the custom colour', async () => {
      await userEvent.tab()
      await expect(remove).toHaveFocus()
      await expect(remove.matches(':focus-visible')).toBe(true)
      await expect(await settledColor(remove)).toBe(red)
    })
  },
}

/** Figma "Bare": no box, a secondary label (Figma: 40% opacity), black on hover. */
export const Bare: Story = {
  args: {
    variant: 'bare',
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-4" title="Disabled buttons">
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled />
      ))}
    </div>
  ),
}

/**
 * The kit's form button (Guidance → Form): "Save Changes" becomes a Gray
 * button of the same width with a spinner while it saves. `loading` (added
 * in 5.2) keeps the content in place, invisible, so nothing moves, and the
 * button keeps its name and the focus; it is `aria-busy`, and a click,
 * Enter or Space does nothing until it is done.
 */
export const Loading: Story = {
  args: { onClick: fn() },
  render: ({ onClick }) => {
    const SaveChanges = () => {
      const [saving, setSaving] = useState(false)
      return (
        <div className="flex items-center gap-2 rounded-16 p-4 inset-ring-[0.5px] inset-ring-black-10">
          <Button
            variant="gray"
            label="Cancel"
            onClick={() => setSaving(false)}
          />
          <Button
            variant="filled"
            label="Save Changes"
            loading={saving}
            onClick={(event) => {
              onClick?.(event)
              setSaving(true)
            }}
          />
        </div>
      )
    }
    return <SaveChanges />
  },
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    await canvasElement.ownerDocument.fonts.ready
    const save = canvas.getByRole('button', { name: 'Save Changes' })
    save.getBoundingClientRect()
    const before = save.getBoundingClientRect()

    await step('a click starts loading, with no layout shift', async () => {
      await userEvent.click(save)
      await expect(args.onClick).toHaveBeenCalledOnce()
      await expect(save).toHaveAttribute('aria-busy', 'true')
      await expect(save).toHaveAttribute('aria-disabled', 'true')
      const after = save.getBoundingClientRect()
      await expect(after.width).toBeCloseTo(before.width, 0)
      await expect(after.height).toBeCloseTo(before.height, 0)
      await expect(after.left).toBeCloseTo(before.left, 0)
      // The name stays; the spinner is in the middle.
      await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBe(
        save,
      )
      const ring = save
        .querySelector('[data-button-spinner]')
        ?.getBoundingClientRect()
      await expect(ring?.width).toBeCloseTo(12, 0)
      await expect((ring?.left ?? 0) + (ring?.width ?? 0) / 2).toBeCloseTo(
        after.left + after.width / 2,
        0,
      )
    })

    await step(
      'it keeps the focus and ignores Enter, Space and clicks',
      async () => {
        await expect(save).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')
        await userEvent.click(save)
        await expect(args.onClick).toHaveBeenCalledOnce()
      },
    )

    await step('Cancel ends it', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
      await expect(save).not.toHaveAttribute('aria-busy')
      await expect(save.getBoundingClientRect().width).toBeCloseTo(
        before.width,
        0,
      )
    })
  },
}

/**
 * Every variant and size while loading: the spinner is the size of the
 * button's icon (12, 16, 20; 16, 20, 24 in an icon-only button) in its text
 * colour. Filled turns Gray; the others keep their fill, without the hover.
 */
export const LoadingStates: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-[repeat(4,auto)] items-center justify-start gap-4">
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Fragment key={variant}>
          {Object.values(SIZES).map((size) => (
            <Button
              key={size}
              variant={variant}
              size={size}
              label={`${variant} ${size}`}
              loading
            />
          ))}
          <Button
            variant={variant}
            size="md"
            aria-label={`${variant} star`}
            startContent={<StarIcon size={20} />}
            loading
          />
        </Fragment>
      ))}
    </div>
  ),
}

/**
 * Right-to-left text: the spinner stays in the middle, over the content,
 * which keeps its right-to-left order.
 */
export const LoadingRTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <Button
      variant="filled"
      size="md"
      label="حفظ التغييرات"
      startContent={<StarIcon size={16} />}
      loading
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await canvasElement.ownerDocument.fonts.ready
    const button = canvas.getByRole('button', { name: 'حفظ التغييرات' })
    const box = button.getBoundingClientRect()
    const ring = button
      .querySelector('[data-button-spinner]')
      ?.getBoundingClientRect()
    await expect((ring?.left ?? 0) + (ring?.width ?? 0) / 2).toBeCloseTo(
      box.left + box.width / 2,
      0,
    )
    await expect((ring?.top ?? 0) + (ring?.height ?? 0) / 2).toBeCloseTo(
      box.top + box.height / 2,
      0,
    )
  },
}

export const AllVariants: Story = {
  render: (args) => (
    <div
      className="grid grid-cols-2 gap-4 place-items-center"
      title="Buttons all variants"
    >
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Fragment key={variant}>
          <Typography>{variant}</Typography>
          <Button {...args} variant={variant} />
        </Fragment>
      ))}
    </div>
  ),
}

export const Sm: Story = {
  args: {
    size: SIZES.sm,
  },
}

export const Md: Story = {
  args: {
    size: SIZES.md,
  },
}

export const Lg: Story = {
  args: {
    size: SIZES.lg,
  },
}

export const AllSizes: Story = {
  render: ({ ...args }) => (
    <div
      className="grid grid-cols-2 gap-4 place-items-center"
      title="Buttons all sizes"
    >
      {Object.values(SIZES).map((size) => (
        <Fragment key={size}>
          <Typography>{size}</Typography>
          <Button {...args} size={size} />
        </Fragment>
      ))}
    </div>
  ),
}

// Figma icon sizes: next to a label, and in an icon-only button.
const iconSizes = {
  sm: { label: 12, only: 16 },
  md: { label: 16, only: 20 },
  lg: { label: 20, only: 24 },
} as const

/**
 * The Figma Button set: every variant and size, with an icon and a label,
 * a label only, and an icon only (hover a button to see its hover state).
 * Icons from @holakirr/snow-ui-icons set their own size, so they get the
 * Figma sizes through `size`.
 */
export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div
      className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-8 gap-y-4"
      title="Button matrix"
    >
      <span />
      {Object.values(SIZES).map((size) => (
        <Typography key={size} size={12} className="text-secondary">
          {size}
        </Typography>
      ))}
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Fragment key={variant}>
          <Typography size={12} className="text-secondary">
            {variant}
          </Typography>
          {Object.values(SIZES).map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Button
                variant={variant}
                size={size}
                label="Button"
                startContent={<StarIcon size={iconSizes[size].label} />}
                endContent={<StarIcon size={iconSizes[size].label} />}
              />
              <Button variant={variant} size={size} label="Button" />
              <Button
                variant={variant}
                size={size}
                label=""
                title="Icon button"
                startContent={<StarIcon size={iconSizes[size].only} />}
              />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  ),
}

export const WithChildren: Story = {
  args: {
    children: <p>with-children</p>,
  },
}

/**
 * `asChild` renders the child element (here an `<a>`; a router link works the
 * same) with the button's styles, props and content: the label and the
 * start / end content go inside it, around its own children.
 */
export const AsLink: Story = {
  args: {
    asChild: true,
    // biome-ignore lint/a11y/useAnchorContent: the Button renders its label inside
    children: <a href="https://holakirr.com" />,
  },
}

/**
 * The child's classes merge with the button's (the child's win conflicts),
 * and the event handlers compose: the child's runs, then the button's.
 */
export const AsChildComposition: Story = {
  args: { onClick: fn() },
  render: (args) => (
    <Button {...args} asChild variant="outline" label="Docs">
      <button
        type="button"
        className="px-8"
        data-clicks="0"
        onClick={(event) => {
          const target = event.currentTarget
          target.dataset.clicks = String(Number(target.dataset.clicks) + 1)
        }}
      />
    </Button>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Docs' })
    await expect(button).toHaveClass('px-8')
    await expect(button).not.toHaveClass('px-3')
    await expect(button).toHaveClass('inset-ring-black-10')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('data-clicks', '1')
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const WithStartContent: Story = {
  args: {
    startContent: leftIcon,
  },
}

export const WithEndContent: Story = {
  args: {
    endContent: rightIcon,
  },
}

export const WithStartAndEndContent: Story = {
  args: {
    startContent: leftIcon,
    endContent: rightIcon,
  },
}

export const IconButton: Story = {
  args: {
    startContent: leftIcon,
    label: '',
    title: 'Icon Button',
  },
}

/**
 * Right-to-left text (`dir="rtl"` on `<html>` and `SnowUIProvider`):
 * `startContent` is on the right. Directional icons are yours to mirror,
 * e.g. with `rtl:-scale-x-100` (the library's own arrows do it).
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex items-center gap-4">
      <Button
        variant="filled"
        size="md"
        label="التالي"
        startContent={<StarIcon size={16} />}
        endContent={
          <ArrowLineRightIcon size={16} className="rtl:-scale-x-100" />
        }
      />
      <Button variant="outline" size="md" label="حفظ" />
      <Button
        variant="gray"
        size="md"
        title="المفضلة"
        startContent={<StarIcon size={20} />}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'التالي' })
    const [star, arrow] = Array.from(button.querySelectorAll('svg'))
    // The start content is on the right.
    await expect(star.getBoundingClientRect().left).toBeGreaterThan(
      arrow.getBoundingClientRect().left,
    )
    // …and the arrow is mirrored.
    await expect(getComputedStyle(arrow).scale).not.toBe('none')
  },
}

/**
 * Bare icon buttons 2px apart: each has a 24px hit area (`hit-area`), but a
 * neighbour's hit area never covers a button's own box, so a click on its
 * visible edge is that button's, and only the empty space around it is
 * added.
 */
export const BareHitAreas: Story = {
  // A behaviour check: the same look as Bare.
  tags: ['skip-visual'],
  parameters: {
    targetSize: {
      exceptions: [
        {
          selector: 'button',
          reason:
            'Deliberately 2px apart to test the overlap: too close for WCAG 2.5.8, keep 24px between the centres of bare controls.',
        },
      ],
    },
  },
  render: () => (
    <div className="flex gap-0.5">
      <Button
        variant="bare"
        aria-label="Star"
        startContent={<StarIcon size={16} />}
      />
      <Button
        variant="bare"
        aria-label="Next"
        startContent={<ArrowLineRightIcon size={16} />}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const document = canvasElement.ownerDocument
    const star = canvas.getByRole('button', { name: 'Star' })
    const next = canvas.getByRole('button', { name: 'Next' })
    const hit = (x: number, y: number) =>
      document.elementFromPoint(x, y)?.closest('button')
    const a = star.getBoundingClientRect()
    const b = next.getBoundingClientRect()
    const y = a.top + a.height / 2
    // The visible edges belong to their own buttons, the earlier one's
    // too (the later one's hit area used to cover it)…
    await expect(hit(a.right - 1, y)).toBe(star)
    await expect(hit(b.left + 1, y)).toBe(next)
    // …the gap between them is shared (the later one gets it)…
    await expect(hit(a.right + 1, y)).toBe(next)
    // …and the empty space around a button is its hit area.
    await expect(hit(a.left - 3, y)).toBe(star)
    await expect(hit(b.right + 3, y)).toBe(next)
    await expect(hit(a.left + a.width / 2, a.top - 3)).toBe(star)
  },
}
