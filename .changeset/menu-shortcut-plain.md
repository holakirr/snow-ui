---
"@holakirr/snow-ui": patch
---

`DropdownMenuShortcut` and `ContextMenuShortcut` are the Figma kit's plain shortcut text ("⌘C" in Black/40%), in `text-secondary`, instead of a `KBD` key cap with a Black/4% fill and black text. They are still a `<kbd>` with `aria-keyshortcuts` and take the same props; the text dims with a disabled item. Pass a `variant` (`solid` or `border`) to keep the key cap, and `separator=""` to join symbol keys as the kit does (`⌘C`; the default separator is still `+`). A `KBD` you put in an item yourself is unchanged.

In right-to-left menus the shortcut now sits at the end of the item (on the left); it stayed next to the label, because the `<kbd>` is left-to-right and its `ms-auto` became a left margin.
