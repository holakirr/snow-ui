import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type SkeletonProps = ComponentProps<'div'>

const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    aria-hidden="true"
    className={twMerge(
      'animate-pulse rounded-md bg-linear-to-t from-white to-black/10',
      className,
    )}
    {...props}
  />
)
Skeleton.displayName = 'Skeleton'

export { Skeleton, type SkeletonProps }
