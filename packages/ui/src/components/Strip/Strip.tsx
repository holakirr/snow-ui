import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

/**
 * Thickness of the strip segments (px). Figma's Strip is 2; its examples use
 * 4, 6 and 8.
 */
export type StripThickness = 2 | 4 | 6 | 8

const thicknessClasses: {
  [K in StripThickness]: { horizontal: string; vertical: string }
} = {
  2: { horizontal: 'h-0.5', vertical: 'w-0.5' },
  4: { horizontal: 'h-1', vertical: 'w-1' },
  6: { horizontal: 'h-1.5', vertical: 'w-1.5' },
  8: { horizontal: 'h-2', vertical: 'w-2' },
}

/**
 * Props for the Strip component.
 */
export type StripProps = Omit<ComponentProps<'div'>, 'children'> & {
  /**
   * The number of segments (Figma `Count`).
   * @default 1
   */
  count?: number

  /**
   * How many segments are filled. Filled segments are Black/100%, the rest
   * Black/10%. Setting it makes the strip a `progressbar` (override with
   * `role="meter"` for e.g. password strength) with `aria-valuenow`; give it
   * an `aria-label`. Without it every segment is filled and the strip is
   * decorative.
   */
  value?: number

  /**
   * Arrange the segments vertically (Figma `Vertical`).
   * @default false
   */
  vertical?: boolean

  /**
   * Segment thickness (px).
   * @default 2
   */
  thickness?: StripThickness

  /**
   * Round the segment ends (the Figma examples use fully rounded segments).
   * @default false
   */
  rounded?: boolean
}

/**
 * Strip draws a row (or column) of equal segments 8px apart — the Figma
 * "Strip": segmented progress bars, password strength, bar charts. Segments
 * have `data-state="filled" | "empty"` for custom colours.
 */
const Strip: FC<StripProps> = ({
  count = 1,
  value,
  vertical = false,
  thickness = 2,
  rounded = false,
  className,
  ...props
}) => {
  const segments = Math.max(1, Math.floor(count))
  const filled =
    value === undefined ? segments : Math.min(segments, Math.max(0, value))
  const isMeter = value !== undefined
  const direction = vertical ? 'vertical' : 'horizontal'

  const a11yProps = isMeter
    ? {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': segments,
        'aria-valuenow': filled,
      }
    : { 'aria-hidden': true }

  return (
    <div
      {...a11yProps}
      data-orientation={direction}
      className={twMerge(
        'flex shrink-0 gap-2',
        vertical ? 'h-[134px] flex-col' : 'w-40 flex-row',
        className,
      )}
      {...props}
    >
      {Array.from({ length: segments }, (_, index) => {
        const isFilled = index < filled
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional and never reorder
            key={index}
            data-state={isFilled ? 'filled' : 'empty'}
            className={twMerge(
              'block flex-1',
              thicknessClasses[thickness][direction],
              isFilled ? 'bg-black' : 'bg-black-10',
              rounded && 'rounded-full',
            )}
          />
        )
      })}
    </div>
  )
}
Strip.displayName = 'Strip'

export { Strip }
