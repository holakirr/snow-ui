---
"@holakirr/snow-ui": minor
---

Closer to the SnowUI Figma kit (design fixes; no props removed):

- **Pagination:** the default `size="sm"` items are 28px high, the kit's pagination row (they were 24px); `md` and `lg` are unchanged.
- **Sidebar:** `SidebarMenuButton` has the Figma nav item's 4px gap (it was 8px), and `SidebarMenuSub` is indented without the start-side line (the kit's sub-items have none).
- **DropdownMenu and ContextMenu:** the check mark of checkbox and radio items sits at the end of the item, like Select's (the kit's selected item: text, then a 16px Check); it was at the start. Radio items show the same check in both menus (a dot in DropdownMenu, a 6px dot in ContextMenu before). `inset` still adds its start padding.
- **ContextMenu:** `ContextMenuSubTrigger` ends in the kit's 16px `ArrowLineRight` chevron, as in DropdownMenu (it was an arrow with a shaft).
