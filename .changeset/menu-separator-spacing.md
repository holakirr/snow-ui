---
"@holakirr/snow-ui": patch
---

Menu separators have the Figma kit's spacing: `DropdownMenuSeparator`, `ContextMenuSeparator` and `SelectSeparator` are 8px from the items on each side (8 + 0.5 + 8 between groups); they were 4px. `DropdownMenuGroup`'s 4px above and below is now a margin instead of padding, so next to a separator it merges into the separator's 8px and a line between two groups stays at 8 + 0.5 + 8 (it would have been 12 + 0.5 + 12). Two groups without a line between them are 4px apart instead of 8px. Menus with separators grow by 8px per separator.
