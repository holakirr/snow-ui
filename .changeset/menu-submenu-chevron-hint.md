---
"@holakirr/snow-ui": minor
---

Submenu items of `DropdownMenu` and `ContextMenu`:

- The chevron at the end of `DropdownMenuSubTrigger` and `ContextMenuSubTrigger` is `text-secondary` (Black/60%, White/70% in dark mode), as the Select chevron, instead of black: lighter, as in the kit, and still 3:1 or more in both themes (at least 5.5:1 light, 4.82:1 dark, on the highlighted item too). The kit's Black/20% is 1.6:1. It dims with a disabled item.
- New `hint` prop on both: the submenu's current value (the kit's value hint, such as "Multi-Select"), in 12/16 `text-secondary` text 8px before the chevron. It is part of the item's accessible name. Without it the item is unchanged.
