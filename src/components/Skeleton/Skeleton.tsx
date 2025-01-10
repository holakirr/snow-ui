import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES } from '../../constants'

type SkeletonProps = ComponentProps<'div'>

const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    role={ROLES.progressbar}
    aria-busy="true"
    aria-label="Loading content..."
    className={twMerge(
      'animate-pulse rounded-md bg-linear-to-t from-white to-black/10',
      className,
    )}
    {...props}
  />
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
