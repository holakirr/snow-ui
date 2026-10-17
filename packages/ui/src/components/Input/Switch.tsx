'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type SwitchProps = ComponentProps<typeof SwitchPrimitives.Root> & {
  /** The source icon frame; 28px is used by the Account Settings status row. */
  size?: 28 | 32
}

/**
 * Figma "Switch": a 28×16 pill track with the Figma inner shadow — Black/20%
 * off (40% on hover), Primary on (under White/40% on hover) — and a 12px
 * white thumb with "Drop shadow 2", inset 2px, that travels 12px. `hit-area`
 * makes the pointer target 28×24 (WCAG 2.5.8).
 *
 * The off track is `control-border` (hover `control-border-strong`): the
 * Figma values, or WCAG AA ones with more contrast (see the tokens). With
 * more contrast the thumb is the per-mode `white` (black on the dark-mode
 * indigo track, where Figma's white thumb is 2.07:1).
 */
const Switch: FC<SwitchProps> = ({ className, size = 32, ...props }) => (
  <SwitchPrimitives.Root
    className={twMerge(
      'peer group relative inline-flex shrink-0 cursor-pointer items-center rounded-80 inset-shadow-inner transition-colors hit-area',
      size === 28
        ? 'mx-[1.75px] my-[7px] h-3.5 w-[24.5px] p-[1.75px]'
        : 'mx-0.5 my-2 h-4 w-7 p-0.5',
      'data-[state=unchecked]:bg-control-border data-[state=checked]:bg-primary',
      'enabled:hover:data-[state=unchecked]:bg-control-border-strong enabled:hover:data-[state=checked]:bg-primary-hover-strong',
      // Invalid (`aria-invalid`): a 1px Secondary/Red stroke, as the kit's
      // Error stroke on text fields.
      'aria-invalid:inset-ring aria-invalid:inset-ring-control-border-invalid',
      'focus-ring',
      // Disabled: a Black/10% track (Black/20% when on) with the white thumb,
      // so it stays visible in both modes. The kit dims the whole switch to
      // 20% with the arrow cursor: planned for 6.0.
      'disabled:cursor-default disabled:data-[state=unchecked]:bg-black-10 disabled:data-[state=checked]:bg-black-20 disabled:inset-shadow-none',
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      data-slot="switch-thumb"
      className={twMerge(
        'pointer-events-none block rounded-full bg-static-white shadow-2 transition-transform data-[state=unchecked]:translate-x-0 motion-reduce:transition-none contrast-more:bg-white',
        size === 28
          ? 'size-[10.5px] data-[state=checked]:translate-x-[10.5px] rtl:data-[state=checked]:-translate-x-[10.5px]'
          : 'size-3 data-[state=checked]:translate-x-3 rtl:data-[state=checked]:-translate-x-3',
      )}
    />
  </SwitchPrimitives.Root>
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, type SwitchProps }
