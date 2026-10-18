/*
 * The look Dialog and AlertDialog share. Internal: not exported from the
 * package.
 */

/**
 * The panel gently scales and fades; the full-screen mask only fades.
 * CSS exit animations keep Radix Presence mounted until they finish.
 */
export const dialogMotionClasses =
  'data-[state=open]:animate-zoom-in-95 data-[state=closed]:animate-zoom-out-95'

export const dialogOverlayMotionClasses =
  'data-[state=open]:animate-in data-[state=closed]:animate-out'

/**
 * Figma "Mask": a linear gradient (#CBDDFF 50% → #D7D0FF 20%) and
 * "Background blur 40". The Figma dark dashboards use the same raw colours
 * ("Add data", SnowUI-Dark), so the mask doesn't flip.
 */
export const dialogOverlayClasses =
  'fixed inset-0 z-50 bg-linear-to-t from-[#cbddff]/50 to-[#d7d0ff]/20 backdrop-blur-bg-40'

/** Centred in the viewport, 16px from each side on narrow screens. */
export const dialogPositionClasses =
  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 duration-200'

/** Figma "Popup": Background/3 with "Background blur 40" and radius 32. */
export const dialogPopupClasses =
  'rounded-32 bg-background-3 backdrop-blur-bg-40'
