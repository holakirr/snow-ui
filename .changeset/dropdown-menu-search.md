---
"@holakirr/snow-ui": minor
---

`DropdownMenu`: a search field at the top of the menu (the kit's Popover search), opt-in with the new `search` prop on `DropdownMenuContent` (`true`, or `DropdownMenuSearchOptions`: `query`, `defaultQuery`, `onQueryChange`, `filter`, `label`, `placeholder`, `emptyMessage`). Without `search` the menu is unchanged.

- The kit's gray Search (28px high, 4/8 padding, a 16px radius) in a 44px row with 8px of padding; the items scroll under it.
- Typing filters the items, checkbox and radio items and sub triggers by their text (`textValue`, or their children's text): every word of the query, in any case (`defaultDropdownMenuSearchFilter`). While filtering, labels and separators are hidden; a submenu isn't filtered.
- The field takes the focus when the menu opens. Typing in it doesn't trigger the menu's typeahead; ArrowDown / ArrowUp move to the first / last item, ArrowUp on the first item goes back to the field, a letter typed on an item goes to the field, and Escape clears the field before it closes the menu.
- The field and the empty state ("No results", in a polite live region) are next to the `role="menu"` list, which keeps the menu's name and orientation: a menu may only contain items.
- New optional messages namespace `dropdownMenu` (`search`, `empty`), required in 6.0 like the 5.1 namespaces.
