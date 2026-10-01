---
"@holakirr/snow-ui": minor
---

New `DropdownMenuSwitchItem` and `ContextMenuSwitchItem`: a checkbox item that ends in the kit's Switch instead of a check (the kit's "Wrap Column" row). The Switch look is drawn from the item's state: a 28×16 track (`control-border` off, `primary` on, Black/10% / Black/20% when disabled) and a 12px thumb that moves to the end (to the left in right-to-left text); in forced-colors mode the track and the thumb are outlined. The item stays a `menuitemcheckbox` with `aria-checked`; the switch is `aria-hidden`, not a control inside the menu item. It takes a checkbox item's props with a boolean `checked` / `onCheckedChange`; `event.preventDefault()` in `onSelect` toggles it without closing the menu. A `DropdownMenuContent` `search` filters it like the other items.
