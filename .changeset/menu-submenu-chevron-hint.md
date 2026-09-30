---
"@holakirr/snow-ui": minor
---

Submenu items of `DropdownMenu` and `ContextMenu`:

- The chevron at the end of `DropdownMenuSubTrigger` and `ContextMenuSubTrigger` is `control-border-strong` (Black/40%, Black/80% with more contrast), as the Select chevron, instead of black. The kit's Black/20% is 1.6:1; Black/40% is 2.85:1, lighter than the black it was and under 3:1 with the default contrast (a known gap, like the Select chevron). It dims with a disabled item.
- New `hint` prop on both: the submenu's current value (the kit's value hint, such as "Multi-Select"), in 12/16 `text-secondary` text 8px before the chevron. It is part of the item's accessible name. Without it the item is unchanged.
