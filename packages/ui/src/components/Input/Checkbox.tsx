'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>

/**
 * Figma "Checkbox" (Select True / False / Multiple × State Default / Hover):
 * a 28px box with an 8px radius.
 * - Unchecked: Background/3 with a 2px Black/20% ring; on hover a Black/40%
 *   ring (the `control-border*` tokens: WCAG AA values
 *   with more contrast).
 * - Checked and indeterminate ("Multiple"): Primary with the Figma inner
 *   shadow and a white mark (black in dark mode); on hover Primary under
 *   White/40%.
 */
const Checkbox: FC<CheckboxProps> = ({ className, ...props }) => (
  <CheckboxPrimitive.Root
    className={twMerge(
      // The mark is white on the black Primary and black on the dark-mode
      // indigo Primary (Figma's white mark is 2.07:1 there).
      'peer group m-0.5 size-7 shrink-0 cursor-pointer rounded-8 bg-background-3 text-white inset-ring-2 inset-ring-control-border transition-all',
      'enabled:hover:inset-ring-control-border-strong',
      'data-[state=checked]:bg-primary data-[state=checked]:inset-ring-0 data-[state=checked]:inset-shadow-inner data-[state=checked]:enabled:hover:bg-primary-hover-strong',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:inset-ring-0 data-[state=indeterminate]:inset-shadow-inner data-[state=indeterminate]:enabled:hover:bg-primary-hover-strong',
      // Invalid (`aria-invalid`): a Secondary/Red ring on the unchecked box,
      // hovered or not, as the kit's Error stroke on text fields.
      'aria-invalid:inset-ring-control-border-invalid enabled:hover:aria-invalid:inset-ring-control-border-invalid',
      'focus-ring',
      // Disabled: a Black/4% box with a Black/10% ring; when checked, a
      // Black/10% fill with a Black/40% mark. Visible in both modes. The kit
      // dims the whole box to 20% (a checked one ≈#CCC, white mark) with the
      // arrow cursor: planned for 6.0.
      'disabled:cursor-default disabled:bg-black-4 disabled:inset-ring-black-10 disabled:text-black-40',
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
          d="M21.301 11.285C21.696 10.899 22.329 10.906 22.715 11.301C23.101 11.696 23.094 12.329 22.699 12.715L14.891 20.35C14.28 20.947 13.294 20.914 12.725 20.277L9.255 16.4C8.887 15.989 8.922 15.357 9.333 14.988C9.745 14.62 10.377 14.655 10.745 15.066L13.866 18.554L21.301 11.285Z"
        />
        <path
          className="hidden group-data-[state=indeterminate]:block"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 15C22.552 15 23 15.448 23 16C23 16.552 22.552 17 22 17H10C9.448 17 9 16.552 9 16C9 15.448 9.448 15 10 15H22Z"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, type CheckboxProps }
