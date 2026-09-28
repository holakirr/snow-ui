import type { ComponentProps } from 'react'
import { ROLES, TEXT_SIZES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
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
      // Figma "Badge": Secondary/Indigo, a 6px dot or an 18px pill with a white number.
      'z-10 block rounded-80 bg-indigo text-center transition-all',
      content ? 'min-w-4.5 px-1.5 py-px text-static-white' : 'size-1.5',
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

export { Badge, type BadgeProps }
