import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface StoryWrapperProps extends HTMLAttributes<HTMLDivElement> {}

export const StoryWrapper = ({ className, ...props }: StoryWrapperProps) => (
  <div
    className={twMerge(
      'rounded-[1.25rem] bg-bg1 p-5 border-2 border-[#9747FF] border-dashed text-black/40',
      className,
    )}
    {...props}
  />
)
