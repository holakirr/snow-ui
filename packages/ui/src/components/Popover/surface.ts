/**
 * Figma "Popover": the surface shared by PopoverContent, DropdownMenu,
 * ContextMenu and the Select menu — 12px padding, a 16px radius,
 * Background/3, a 1px Surface/1 inside stroke and the "Glass 2" effect
 * (20px background blur and a 0 8 28 shadow).
 */
export const popoverSurfaceClasses =
  'rounded-16 border border-surface-1 bg-background-3 p-3 text-14 text-black shadow-glass-2 backdrop-blur-bg-40'

/**
 * Figma popover items: 36px high (8px padding), a 12px radius, 14/20 text,
 * 16px icons with an 8px gap, and a Black/4% highlight. Disabled items show
 * the not-allowed cursor (Radix ignores their selection).
 */
export const popoverItemClasses =
  'relative flex cursor-pointer select-none items-center gap-2 rounded-12 p-2 text-14 text-black outline-none transition-colors focus:bg-black-4 data-[highlighted]:bg-black-4 data-[state=open]:bg-black-4 data-[disabled]:cursor-not-allowed data-[disabled]:text-black-20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

/** A group title in a popover: 12/16 `text-secondary` (Figma: Black/40%), 28px high. */
export const popoverLabelClasses = 'px-2 py-1.5 text-12 text-secondary'

/** A divider in a popover: 0.5px Black/10%. */
export const popoverSeparatorClasses = 'my-1 h-[0.5px] bg-black-10'

/** The popover open/close animations. */
export const popoverAnimationClasses =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:animate-zoom-out-95 data-[state=open]:animate-zoom-in-95 data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom'
