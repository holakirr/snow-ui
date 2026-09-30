---
"@holakirr/snow-ui": minor
---

Closer to the SnowUI Figma kit (design fixes; no props removed):

- **Pagination:** the current page is the kit's Button "Gray", a Black/4% fill without the 0.5px Black/10% stroke the other pages ("Outline") keep. The item size (24px, radius 12) and the 8px gap already matched.
- **Sidebar:** `SidebarMenuButton` has the Figma nav item's 4px gap (it was 8px), and `SidebarMenuSub` is indented without the start-side line (the kit's sub-items have none).
- **DropdownMenu and ContextMenu:** the check mark of checkbox and radio items sits at the end of the item, like Select's (the kit's selected item: text, then a 16px Check); it was at the start. Radio items show the same check in both menus (a dot in DropdownMenu, a 6px dot in ContextMenu before). `inset` still adds its start padding.
- **ContextMenu:** `ContextMenuSubTrigger` ends in the kit's 16px `ArrowLineRight` chevron, as in DropdownMenu (it was an arrow with a shaft).
- **Card:** the `default` card stacks its children like the Figma Card, a vertical auto-layout 4px apart (`flex flex-col gap-1`). A `className` that sets a display (`flex`, `grid`, `block`, with any variant) keeps its own layout without the stack, and `gap-…` changes the spacing; `variant="block"` is unchanged. Cards that already had `flex flex-col gap-…` look the same; a default card with inline content and no layout class now stacks it (add `block` to keep the flow).
- **Dialog:** the close button of `DialogHeader` has the kit's radius 12 (Button Medium "Gray", icon-only), not 16.
