---
"@holakirr/snow-ui": patch
---

The library's own scroll areas use the kit's scrollbar (`scrollbar-snow`): the lists of `Select`, `Combobox` and `MultiSelect`, `DropdownMenuContent` and `DropdownMenuSubContent`, the `CommandPalette` results and `SidebarContent`. Chrome, Edge and Safari draw it in an 8px gutter at the end of a list while it scrolls (`scrollbar-gutter` stays `auto`, so a list that doesn't scroll keeps its padding on both sides); in the popovers the track stops 12px from the ends, clear of the 16px corners. Forced-colors mode keeps the system scrollbar.

- `Select` shows the scrollbar Radix hides, next to its scroll buttons.
- `DropdownMenuContent` and `DropdownMenuSubContent` scroll when they are taller than the room on their side (`max-h-(--radix-dropdown-menu-content-available-height)`); they used to run off the window. They already clipped their overflow, so portal submenus with `DropdownMenuPortal` as before. The exported `dropdownMenuContentStyles` has the same classes; a `max-h-*` or `overflow-*` class of yours still wins.
- `ContextMenuContent` gets the scrollbar for when you make it scroll (`max-h-(--radix-context-menu-content-available-height) overflow-y-auto`, with portalled submenus); it doesn't scroll by default, which would clip a submenu that isn't portalled.
