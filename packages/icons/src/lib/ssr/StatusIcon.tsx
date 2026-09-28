import { CheckCircle, Warning } from '@phosphor-icons/react/dist/ssr'

import { STATUSES } from '../constants'
import type { CustomIconProps, Status } from '../types'
import { LoadingAIcon } from './LoadingA'

type StatusIconProps = CustomIconProps & {
  status: Status
  className?: string
}

/**
 * Status colours of the SnowUI Figma Toast: Secondary/Green for success and
 * Secondary/Yellow for failure. They read the `@holakirr/snow-ui` colour
 * tokens when its CSS is loaded and fall back to the Figma values otherwise.
 * A `color` prop still wins, since it sets the icon's `fill`.
 *
 * The colours are light: they are meant for dark surfaces like the toast
 * (5:1 or more there) and don't reach 3:1 on white.
 */
const STATUS_COLORS = {
  [STATUSES.success]: 'var(--color-green, #71dd8c)',
  [STATUSES.error]: 'var(--color-yellow, #fc0)',
} as const

const StatusIcon = ({
  status,
  className,
  style,
  ...props
}: StatusIconProps) => {
  const alt = `Icon for status ${status}`
  switch (status) {
    case STATUSES.progress:
      return (
        <LoadingAIcon
          alt={alt}
          className={className}
          style={style}
          {...props}
        />
      )
    case STATUSES.error:
      return (
        <Warning
          alt={alt}
          weight="fill"
          className={className}
          style={{ color: STATUS_COLORS.error, ...style }}
          role="img"
          {...props}
        />
      )
    case STATUSES.success:
      return (
        <CheckCircle
          alt={alt}
          weight="fill"
          className={className}
          style={{ color: STATUS_COLORS.success, ...style }}
          role="img"
          {...props}
        />
      )
    default:
      return null
  }
}

export { StatusIcon }
