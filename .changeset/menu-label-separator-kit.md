---
"@holakirr/snow-ui": patch
---

Menu group titles and dividers match the kit. `DropdownMenuLabel`, `ContextMenuLabel`, `SelectLabel` and the `Combobox` and `MultiSelect` group titles are 14/20 (the kit's SearchPopup group title) instead of 12/16, still `text-secondary` and 28px high. `DropdownMenuSeparator`, `ContextMenuSeparator` and `SelectSeparator` are a 1px Black/4% line, 7px under the item above and 8px over the item below (the kit's item group: 8px padding and a 1px stroke inside its bottom edge), instead of 0.5px Black/10% with 8px on each side: 16px between two groups instead of 16.5. With more contrast the line is `black-20`, and with forced colours the system GrayText, so it no longer disappears.
