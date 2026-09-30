import type { ComponentProps, FC } from 'react'
import { SlotHost } from '../../utils/slot-host'
import { twMerge } from '../../utils/tw-merge'

/**
 * Props for the TextStrip component.
 */
export type TextStripProps = ComponentProps<'div'> & {
  /**
   * The Figma `Strip=True` look: a Secondary/Indigo pill, to highlight the
   * strip (the current step, the selected plan). Also sets
   * `data-state="on"`.
   * @default false
   */
  strip?: boolean

  /**
   * Render the only child element (a `<button>`, a link, a heading) with the
   * strip's classes instead of a `<div>`. Its own classes win conflicts.
   * @default false
   */
  asChild?: boolean
}

/**
 * TextStrip is a pill-shaped line of text, 160×28 — the Figma "TextStrip":
 * Black/4% with semibold text, or, with `strip`, a Secondary/Indigo pill.
 * It has no role of its own; with `asChild` it styles a button, a link or a
 * heading.
 */
const TextStrip: FC<TextStripProps> = ({
  strip = false,
  className,
  ...props
}) => (
  <SlotHost
    element="div"
    data-state={strip ? 'on' : 'off'}
    className={twMerge(
      // Figma: 160×28, a pill, the text centred (14 on a 28px line) and cut
      // with an ellipsis.
      'block h-7 w-40 truncate rounded-full px-3 text-center text-14 leading-7',
      strip
        ? // Figma: white text on Secondary/Indigo, 2.07:1; static black
          // is 10.15:1 (the Badge does the same). With more contrast a
          // `black-80` ring marks the strip, as the highlight of menus.
          'bg-indigo text-static-black contrast-more:inset-ring-2 contrast-more:inset-ring-black-80'
        : // Black/4% is 1.1:1: with more contrast the pill gets the
          // control border.
          'bg-black-4 font-semibold text-black contrast-more:inset-ring contrast-more:inset-ring-control-border',
      className,
    )}
    {...props}
  />
)
TextStrip.displayName = 'TextStrip'

export { TextStrip }
