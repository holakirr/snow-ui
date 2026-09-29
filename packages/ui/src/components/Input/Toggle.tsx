'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import type { ComponentProps, FC } from 'react'
import type { Size, ToggleVariant } from '../../types'
import { warnIfUnnamedIconOnly } from '../../utils/accessible-name'
import { isIconOnly } from '../../utils/children'
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
  /**
   * Square, with a bigger (16, 20 or 24px) icon. Detected when omitted: the
   * content is a single element without children, such as an icon.
   */
  iconOnly?: boolean | null
}

const itemVariant = {
  borderless: 'solid',
  outline: 'outline',
  pill: 'pill',
} as const

/**
 * Toggle styles: the Figma segmented-control items (see `Tabs`). Off, a
 * toggle is a Borderless button with a `text-secondary` label (Figma: 40%
 * opacity, 2.85:1), black on hover and keyboard focus; on, it is a Gray
 * button, or a white, shadowed one for `pill`. The colour is the
 * `--segment-fg` custom property: a `text-*` className sets it in every
 * state, `[--segment-fg:…]` only the off colour.
 */
const toggleVariants = ({
  variant,
  size,
  iconOnly,
  className,
}: ToggleVariantProps & { className?: string } = {}): string =>
  twMerge(
    segmentedItemVariants({
      variant: itemVariant[variant ?? 'borderless'],
      size: size ?? 'md',
      iconOnly: !!iconOnly,
    }),
    className,
  )

type ToggleProps = ComponentProps<typeof TogglePrimitive.Root> &
  ToggleVariantProps

const Toggle: FC<ToggleProps> = ({
  className,
  variant,
  size,
  iconOnly,
  children,
  ...props
}) => {
  warnIfUnnamedIconOnly(
    'Toggle',
    'toggle',
    { ...props, children },
    { asChild: props.asChild },
  )

  return (
    <TogglePrimitive.Root
      className={toggleVariants({
        variant,
        size,
        iconOnly: iconOnly ?? isIconOnly(children),
        className,
      })}
      {...props}
    >
      {children}
    </TogglePrimitive.Root>
  )
}

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, type ToggleProps, type ToggleVariantProps, toggleVariants }
