// The kit's status glyphs at the end of a text field. No 'use client':
// Textarea, a server component without a counter, renders them on the
// server.
import type { FC } from 'react'

/*
 * The "regular" weight of Phosphor's Warning and Check (MIT), the kit's icon
 * set: the Error and Done icons of the kit's Component state. Only this
 * weight is inlined, as in Alert: importing the icons would ship all six
 * weights of each.
 */
const warningPath =
  'M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z'

const checkPath =
  'M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'

type GlyphProps = { className?: string }

/** The kit's Error icon: Phosphor `Warning`, regular, in the current colour. */
export const WarningGlyph: FC<GlyphProps> = ({ className }) => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d={warningPath} />
  </svg>
)

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

/**
 * The kit's Error icon of a Textarea with `showErrorIcon`, after the
 * textarea (a `peer`), while it is invalid: the 16px Warning at the end of
 * the first row (16px from the end, 14px from the top: centred on the
 * first 20px line), in the stroke's colour.
 */
export const TextareaErrorIcon: FC = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute end-4 top-3.5 hidden text-control-border-invalid peer-aria-invalid:block [&>svg]:size-4"
    data-slot="textarea-error-icon"
    data-error-icon=""
  >
    <WarningGlyph />
  </span>
)
