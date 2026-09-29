'use client'

import type { ComponentProps } from 'react'
import { ROLES, TEXT_SIZES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import { Typography } from '../Text'

/**
 * Props for the BadgeComponent.
 */
export type BadgeComponentProps = ComponentProps<'span'> & {
  /**
   * The text to be displayed inside the badge.
   */
  content?: string
}

export const BadgeComponent = ({
  content,
  className,
  'aria-label': ariaLabel,
  ...props
}: BadgeComponentProps) => {
  const messages = useMessages()

  return (
    <Typography
      size={TEXT_SIZES[12]}
      role={ROLES.status}
      aria-label={ariaLabel ?? (content || messages.badge.label)}
      className={twMerge(
        // Figma "Badge": Secondary/Indigo, a 6px dot or an 18px pill. Figma's
        // white number is 2.07:1 on indigo, so it is black (10.15:1).
        'z-10 block rounded-80 bg-indigo text-center transition-all',
        content ? 'min-w-4.5 px-1.5 py-px text-static-black' : 'size-1.5',
        className,
      )}
      {...props}
    >
      {content}
    </Typography>
  )
}

/**
 * Props for the Badge component.
 */
type BadgeProps = React.ComponentProps<'div'> & {
  /**
   * The text to be displayed inside the badge.
   */
  content?: string
  /**
   * Classes of the badge itself (the dot or the number). `className` goes
   * on the wrapper, like every other prop.
   */
  badgeClassName?: string
}

/**
 * Badge component displays a badge with a text inside.
 */
const Badge = ({
  content,
  children,
  className,
  badgeClassName,
  ...props
}: BadgeProps) => (
  <div className={twMerge('relative', className)} {...props}>
    {children}
    <BadgeComponent
      content={content}
      // On the top end corner: top right, top left in right-to-left text.
      className={twMerge(
        'absolute -top-[1px] start-full -translate-x-2 rtl:translate-x-2',
        content && '-top-[6px] -translate-x-1/2 rtl:translate-x-1/2',
        badgeClassName,
      )}
    />
  </div>
)

Badge.displayName = 'Badge'

export { Badge, type BadgeProps }
