import type { FC } from 'react'
import { twMerge } from './tw-merge'

/** The source icon frame, including its transparent inset (px). */
export type RadioMarkSize = 12 | 16 | 20 | 24 | 32

/** The component a mark is on: its root is the `group/card` or `group/image`. */
export type RadioMarkHost = 'card' | 'image'

const hostHoverClasses: { [K in RadioMarkHost]: string } = {
  card: 'group-hover/card:inset-ring-control-border-strong',
  image: 'group-hover/image:inset-ring-control-border-strong',
}

/* A 32px source frame contains a 28px disc, with a 2px or 8px inset ring. */
const sizeClasses: {
  [K in RadioMarkSize]: { box: string; ring: string; border: string }
} = {
  12: {
    box: 'size-3',
    ring: 'inset-ring-[3px]',
    border: 'inset-ring-[0.75px]',
  },
  16: { box: 'size-4', ring: 'inset-ring-[4px]', border: 'inset-ring' },
  20: {
    box: 'size-5',
    ring: 'inset-ring-[5px]',
    border: 'inset-ring-[1.25px]',
  },
  24: { box: 'size-6', ring: 'inset-ring-[6px]', border: 'inset-ring-[1.5px]' },
  32: { box: 'size-8', ring: 'inset-ring-[8px]', border: 'inset-ring-2' },
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
}> = ({ host, checked = false, size = 24, className }) => (
  <span
    aria-hidden
    data-slot="radio-mark"
    data-state={checked ? 'checked' : 'unchecked'}
    className={twMerge(
      'pointer-events-none relative block shrink-0',
      sizeClasses[size].box,
      className,
    )}
  >
    <span
      data-slot="radio-mark-disc"
      className={twMerge(
        'absolute inset-[6.25%] rounded-full bg-background-3 transition-shadow',
        checked
          ? [sizeClasses[size].ring, 'inset-ring-primary']
          : [
              sizeClasses[size].border,
              'inset-ring-control-border',
              hostHoverClasses[host],
            ],
      )}
    />
  </span>
)
