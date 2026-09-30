'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/** The number of lines of a Separator (Figma Line `Count`). */
export type SeparatorCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/**
 * Figma Line `Layout` Left arrow / Right arrow: an arrowhead at one end.
 * `start` and `end` follow the text direction; `left` and `right` don't.
 */
export type SeparatorArrow = 'start' | 'end' | 'left' | 'right'

type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root> & {
  /**
   * Draws the 0.5px hairline that the Figma dashboards use for dividers. It is
   * a 1px line scaled by half, so it stays visible on 1x screens (as a lighter
   * 1px line) and is one device pixel thick on 2x screens.
   * @default false
   */
  hairline?: boolean

  /**
   * The Figma Line `Count`: 2 to 8 parallel lines (stacked for a horizontal
   * separator, side by side for a vertical one), spread evenly over the
   * kit's span between the outer lines: 8px for 2, 16 for 3, 32 for 4 and 5,
   * 40 for 6 to 8. Like the single line, they are drawn in the text colour:
   * Black/10% unless a `text-*` class sets another (the Figma Line is
   * Black/100%, `text-black`).
   * @default 1
   */
  count?: SeparatorCount

  /**
   * The Figma Line `Layout` Left arrow / Right arrow: an arrowhead at one end
   * of a horizontal separator (a line pointing somewhere). Its colour is the
   * text colour, like `count`'s lines.
   */
  arrow?: SeparatorArrow
}

/**
 * The Figma Line frames of `count` lines: SPACE_BETWEEN, with the outer lines'
 * centres 8 (2 lines), 16 (3), 32 (4, 5) or 40px (6–8) apart. The box is 1px
 * more, for the lines' own thickness. [horizontal height, vertical width]
 */
const countSpans: { [K in Exclude<SeparatorCount, 1>]: [string, string] } = {
  2: ['h-[calc(--spacing(2)+1px)]', 'w-[calc(--spacing(2)+1px)]'],
  3: ['h-[calc(--spacing(4)+1px)]', 'w-[calc(--spacing(4)+1px)]'],
  4: ['h-[calc(--spacing(8)+1px)]', 'w-[calc(--spacing(8)+1px)]'],
  5: ['h-[calc(--spacing(8)+1px)]', 'w-[calc(--spacing(8)+1px)]'],
  6: ['h-[calc(--spacing(10)+1px)]', 'w-[calc(--spacing(10)+1px)]'],
  7: ['h-[calc(--spacing(10)+1px)]', 'w-[calc(--spacing(10)+1px)]'],
  8: ['h-[calc(--spacing(10)+1px)]', 'w-[calc(--spacing(10)+1px)]'],
}

/**
 * Where the arrowhead of `arrow` goes and which way it points (it is drawn
 * pointing right). A flex row runs right to left in right-to-left text, so
 * the physical ends swap their order there.
 */
const arrowClasses: { [K in SeparatorArrow]: string } = {
  // The head points to the end: right, left in right-to-left text.
  end: 'order-last rtl:-scale-x-100',
  start: 'order-first -scale-x-100 rtl:scale-x-100',
  right: 'order-last rtl:order-first',
  left: 'order-first -scale-x-100 rtl:order-last',
}

const Separator: FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  hairline = false,
  count = 1,
  arrow,
  ...props
}) => {
  const horizontal = orientation === 'horizontal'
  // An untyped count (JavaScript, a parsed string) is clamped to 1–8, and
  // anything that isn't a number (NaN) is one line.
  const lines = Math.min(
    8,
    Math.max(1, Math.floor(count) || 1),
  ) as SeparatorCount
  const withArrow = Boolean(arrow) && horizontal

  if (lines === 1 && !withArrow) {
    return (
      <SeparatorPrimitive.Root
        decorative={decorative}
        orientation={orientation}
        className={twMerge(
          // Figma dividers: a Black/10% stroke, drawn in the text colour so
          // a `text-*` class sets it, as for `count` and `arrow` (a `bg-*`
          // class still wins).
          'shrink-0 rounded-full bg-current text-black-10',
          horizontal ? 'h-px w-full' : 'h-full w-px',
          hairline && (horizontal ? 'scale-y-50' : 'scale-x-50'),
          className,
        )}
        {...props}
      />
    )
  }

  const line = twMerge(
    'block shrink-0 rounded-full bg-current',
    horizontal ? 'h-px w-full' : 'h-full w-px',
    hairline && (horizontal ? 'scale-y-50' : 'scale-x-50'),
  )

  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      data-count={lines}
      className={twMerge(
        // The lines take the text colour: Black/10% like a single divider.
        'flex shrink-0 text-black-10',
        withArrow
          ? 'w-full items-center'
          : [
              'justify-between',
              horizontal ? 'w-full flex-col' : 'h-full flex-row',
              // More than one line here: a single one returned above.
              countSpans[lines as Exclude<SeparatorCount, 1>][
                horizontal ? 0 : 1
              ],
            ],
        className,
      )}
      {...props}
    >
      {withArrow ? (
        <>
          <span
            data-slot="separator-line"
            className={twMerge(line, 'w-auto flex-1')}
          />
          {/* The Figma arrow's head: a 1px chevron with round caps, the line
              running on into its tip. */}
          <svg
            aria-hidden
            data-slot="separator-arrow"
            viewBox="0 0 6 8"
            fill="none"
            className={twMerge(
              'h-2 w-1.5 shrink-0',
              arrow && arrowClasses[arrow],
            )}
          >
            <path
              d="M0 4h5M1 1l4 3-4 3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      ) : (
        Array.from({ length: lines }, (_, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: identical, positional lines
            key={index}
            data-slot="separator-line"
            className={line}
          />
        ))
      )}
    </SeparatorPrimitive.Root>
  )
}
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator, type SeparatorProps }
