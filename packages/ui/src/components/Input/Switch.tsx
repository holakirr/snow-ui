'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import type { FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/**
 * Figma "Switch": a 28×16 pill track with the Figma inner shadow — Black/20%
 * off (40% on hover), Primary on (under White/40% on hover) — and a 12px
 * white thumb with "Drop shadow 2", inset 2px, that travels 12px.
 */
const Switch: FC<SwitchPrimitives.SwitchProps> = ({ className, ...props }) => (
  <SwitchPrimitives.Root
    className={twMerge(
      'peer group inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-80 p-0.5 inset-shadow-inner transition-colors',
      'data-[state=unchecked]:bg-black-20 data-[state=checked]:bg-primary',
      'enabled:hover:data-[state=unchecked]:bg-black-40 enabled:hover:data-[state=checked]:bg-primary-hover-strong',
      'outline-none focus-visible:ring-4 focus-visible:ring-focus',
      'disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block size-3 rounded-full bg-static-white shadow-2 transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0" />
  </SwitchPrimitives.Root>
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
