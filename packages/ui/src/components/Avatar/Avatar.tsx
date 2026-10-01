'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { SIZES } from '../../constants'
import type { Size } from '../../types'
import { twMerge } from '../../utils/tw-merge'
import { Typography } from '../Text'

/*
 * Hover (Figma Component state), only for an avatar in a link or a button,
 * by kind; the avatar at rest doesn't change:
 * - a photo zooms in: the kit draws the picture 27px in the 24px circle
 *   (x1.125), clipped by the round avatar, with the background unchanged;
 * - the icon fallback (an `<svg>` child) a Black/20% fill, as a static gray
 *   like the fallback's `color-2`, so its black icon reads in both themes;
 * - the initials grow from 12 Regular to 14 Semibold (in proportion in the
 *   bigger avatars) on a lighter fill: White/40% layered over `color-2` (or
 *   the fill set in `className`).
 * As Tailwind's `hover:`, only where the primary pointer can hover, so a tap
 * on a touch screen doesn't leave it on. The variants are spelt out in each
 * class (Tailwind reads them as written):
 * `[@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]`.
 */
const avatarStyles = cva(
  // `@container`: the fallback's initials are sized by the avatar's width.
  '@container rounded-full transition-colors overflow-hidden aspect-square flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-16 h-16',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
)

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarStyles> & {
    size?: Size
  }

const Avatar: FC<AvatarProps> = ({ className, size = SIZES.lg, ...props }) => (
  <AvatarPrimitive.Root
    className={twMerge(avatarStyles({ size }), className)}
    {...props}
  />
)
Avatar.displayName = AvatarPrimitive.Root.displayName

export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>

const AvatarImage: FC<AvatarImageProps> = ({ className, ...props }) => (
  <AvatarPrimitive.Image
    className={twMerge(
      'aspect-square h-full w-full transition-[scale] motion-reduce:transition-none [@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]:[scale:1.125]',
      className,
    )}
    {...props}
  />
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

export type AvatarFallbackProps = ComponentProps<
  typeof AvatarPrimitive.Fallback
>

const AvatarFallback: FC<AvatarFallbackProps> = ({
  className,
  children,
  ...props
}) => (
  <AvatarPrimitive.Fallback
    className={twMerge(
      // `color-2` doesn't flip in dark mode, so the text stays static black.
      'flex h-full w-full items-center justify-center rounded-full bg-color-2 text-static-black transition-colors',
      '[@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]:has-[svg]:bg-[color-mix(in_srgb,var(--color-static-black)_20%,var(--color-static-white))]',
      // White/40% over the fill, as a layer: a fill set in `className` keeps
      // showing under it. None with forced colours, where the fill is gone.
      '[@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]:not-has-[svg]:[background-image:linear-gradient(var(--avatar-hover-tint),var(--avatar-hover-tint))] [--avatar-hover-tint:color-mix(in_srgb,var(--color-static-white)_40%,transparent)] forced-colors:bg-none',
      className,
    )}
    {...props}
  >
    {/* The initials grow with the avatar: 37.5% of its width (24px text in
        the 64px `lg` avatar), never below 12px (`sm`, `md` and 24px icon
        slots), on a 16/12 line height like the 12px text style. On hover
        they grow by 14/12 (43.75%, never below 14px) on the 20/14 line
        height of the 14px style, and turn semibold. */}
    <Typography
      size={12}
      className="text-[length:max(0.75rem,37.5cqi)] leading-[1.3333] [@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]:text-[length:max(0.875rem,43.75cqi)] [@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]:leading-[1.4286] [@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]:font-semibold"
    >
      {children}
    </Typography>
  </AvatarPrimitive.Fallback>
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
