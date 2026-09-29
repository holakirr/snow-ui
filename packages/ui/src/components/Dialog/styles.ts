/*
 * The look Dialog and AlertDialog share. Internal: not exported from the
 * package.
 */

/** Open and close: the mask and the content scale from their centre and fade. */
export const dialogMotionClasses =
  'data-[state=open]:scale-100 starting:data-[state=open]:scale-0 data-[state=closed]:scale-0 starting:data-[state=closed]:scale-100 data-[state=closed]:opacity-0 starting:data-[state=closed]:opacity-100 data-[state=open]:opacity-100 starting:data-[state=open]:opacity-0'

/**
 * Figma "Mask": a linear gradient (#CBDDFF 50% → #D7D0FF 20%) and
 * "Background blur 40". The Figma dark dashboards use the same raw colours
 * ("Add data", SnowUI-Dark), so the mask doesn't flip.
 */
export const dialogOverlayClasses =
  'fixed inset-0 z-50 bg-linear-to-t from-[#cbddff]/50 to-[#d7d0ff]/20 data-[state=open]:backdrop-blur-bg-40 starting:data-[state=open]:backdrop-blur-none data-[state=closed]:backdrop-blur-none starting:data-[state=closed]:backdrop-blur-bg-40'

/** Centred in the viewport, 16px from each side on narrow screens. */
export const dialogPositionClasses =
  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 duration-200'

/** Figma "Popup": Background/3 with "Background blur 40" and radius 32. */
export const dialogPopupClasses =
  'rounded-32 bg-background-3 backdrop-blur-bg-40'
