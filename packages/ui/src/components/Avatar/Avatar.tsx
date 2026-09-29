'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { SIZES } from '../../constants'
import type { Size } from '../../types'
import { twMerge } from '../../utils/tw-merge'
import { Typography } from '../Text'

const avatarStyles = cva(
  // `@container`: the fallback's initials are sized by the avatar's width.
  '@container brightness-100 hover:brightness-105 rounded-full transition-all overflow-hidden aspect-square flex items-center justify-center',
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
    className={twMerge('aspect-square h-full w-full', className)}
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
      'flex h-full w-full items-center justify-center rounded-full bg-color-2 text-static-black',
      className,
    )}
    {...props}
  >
    {/* The initials grow with the avatar: 37.5% of its width (24px text in
        the 64px `lg` avatar), never below 12px (`sm`, `md` and 24px icon
        slots), on a 16/12 line height like the 12px text style. */}
    <Typography
      size={12}
      className="text-[length:max(0.75rem,37.5cqi)] leading-[1.3333]"
    >
      {children}
    </Typography>
  </AvatarPrimitive.Fallback>
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
