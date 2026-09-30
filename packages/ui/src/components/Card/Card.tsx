import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/*
 * Figma strokes are drawn inside the frame, so the hover and selected strokes
 * are inset rings: they don't change the card's size.
 */
const cardStyles = cva('text-black transition-shadow', {
  variants: {
    variant: {
      // Figma "Card": radius 16, padding 12/16, Surface/1.
      default: 'rounded-16 bg-surface-1 px-4 py-3',
      // Figma dashboard "Block": radius 20, padding 24, Background/2.
      block: 'rounded-20 bg-background-2 p-6',
    },
    interactive: {
      // Figma State "Default" → "Hover": a 0.5px Black/40% stroke on hover.
      true: 'cursor-pointer hover:inset-ring-[0.5px] hover:inset-ring-black-40 focus-ring',
      false: '',
    },
    bordered: {
      // The Figma "Hover" stroke as a static border.
      true: 'inset-ring-[0.5px] inset-ring-black-40',
      false: '',
    },
    selected: {
      // Figma State "Selected": a 1px Primary stroke.
      true: 'inset-ring inset-ring-primary hover:inset-ring hover:inset-ring-primary',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    interactive: false,
    bordered: false,
    selected: false,
  },
})

/** The display utilities: a `className` with one sets the card's layout. */
const DISPLAY = new Set([
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'flow-root',
  'contents',
  'table',
  'list-item',
  'hidden',
])

/**
 * Whether `className` sets the display (`flex`, `grid`, `block`…, with any
 * variant such as `md:grid`, or `!` for important).
 */
const setsDisplay = (className?: string) =>
  className
    ?.split(/\s+/)
    .some((token) =>
      DISPLAY.has(
        token.slice(token.lastIndexOf(':') + 1).replace(/^!|!$/g, ''),
      ),
    ) ?? false

type CardProps = ComponentProps<'div'> &
  VariantProps<typeof cardStyles> & {
    /**
     * `default` is the Figma Card component (radius 16, padding 12/16,
     * Surface/1, a vertical stack 4px apart); `block` is the dashboard block
     * (radius 20, padding 24, Background/2), with no layout of its own.
     * @default 'default'
     */
    variant?: 'default' | 'block'
    /**
     * Shows the Figma "Hover" stroke (0.5px Black/40%) on hover and a focus
     * ring. Add `role`/`tabIndex` or render a button inside for keyboard users.
     * @default false
     */
    interactive?: boolean
    /**
     * The Figma "Selected" state: a 1px Primary stroke. Also sets
     * `data-state="selected"`.
     * @default false
     */
    selected?: boolean
    /**
     * Always shows the Figma "Hover" stroke.
     * @default false
     */
    bordered?: boolean
  }

/**
 * A card. The default variant stacks its children like the Figma Card (a
 * vertical auto-layout, 4px apart: `flex flex-col gap-1`), unless your
 * `className` sets a display (`flex`, `grid`, `block`…): then your layout
 * is used as it is, and the stack's gap doesn't apply.
 */
const Card: FC<CardProps> = ({
  variant,
  interactive,
  bordered,
  selected,
  className,
  ...props
}) => (
  <div
    data-state={selected ? 'selected' : undefined}
    className={twMerge(
      cardStyles({ variant, interactive, bordered, selected }),
      // The Figma Card's auto-layout, when you don't lay the card out.
      (variant ?? 'default') === 'default' &&
        !setsDisplay(className) &&
        'flex flex-col gap-1',
      className,
    )}
    {...props}
  />
)
Card.displayName = 'Card'

export { Card, type CardProps }
