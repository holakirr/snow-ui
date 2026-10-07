import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps, FC, ReactNode } from 'react'
import { slotted } from '../../utils/slot'
import { twMerge } from '../../utils/tw-merge'

/** The Figma Chip `Color`: a Secondary colour, or grey. */
export type ChipColor =
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'grey'

/*
 * Per colour: the dot (the Figma Secondary colour), the text and the tint.
 * The Secondary colours are 1.5–2.4:1 as text on white, so the text mixes
 * the colour with 45% of `black` (white in dark mode): at least 4.63:1 on
 * the tint over `background-2`, 5.66:1 in dark mode. The tint is the colour
 * at 10% (Black/4% for grey), measured on the kit's components overview.
 * All three are custom properties: `[--chip-color:…]` sets the text,
 * `[--chip-dot:…]` the dot and `[--chip-fill:…]` the tint.
 */
const colorClasses: { [K in ChipColor]: string } = {
  purple:
    '[--chip-dot:var(--color-purple)] [--chip-color:color-mix(in_srgb,var(--color-purple),var(--color-black)_45%)] [--chip-fill:color-mix(in_srgb,var(--color-purple)_10%,transparent)]',
  indigo:
    '[--chip-dot:var(--color-indigo)] [--chip-color:color-mix(in_srgb,var(--color-indigo),var(--color-black)_45%)] [--chip-fill:color-mix(in_srgb,var(--color-indigo)_10%,transparent)]',
  blue: '[--chip-dot:var(--color-blue)] [--chip-color:color-mix(in_srgb,var(--color-blue),var(--color-black)_45%)] [--chip-fill:color-mix(in_srgb,var(--color-blue)_10%,transparent)]',
  green:
    '[--chip-dot:var(--color-green)] [--chip-color:color-mix(in_srgb,var(--color-green),var(--color-black)_45%)] [--chip-fill:color-mix(in_srgb,var(--color-green)_10%,transparent)]',
  orange:
    '[--chip-dot:var(--color-orange)] [--chip-color:color-mix(in_srgb,var(--color-orange),var(--color-black)_45%)] [--chip-fill:color-mix(in_srgb,var(--color-orange)_10%,transparent)]',
  red: '[--chip-dot:var(--color-red)] [--chip-color:color-mix(in_srgb,var(--color-red),var(--color-black)_45%)] [--chip-fill:color-mix(in_srgb,var(--color-red)_10%,transparent)]',
  // Figma Grey: Black/40% (2.85:1 as text), so the text is `text-secondary`.
  grey: '[--chip-dot:var(--color-black-40)] [--chip-color:var(--color-text-secondary)] [--chip-fill:var(--color-black-4)]',
}

/**
 * Props for the Chip component.
 */
export type ChipProps = ComponentProps<'span'> & {
  /**
   * The colour (Figma `Color`).
   * @default "purple"
   */
  color?: ChipColor

  /**
   * The Figma `Big` chip: 14/20 text instead of 12/16.
   * @default false
   */
  big?: boolean

  /**
   * The Figma `Background`: a tinted chip. Without it, a coloured dot and
   * coloured text.
   * @default true
   */
  background?: boolean

  /**
   * Render the only child element (a `<button>`, a link) with the chip's
   * classes instead of a `<span>`: its own classes win conflicts, and the
   * dot goes before its children.
   * @default false
   */
  asChild?: boolean
}

/**
 * Chip is a short coloured label, such as a status in a table cell — the
 * Figma "Chip": a tinted chip (`background`), or a dot and coloured text.
 * It has no role of its own: the text is the information.
 */
const Chip: FC<ChipProps> = ({
  color = 'purple',
  big = false,
  background = true,
  asChild = false,
  className,
  children,
  ...props
}) => {
  const classes = twMerge(
    'inline-flex w-fit shrink-0 items-center whitespace-nowrap font-normal text-(--chip-color)',
    big ? 'text-14' : 'text-12',
    background
      ? // Figma: H 20, padding 8/2, radius 4; Big: a pill, H 28, padding
        // 12/4, radius 80, 14/20 text.
        [
          'bg-(--chip-fill)',
          big ? 'rounded-80 px-3 py-1' : 'rounded-4 px-2 py-0.5',
        ]
      : // Figma: H 16, no padding; the dot in a 12px (Big: 16px) box.
        undefined,
    colorClasses[color],
    className,
  )

  const renderContent = (content: ReactNode) => (
    <>
      {!background && (
        <span
          aria-hidden
          data-slot="chip-dot"
          className={twMerge(
            'flex shrink-0 items-center justify-center',
            big ? 'size-4' : 'size-3',
          )}
        >
          {/* The Figma Dot icon: filled (4.5px), a 7px ring when Big. */}
          <span
            className={
              big
                ? 'size-[7px] rounded-full border-[1.5px] border-(--chip-dot)'
                : 'size-[4.5px] rounded-full bg-(--chip-dot)'
            }
          />
        </span>
      )}
      {content}
    </>
  )

  if (asChild) {
    const slot = slotted(children, classes, renderContent)
    return (
      <Slot data-color={color} {...props} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  return (
    <span data-color={color} className={classes} {...props}>
      {renderContent(children)}
    </span>
  )
}
Chip.displayName = 'Chip'

export { Chip }
