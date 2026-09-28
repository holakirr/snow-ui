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

type CardProps = ComponentProps<'div'> &
  VariantProps<typeof cardStyles> & {
    /**
     * `default` is the Figma Card component (radius 16, padding 12/16,
     * Surface/1); `block` is the dashboard block (radius 20, padding 24,
     * Background/2).
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
      className,
    )}
    {...props}
  />
)
Card.displayName = 'Card'

export { Card, type CardProps }
