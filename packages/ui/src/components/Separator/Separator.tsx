'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root> & {
  /**
   * Draws the 0.5px hairline that the Figma dashboards use for dividers. It is
   * a 1px line scaled by half, so it stays visible on 1x screens (as a lighter
   * 1px line) and is one device pixel thick on 2x screens.
   * @default false
   */
  hairline?: boolean
}

const Separator: FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  hairline = false,
  ...props
}) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={twMerge(
      // Figma dividers: a Black/10% stroke.
      'shrink-0 bg-black-10 rounded-full',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      hairline && (orientation === 'horizontal' ? 'scale-y-50' : 'scale-x-50'),
      className,
    )}
    {...props}
  />
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator, type SeparatorProps }
