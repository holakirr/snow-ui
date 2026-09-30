import type { FC } from 'react'
import { twMerge } from './tw-merge'

/** The diameters of the mark (px). */
export type RadioMarkSize = 8 | 10 | 12 | 16 | 20

/** The component a mark is on: its root is the `group/card` or `group/image`. */
export type RadioMarkHost = 'card' | 'image'

const hostHoverClasses: { [K in RadioMarkHost]: string } = {
  card: 'group-hover/card:inset-ring-control-border-strong',
  image: 'group-hover/image:inset-ring-control-border-strong',
}

/* The ring of the selected mark, about 30% of the diameter (Figma 6 of 20). */
const sizeClasses: { [K in RadioMarkSize]: { box: string; ring: string } } = {
  8: { box: 'size-2', ring: 'inset-ring-[2.5px]' },
  10: { box: 'size-2.5', ring: 'inset-ring-[3px]' },
  12: { box: 'size-3', ring: 'inset-ring-[3.5px]' },
  16: { box: 'size-4', ring: 'inset-ring-[5px]' },
  20: { box: 'size-5', ring: 'inset-ring-[6px]' },
}

/**
 * The Figma "RadioAlt" (33400:44123): the selection mark of a selectable
 * Card or Image. Not selected, a Background/3 disc with the control border
 * (the hover border while its host, the `group/card` or `group/image`, is
 * hovered: a named group, so an outer `group`, such as the Sidebar's, doesn't
 * reach it); selected, a thick Primary ring. Decorative: the element it
 * marks says whether it is selected (`aria-checked`, `aria-pressed`,
 * `aria-selected`). Internal: not exported from the package.
 */
export const RadioMark: FC<{
  /** The named group of the component it marks. */
  host: RadioMarkHost
  checked?: boolean
  size?: RadioMarkSize
  className?: string
}> = ({ host, checked = false, size = 20, className }) => (
  <span
    aria-hidden
    data-slot="radio-mark"
    data-state={checked ? 'checked' : 'unchecked'}
    className={twMerge(
      'pointer-events-none block shrink-0 rounded-full bg-background-3 transition-shadow',
      sizeClasses[size].box,
      checked
        ? [sizeClasses[size].ring, 'inset-ring-primary']
        : ['inset-ring inset-ring-control-border', hostHoverClasses[host]],
      className,
    )}
  />
)
