'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import type { FC } from 'react'
import type { Size, ToggleVariant } from '../../types'
import { twMerge } from '../../utils/tw-merge'
import { segmentedItemVariants } from '../Tabs/segmented'

type ToggleVariantProps = {
  /**
   * `borderless` (default) and `outline` toggles turn into a Gray button when
   * on; `pill` toggles turn white with a shadow (use them in a
   * `ToggleGroup variant="pill"`).
   * @default "borderless"
   */
  variant?: ToggleVariant | null
  /**
   * The Figma Button size.
   * @default "md"
   */
  size?: Size | null
}

const itemVariant = {
  borderless: 'solid',
  outline: 'outline',
  pill: 'pill',
} as const

// Icon-only toggles are square, with a 16, 20 or 24px glyph.
const iconOnlyClasses: { [K in Size]: string } = {
  sm: 'has-[>svg:only-child]:p-1 has-[>svg:only-child]:[&_svg]:size-4',
  md: 'has-[>svg:only-child]:p-2 has-[>svg:only-child]:[&_svg]:size-5',
  lg: 'has-[>svg:only-child]:p-3 has-[>svg:only-child]:[&_svg]:size-6',
}

/**
 * Toggle styles: the Figma segmented-control items (see `Tabs`). Off, a
 * toggle is a Borderless button at 40% opacity (100% on hover); on, it is a
 * Gray button, or a white, shadowed one for `pill`.
 */
const toggleVariants = ({
  variant,
  size,
  className,
}: ToggleVariantProps & { className?: string } = {}): string => {
  const toggleSize = size ?? 'md'

  return twMerge(
    segmentedItemVariants({
      variant: itemVariant[variant ?? 'borderless'],
      size: toggleSize,
    }),
    iconOnlyClasses[toggleSize],
    className,
  )
}

type ToggleProps = TogglePrimitive.ToggleProps & ToggleVariantProps

const Toggle: FC<ToggleProps> = ({ className, variant, size, ...props }) => (
  <TogglePrimitive.Root
    className={toggleVariants({ variant, size, className })}
    {...props}
  />
)

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, type ToggleProps, type ToggleVariantProps, toggleVariants }
