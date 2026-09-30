---
"@holakirr/snow-ui": minor
---

Closer to the SnowUI Figma kit (design fixes; no props removed):

- **Pagination:** the current page is the kit's Button "Gray", a Black/4% fill without the 0.5px Black/10% stroke the other pages ("Outline") keep. The item size (24px, radius 12) and the 8px gap already matched.
- **Sidebar:** `SidebarMenuButton` has the Figma nav item's 4px gap (it was 8px), and `SidebarMenuSub` is indented without the start-side line (the kit's sub-items have none).
- **DropdownMenu and ContextMenu:** the check mark of checkbox and radio items sits at the end of the item, like Select's (the kit's selected item: text, then a 16px Check); it was at the start. Radio items show the same check in both menus (a dot in DropdownMenu, a 6px dot in ContextMenu before). `inset` still adds its start padding: drop it from items and labels that used it only to line up with the old start-side mark, or they are now indented past the check items' text.
- **ContextMenu:** `ContextMenuSubTrigger` ends in the kit's 16px `ArrowLineRight` chevron, as in DropdownMenu (it was an arrow with a shaft).
- **Dialog:** the close button of `DialogHeader` has the kit's radius 12 (Button Medium "Gray", icon-only), not 16. The `startContent` slot is at least 40px wide instead of exactly 40px, so it fits the kit's "Add data" icon (48px, the Add glyph at 36×36) without overflowing; a 40px or smaller start element lays out as before.
- **Table:** new `TableToolbar`, the kit's table function bar (a Background/2 strip at least 44px high, with radius 12, padded 8px, its children 16px apart) for the add, filter and sort buttons and a Search, and `TableCell`'s `reveal`, which shows a cell's elements only while their row is hovered or selected, or while they hold the focus, a checked checkbox or an open menu (the kit's row checkbox and "…" action; always shown on devices without hover). Existing tables are unchanged.
