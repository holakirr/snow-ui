---
"@holakirr/snow-ui": minor
---

Submenu items of `DropdownMenu` and `ContextMenu`:

- The chevron at the end of `DropdownMenuSubTrigger` and `ContextMenuSubTrigger` is `control-border-strong` (Black/40%, Black/80% with more contrast), as the Select chevron, instead of black. The kit's Black/20% is 1.6:1. It dims with a disabled item.
- New `hint` prop on both: the submenu's current value (the kit's value hint, such as "Multi-Select"), in 12/16 `text-secondary` text 8px before the chevron. It is part of the item's accessible name. Without it the item is unchanged.
