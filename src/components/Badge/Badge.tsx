import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES, TEXT_SIZES } from '../../constants'
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
  ...props
}: BadgeComponentProps) => (
  <Typography
    as="span"
    size={TEXT_SIZES[12]}
    role={ROLES.status}
    aria-label={content || 'Notification badge'}
    className={twMerge(
      'bg-purple rounded-full w-[6px] h-[6px] block text-center transition-all z-10',
      content && 'w-auto h-auto text-black-100 px-[6px] py-[1px]',
      className,
    )}
    {...props}
  >
    {content}
  </Typography>
)

/**
 * Props for the Badge component.
 */
type BadgeProps = React.ComponentProps<'div'> & {
  /**
   * The text to be displayed inside the badge.
   */
  content?: string
}

/**
 * Badge component displays a badge with a text inside.
 */
const Badge = ({ content, children, className, ...props }: BadgeProps) => (
  <div className="relative" {...props}>
    {children}
    <BadgeComponent
      content={content}
      className={twMerge(
        'absolute -top-[1px] left-full -translate-x-2',
        content && '-top-[6px] -translate-x-1/2',
        className,
      )}
    />
  </div>
)

Badge.displayName = 'Badge'
export { Badge }
