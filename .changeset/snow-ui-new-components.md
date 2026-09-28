---
"@holakirr/snow-ui": minor
---

Add the SnowUI Figma components that were missing:

- `IconBox`: the Figma "Icon". Sizes an icon, avatar or image (`size` 12, 16, 20, 24, 28, 32, 40, 48, 80) and can put it on a Black/4% tile (`background`) with a `badge` (the Figma dot, or any node such as a count; `badgeLabel` for screen readers). Exports `ICON_BOX_SIZES`.
- `IconText`: an icon or avatar plus text, with `vertical` and `flip`. `interactive` gives it the Figma "Frame" hover fill and `active` keeps the fill on. It is polymorphic (`as="a"`, `as="button"`).
- `Group`: a row or column of items 8px apart (`vertical`, `reverse`, `gap`) with `role="group"`.
- `Strip`: equal segments in a row or column (`count`, `vertical`, `thickness`, `rounded`). With `value` it is a segmented progress bar (`role="progressbar"`, or pass `role="meter"`).
- `Search`: the Figma search field (`variant` `gray` / `outline`, `size` `sm` / `lg`) with a search icon, a shortcut hint (`shortcut`) and a clear button. Clearing (button or Escape) calls `onChange` with an empty value and `onClear`. Exports `searchStyles`, for example to style a button that opens the CommandPalette.
- `CommandPalette`: the Figma "SearchPopup", built on Radix Dialog. It shows a search combobox over a grouped listbox (`groups`, `onSelect`, `filter`, `emptyMessage`, `loading`, `hotkey`, a controlled or uncontrolled `open` and `query`). Use ↑ / ↓ to move, Enter or a click to select and Escape to close. No new dependencies.
- `ListItem`: a row of the dashboard Notifications / Activities / Contacts lists (`icon`, `title`, `description`), built on `IconText`.

Storybook has a new "Recipes/Dashboard" story that composes these with `Sidebar`, `Breadcrumb`, `Card` and `Button` into the SnowUI dashboard layout.
