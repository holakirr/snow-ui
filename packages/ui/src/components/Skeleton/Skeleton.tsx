import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type SkeletonProps = ComponentProps<'div'>

const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    aria-hidden="true"
    className={twMerge(
      // SnowUI's neutral fill (Black/4%) on the kit's 8px radius.
      'animate-pulse rounded-8 bg-black-4',
      className,
    )}
    {...props}
  />
)
Skeleton.displayName = 'Skeleton'

export { Skeleton, type SkeletonProps }
