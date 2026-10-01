// The kit's status glyphs at the end of a text field. No 'use client': a
// plain SVG, usable from server components too.
import type { FC } from 'react'

/*
 * The "regular" weight of Phosphor's Check (MIT), the kit's icon set: the
 * Done icon of the kit's Component state. Only this weight is inlined, as
 * in Alert and the Input's Warning: importing the icon would ship all six
 * weights.
 */
const checkPath =
  'M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'

type GlyphProps = { className?: string }

/** The kit's Done icon: Phosphor `Check`, regular, in the current colour. */
export const CheckGlyph: FC<GlyphProps> = ({ className }) => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d={checkPath} />
  </svg>
)
