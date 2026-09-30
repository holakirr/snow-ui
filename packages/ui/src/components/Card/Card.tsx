import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { RadioMark } from '../../utils/radio-mark'
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
    /**
     * Shows the Figma selection mark (the kit's RadioAlt) on the top end
     * corner, as the Hover and Selected cards do: checked when `selected`,
     * and, when not selected, only while the card is hovered or has the
     * keyboard focus. Decorative: say what is selected with `aria-checked`
     * (a `role="radio"` card) or a control inside.
     * @default false
     */
    marker?: boolean
  }

const Card: FC<CardProps> = ({
  variant,
  interactive,
  bordered,
  selected,
  marker = false,
  className,
  children,
  ...props
}) => {
  const block = variant === 'block'

  return (
    <div
      data-state={selected ? 'selected' : undefined}
      className={twMerge(
        cardStyles({ variant, interactive, bordered, selected }),
        // The mark sits in the padding's corner: keep the content clear of
        // it (the padding plus the 20px mark and a 4px gap).
        // A named group, so an outer `group` (the Sidebar's) doesn't show
        // the mark.
        marker && ['group/card relative', block ? 'pe-12' : 'pe-10'],
        className,
      )}
      {...props}
    >
      {children}
      {marker && (
        <RadioMark
          host="card"
          checked={Boolean(selected)}
          className={twMerge(
            'absolute transition-opacity motion-reduce:transition-none',
            block ? 'top-6 end-6' : 'top-3 end-4',
            // Figma: no mark on the Default and Static cards, an empty one
            // on Hover.
            !selected &&
              'opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 group-has-focus-visible/card:opacity-100',
          )}
        />
      )}
    </div>
  )
}
Card.displayName = 'Card'

export { Card, type CardProps }
