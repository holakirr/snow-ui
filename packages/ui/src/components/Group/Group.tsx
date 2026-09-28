import { cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/**
 * Gaps a Group can use (px): the Figma spacing scale up to 16.
 */
export type GroupGap = 0 | 4 | 8 | 12 | 16

const groupStyles = cva('inline-flex items-center rounded-12', {
  variants: {
    vertical: {
      true: 'flex-col',
      false: 'flex-row',
    },
    reverse: {
      true: '',
      false: '',
    },
    gap: {
      0: 'gap-0',
      4: 'gap-1',
      8: 'gap-2',
      12: 'gap-3',
      16: 'gap-4',
    },
  },
  compoundVariants: [
    { vertical: false, reverse: true, className: 'flex-row-reverse' },
    { vertical: true, reverse: true, className: 'flex-col-reverse' },
  ],
  defaultVariants: {
    vertical: false,
    reverse: false,
    gap: 8,
  },
})

/**
 * Props for the Group component.
 */
export type GroupProps = ComponentProps<'div'> & {
  /**
   * Stack the items vertically (Figma `Vertical`).
   * @default false
   */
  vertical?: boolean

  /**
   * Reverse the visual order of the items (Figma `Reverse`); in a row the
   * items are packed to the right.
   * @default false
   */
  reverse?: boolean

  /**
   * The gap between the items (px).
   * @default 8
   */
  gap?: GroupGap
}

/**
 * Group lays out any items — icon buttons in a toolbar, IconText rows, tags —
 * in a row or a column with the Figma gap (8) — the Figma "Group". It has
 * `role="group"`; give it an `aria-label` when the group needs a name.
 */
const Group: FC<GroupProps> = ({
  vertical = false,
  reverse = false,
  gap = 8,
  className,
  ...props
}) => (
  // biome-ignore lint/a11y/useSemanticElements: a layout group, not a form <fieldset>
  <div
    role="group"
    className={twMerge(groupStyles({ vertical, reverse, gap }), className)}
    {...props}
  />
)
Group.displayName = 'Group'

export { Group, groupStyles }
