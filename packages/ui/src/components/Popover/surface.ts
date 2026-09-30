/**
 * Figma "Popover": the surface shared by PopoverContent, DropdownMenu,
 * ContextMenu and the Select menu — 12px padding, a 16px radius,
 * Background/3, a 1px Surface/1 inside stroke and the "Glass 2" effect
 * (20px background blur and a 0 8 28 shadow).
 */
export const popoverSurfaceClasses =
  'rounded-16 border border-surface-1 bg-background-3 p-3 text-14 text-black shadow-glass-2 backdrop-blur-bg-40'

/**
 * The Figma "Scrollbar" on a popover's scroll area (`scrollbar-snow`: a 4px
 * Black/10% thumb, 8px Black/20% under the pointer, in an 8px gutter at the
 * end of the area while it scrolls). The track starts and ends 12px in, level
 * with the padding, so the 16px corners don't clip the thumb (Chrome, Edge
 * and Safari; Firefox draws its own thin scrollbar). `scrollbar-gutter`
 * stays `auto`: a list that doesn't scroll keeps its padding on both sides.
 */
export const popoverScrollClasses =
  'scrollbar-snow [&::-webkit-scrollbar-track]:my-3'

/**
 * Figma popover items: 36px high (8px padding), a 12px radius, 14/20 text,
 * 16px icons with an 8px gap, and a Black/4% highlight. Disabled items show
 * the not-allowed cursor (Radix ignores their selection). The highlight marks
 * the keyboard focus but is 1.1:1, so with more contrast it gets a 2px
 * `black-80` ring, the colour of `focus-ring` (WCAG 1.4.11).
 */
export const popoverItemClasses =
  'relative flex cursor-pointer select-none items-center gap-2 rounded-12 p-2 text-14 text-black outline-none transition-colors focus:bg-black-4 data-[highlighted]:bg-black-4 data-[state=open]:bg-black-4 data-[disabled]:cursor-not-allowed data-[disabled]:text-black-20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 contrast-more:focus:inset-ring-2 contrast-more:focus:inset-ring-black-80 contrast-more:data-[highlighted]:inset-ring-2 contrast-more:data-[highlighted]:inset-ring-black-80'

/** A group title in a popover: 12/16 `text-secondary` (Figma: Black/40%), 28px high. */
export const popoverLabelClasses = 'px-2 py-1.5 text-12 text-secondary'

/**
 * A divider in a popover: 0.5px Black/10%, 8px from the items on each side
 * (Figma: 8 + 0.5 + 8 between groups). A `DropdownMenuGroup`'s 4px margins
 * merge into these.
 */
export const popoverSeparatorClasses = 'my-2 h-[0.5px] bg-black-10'

/**
 * Pushes a menu shortcut to the end of its item. `KBD` is `dir="ltr"`, so its
 * own `ms-auto` is a left margin, which in a right-to-left menu would keep it
 * next to the label: there the auto margin goes on its right. The menu's
 * `dir` (Radix sets it on the content) decides, not `:dir()`, which CSS
 * minifiers rewrite as a list of `:lang()`s for older browsers.
 */
export const popoverShortcutEndClasses =
  'ms-auto in-[[role=menu][dir=rtl]]:ml-0 in-[[role=menu][dir=rtl]]:mr-auto'

/**
 * A shortcut at the end of a menu item: the Figma kit's plain 12/16 text
 * ("⌘C", Black/40%) in `text-secondary`, with no `KBD` fill, which the menu
 * shortcuts drop unless you pass a `variant`. Dimmed with a disabled item.
 */
export const popoverShortcutClasses =
  'min-w-0 rounded-none bg-transparent px-0 text-secondary in-data-[disabled]:text-black-20'

/**
 * The chevron at the end of a submenu item: the kit's 16px `ArrowLineRight`
 * in Black/20%, which is 1.6:1, so `control-border-strong` as Select's
 * chevron (Black/40%, Black/80% with more contrast). Dimmed with a disabled
 * item; points left in RTL.
 */
export const popoverChevronClasses =
  'ms-auto text-control-border-strong rtl:-scale-x-100 in-data-[disabled]:text-black-20'

/**
 * The value hint of a submenu item, before its chevron: the kit's 12/16
 * text in Black/40%, in `text-secondary`, 8px from the chevron (the item's
 * gap). Dimmed with a disabled item.
 */
export const popoverHintClasses =
  'ms-auto whitespace-nowrap text-12 text-secondary in-data-[disabled]:text-black-20'

/** The popover open/close animations. */
export const popoverAnimationClasses =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:animate-zoom-out-95 data-[state=open]:animate-zoom-in-95 data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom'
