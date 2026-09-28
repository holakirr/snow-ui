'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type SeparatorProps = SeparatorPrimitive.SeparatorProps

const Separator: FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={twMerge(
      'shrink-0 bg-black rounded-full',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator, type SeparatorProps }
