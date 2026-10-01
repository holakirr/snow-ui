'use client'

import type { ComponentProps } from 'react'
import { ROLES, TEXT_SIZES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import { Typography } from '../Text'

/**
 * The colour of a Badge (added in 5.2): the kit's Secondary/Indigo, or its
 * red ("Can change the color and style of the Badge").
 */
export type BadgeColor = 'indigo' | 'red'

/*
 * Figma "Badge": Secondary/Indigo, a 6px dot or an 18px pill. Figma's white
 * number is 2.07:1 on indigo, so it is black (10.15:1). The kit's red badge
 * is white on Secondary/Red, 3.36:1: the number's pill is `red-text`
 * (#D42020; #FF8080 in dark mode) with the per-mode `white`, 5.21:1 and
 * 8.65:1; the dot keeps Secondary/Red (3.36:1 on white, 3.76:1 on #333).
 */
const colorClasses: { [K in BadgeColor]: { dot: string; number: string } } = {
  indigo: { dot: 'bg-indigo', number: 'bg-indigo text-static-black' },
  red: { dot: 'bg-red', number: 'bg-red-text text-white' },
}

/**
 * Props for the BadgeComponent.
 */
export type BadgeComponentProps = ComponentProps<'span'> & {
  /**
   * The text to be displayed inside the badge.
   */
  content?: string
  /**
   * The colour (added in 5.2). `red` is the kit's red badge, with a darker
   * red under the number for its contrast.
   * @default "indigo"
   */
  color?: BadgeColor
}

export const BadgeComponent = ({
  content,
  color = 'indigo',
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
        'z-10 block rounded-80 text-center transition-all',
        content
          ? ['min-w-4.5 px-1.5 py-px', colorClasses[color].number]
          : ['size-1.5', colorClasses[color].dot],
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
  /**
   * The colour of the badge (added in 5.2).
   * @default "indigo"
   */
  color?: BadgeColor
}

/**
 * Badge component displays a badge with a text inside.
 */
const Badge = ({
  content,
  color,
  children,
  className,
  badgeClassName,
  ...props
}: BadgeProps) => (
  <div className={twMerge('relative', className)} {...props}>
    {children}
    <BadgeComponent
      content={content}
      color={color}
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
