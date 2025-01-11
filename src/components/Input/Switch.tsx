'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const Switch: FC<SwitchPrimitives.SwitchProps> = ({ className, ...props }) => (
  <SwitchPrimitives.Root
    className={twMerge(
      'peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-brand data-[state=unchecked]:bg-black/20 inset-10 inset-ring-black',
      'hover:data-[state=unchecked]:bg-black/40 hover:data-[state=checked]:bg-brand/80',
      'focus-visible:outline-none ring-black/20 focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:data-[state=unchecked]:bg-black/10 disabled:data-[state=checked]:bg-black/10',
      className,
    )}
    tabIndex={0}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={twMerge(
        'pointer-events-none block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-1px)] data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
