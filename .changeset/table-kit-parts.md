---
"@holakirr/snow-ui": minor
---

The kit's tables (Table A, Search results, loading data dynamically): new props and ready-made parts. Without them a table is unchanged.

- `TableHead` gets `reveal`, the kit's "Select all" that shows only while the pointer is over the table (or while it has the focus, is checked or mixed, or has an open menu; always on touch screens), and `filtered`, the kit's filtered column: a 16px FunnelSimple 4px before the label, the label in black, and "Filtered" for screen readers before it.
- A selected column: `data-state="selected"` on a `TableHead` and the `TableCell`s of its column gives them the row highlight (Black/4%), rounded 12px at the top of the header and the bottom of the last row; the header label turns black.
- `TableSelectionBar`: the function bar "when data is selected": a 12px Black/10% divider, "2 Selected", and the Delete (Trash) and Duplicate (Copy) buttons for the handlers you pass (`onDelete`, `onDuplicate`), 8px apart, then your own actions. A `role="group"` named by its count; `deleteLabel` and `duplicateLabel` name the buttons.
- `TableCopyButton`: a 16px ClipboardText button for a cell, shown while the pointer is over its cell or it has the keyboard focus (always on touch screens), with a 24px hit area. A click copies `value` with the Clipboard API, shows a check mark for 2 seconds, announces "Copied" and calls `onCopy`.
- `TablePageSize`: the kit's "20 ∨" rows per page, a Radix Select with a small borderless trigger (12/16, ArrowLineDown 16 in `text-secondary`); `options` default to 20, 50 and 100; `value` / `defaultValue` / `onValueChange` take numbers.
- `TableResults`: the kit's "105 results", 12/16 `text-secondary` in a `role="status"` region, so a new count is announced.
- `TableLoadMore`: the kit's "loading data dynamically", a 40px row under the table with a 16px spinner while `loading` ("Loading more" is announced); `onLoadMore` is called when it scrolls into view (an IntersectionObserver).
- New optional messages namespace `table` (`filtered`, `selected`, `delete`, `duplicate`, `copy`, `copied`, `pageSize`, `results`, `loadingMore`), required in 6.0 like the 5.1 namespaces.

The Table stories are now recipes of the kit's interactive guidance. Table A sorts and filters from the function bar's menus (the headers are text; the sorted one gets an arrow and `aria-sort`), shows "2 Selected" with Delete (a "Deleted" toast with Undo) and Duplicate (the copies go under the selection and are selected), copies addresses and has rows per page and the result count under it. New stories: Search results (the Search "In progress" until the results come), No results, LoadMore, ColumnSelection (a click on the blank area of a column, Ctrl / ⌘ and Shift, a click outside to clear) and SortableHeaders (`sortDirection` / `onSort`, unchanged). In the `@snow-ui` registry the `table` item now also installs `snow-ui-provider`, for the "Filtered" text.
