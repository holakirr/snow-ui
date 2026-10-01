---
"@holakirr/snow-ui": minor
---

`DropdownMenuItem` and `ContextMenuItem`: new `variant="destructive"` for an action that deletes or can't be undone (the kit's red "Delete Property" row). The text and the icons are `red-text` (#D42020: 5.21:1 on the popover, 4.77:1 on the highlighted item); in dark mode `red-text` is mixed with 40% white (#FFB3B3: 6.21:1, 4.59:1), since #FF8080 is 3.22:1 on the White/10% highlight. A disabled one is dimmed like the others; the item gets `data-variant="destructive"`. Without `variant` (`'default'`) items are unchanged.
