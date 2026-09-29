import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type SkeletonProps = ComponentProps<'div'>

const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    aria-hidden="true"
    className={twMerge(
      // SnowUI's neutral fill (Black/4%) on the kit's 8px radius. The pulse
      // stops with reduced motion (WCAG 2.3.3); the fill still marks the
      // placeholder.
      'animate-pulse rounded-8 bg-black-4 motion-reduce:animate-none',
      className,
    )}
    {...props}
  />
)
Skeleton.displayName = 'Skeleton'

export { Skeleton, type SkeletonProps }
