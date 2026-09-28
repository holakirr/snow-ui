'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type CheckboxProps = CheckboxPrimitive.CheckboxProps

/**
 * Figma "Checkbox" (Select True / False / Multiple × State Default / Hover):
 * a 28px box with an 8px radius.
 * - Unchecked: Background/3 with a 2px Black/20% ring; on hover a Black 8%
 *   fill and a Black/40% ring.
 * - Checked and indeterminate ("Multiple"): Primary with the Figma inner
 *   shadow and a white mark (black in dark mode); on hover Primary under
 *   White/40%.
 */
const Checkbox: FC<CheckboxProps> = ({ className, ...props }) => (
  <CheckboxPrimitive.Root
    className={twMerge(
      // The mark is white on the black Primary and black on the dark-mode
      // indigo Primary (Figma's white mark is 2.07:1 there).
      'peer group size-7 shrink-0 cursor-pointer rounded-8 bg-background-3 text-white inset-ring-2 inset-ring-black-20 transition-all',
      'enabled:hover:bg-black/8 enabled:hover:inset-ring-black-40',
      'data-[state=checked]:bg-primary data-[state=checked]:inset-ring-0 data-[state=checked]:inset-shadow-inner data-[state=checked]:enabled:hover:bg-primary-hover-strong',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:inset-ring-0 data-[state=indeterminate]:inset-shadow-inner data-[state=indeterminate]:enabled:hover:bg-primary-hover-strong',
      'focus-ring',
      // Disabled (no Figma state): a Black/4% box with a Black/10% ring; when
      // checked, a Black/10% fill with a Black/40% mark. Visible in both modes.
      'disabled:cursor-not-allowed disabled:bg-black-4 disabled:inset-ring-black-10 disabled:text-black-40',
      'data-[state=checked]:disabled:bg-black-10 data-[state=checked]:disabled:inset-shadow-none data-[state=indeterminate]:disabled:bg-black-10 data-[state=indeterminate]:disabled:inset-shadow-none',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex size-full items-center justify-center">
      {/* The Figma marks, drawn in the 28px box (the component frame is 32px). */}
      <svg
        aria-hidden
        viewBox="2 2 28 28"
        className="size-full fill-current"
        data-slot="checkbox-mark"
      >
        <path
          className="group-data-[state=indeterminate]:hidden"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.0174 12.3978C22.6262 12.9597 22.6641 13.9087 22.1022 14.5174L16.4796 20.6086C15.6733 21.4821 14.2876 21.4637 13.5048 20.5691L10.3712 16.9878C9.82563 16.3643 9.88881 15.4167 10.5123 14.8711C11.1357 14.3256 12.0834 14.3888 12.6289 15.0123L15.0299 17.7562L19.8978 12.4826C20.4597 11.8739 21.4087 11.8359 22.0174 12.3978Z"
        />
        <path
          className="hidden group-data-[state=indeterminate]:block"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.5 16C9.5 15.1716 10.1716 14.5 11 14.5H21C21.8284 14.5 22.5 15.1716 22.5 16C22.5 16.8284 21.8284 17.5 21 17.5H11C10.1716 17.5 9.5 16.8284 9.5 16Z"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, type CheckboxProps }
