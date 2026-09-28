---
"@holakirr/snow-ui": minor
---

Accessible secondary and error text, and accessibility fixes found by running axe on every story in both themes.

**New tokens**

- `text-secondary` (`--color-text-secondary`): the colour for secondary text, which the Figma kit draws in Black/40% (2.85:1 on white). Black/60% in light mode (5.74:1 on `background-1`) and White/70% in dark mode (7.08:1 on `#333`); at least 4.5:1 on every library surface. Use it instead of `text-black-40` for text.
- `red-text` (`--color-red-text`): error text. Secondary/Red is 3.36:1 on white; `red-text` is `#D42020` in light mode and `#FF8080` in dark mode (5.21:1 on `background-1` in both).

**Visual changes** (see "Accessibility deviations from the Figma kit" in the README)

- Secondary text is darker (`text-secondary` instead of Black/40%): Breadcrumb parents, Table headers, Calendar weekdays and outside days, Dialog, Sheet and Form descriptions, `Label` and the Input title, ListItem descriptions, menu group labels (DropdownMenu, ContextMenu, Select), CommandPalette group headings, empty message and Enter hint, Scheduler day and hour labels, and the Pagination ellipsis.
- Inactive tabs (every `TabsList` variant), off `Toggle` / `ToggleGroup` items and Bare buttons no longer use 40% opacity: their label and icon are `text-secondary` and turn black on hover and keyboard focus. If you relied on the dimmed look for other content inside them (an image, say), style it yourself.
- The Select placeholder and the Search shortcut hint use `text-secondary` instead of Black/20%; the Search hint no longer has a fill of its own.
- `FormMessage` and an invalid `FormLabel` use `red-text` instead of `red`.
- `TooltipShortcut` is at 70% opacity instead of 40%, the Search clear button at 60%, Scheduler event times at 60%; the Scheduler's today label is black on indigo instead of white.

**Fixes**

- `Tag` no longer renders `role="listitem"`, which was invalid ARIA for a tag outside a list. In a list, render the tags in a `role="list"` element and pass `role="listitem"`, or wrap each in an `<li>`.
- `Slider` passes `aria-label` / `aria-labelledby` to its thumbs (`role="slider"`), so the slider has an accessible name; a range names its thumbs "…, minimum" / "…, maximum".
- `ToastClose` no longer triggers React's warning about a non-boolean `toast-close` attribute.
