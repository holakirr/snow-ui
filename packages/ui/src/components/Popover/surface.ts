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

/**
 * A destructive menu item (`variant="destructive"`, added in 5.2): the kit's
 * red "Delete Property" row, its text and icons in `red-text` (#D42020:
 * 5.21:1 on the popover, 4.77:1 highlighted). In dark mode `red-text`
 * (#FF8080) is 4.36:1 on the popover and 3.22:1 on its White/10% highlight,
 * so there it is mixed with 40% white (#FFB3B3): 6.21:1 and 4.59:1 (WCAG
 * 1.4.3). A disabled one is dimmed like the others.
 */
export const popoverItemDestructiveClasses =
  'text-red-text dark:text-[color:color-mix(in_srgb,var(--color-red-text),var(--color-black)_40%)]'

/**
 * A menu switch item (`DropdownMenuSwitchItem`, `ContextMenuSwitchItem`,
 * added in 5.2): a checkbox item that ends in the kit's Switch instead of a
 * check (the "Wrap Column" row). The item names the group its switch reads
 * the state from.
 */
export const popoverSwitchItemClasses = 'group/switch-item'

/**
 * The switch at the end of a menu switch item: the Figma Switch (a 28×16
 * pill with the inner shadow, `control-border` off, `primary` on; a 12px
 * thumb inset 2px that travels 12px), drawn from the item's `data-state`.
 * It is a picture of the item's state (`aria-hidden`), not a control: the
 * item is the `menuitemcheckbox`. The row's highlight shows hover and focus,
 * so the track keeps its colour. Disabled: a Black/10% track (Black/20% on)
 * without the shadow, as Switch.
 */
export const popoverSwitchTrackClasses =
  'pointer-events-none ms-auto inline-flex h-4 w-7 shrink-0 items-center rounded-80 bg-control-border p-0.5 inset-shadow-inner transition-colors group-data-[state=checked]/switch-item:bg-primary group-data-[disabled]/switch-item:bg-black-10 group-data-[disabled]/switch-item:inset-shadow-none group-data-[disabled]/switch-item:group-data-[state=checked]/switch-item:bg-black-20'

/**
 * The thumb of a menu switch item's switch: Switch's thumb (static white,
 * "Drop shadow 2"; the per-mode `white` with more contrast), at the end when
 * checked (the start in right-to-left text).
 */
export const popoverSwitchThumbClasses =
  'block size-3 rounded-full bg-static-white shadow-2 transition-transform group-data-[state=checked]/switch-item:translate-x-3 rtl:group-data-[state=checked]/switch-item:-translate-x-3 motion-reduce:transition-none contrast-more:bg-white'

/**
 * A group title in a popover: the kit's SearchPopup group title (a Text,
 * 4/8 padding, 28px high) in 14/20 `text-secondary` (Figma: Black/40%).
 */
export const popoverLabelClasses = 'px-2 py-1 text-14 text-secondary'

/**
 * A divider in a popover: the kit's item group has 8px of padding above and
 * below and a 1px Black/4% stroke inside its bottom edge, so 16px between
 * the items of two groups, the line 7px under the upper one. A
 * `DropdownMenuGroup`'s 4px margins merge into these. Black/4% is faint
 * (1.09:1): `black-20` with more contrast, and the system GrayText with
 * forced colours, where a fill would be dropped.
 */
export const popoverSeparatorClasses =
  'mt-[7px] mb-2 h-px bg-black-4 contrast-more:bg-black-20 forced-colors:forced-color-adjust-none forced-colors:bg-[GrayText]'

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
 * in Black/20%, which is 1.6:1, so `text-secondary` as the Select chevron
 * (Black/60% light, White/70% dark: 3:1 or more in both themes, WCAG
 * 1.4.11). Dimmed with a disabled item; points left in RTL.
 */
export const popoverChevronClasses =
  'ms-auto text-secondary rtl:-scale-x-100 in-data-[disabled]:text-black-20'

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
