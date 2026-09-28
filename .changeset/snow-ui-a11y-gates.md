---
"@holakirr/snow-ui": major
---

Accessible secondary and error text, and accessibility fixes found by running axe on every story in both themes.

**Breaking changes and how to migrate**

- `Tag` no longer renders `role="listitem"`. It was invalid ARIA for a tag outside a list (`listitem` needs a `list` parent), but code that relied on it now has a `role="list"` container without list items. Pass the role yourself, or use a real list:

  ```tsx
  // Before: the tags were list items implicitly
  <div role="list"><Tag label="React" /><Tag label="Vue" /></div>
  // After
  <div role="list"><Tag label="React" role="listitem" /><Tag label="Vue" role="listitem" /></div>
  // or
  <ul><li><Tag label="React" /></li><li><Tag label="Vue" /></li></ul>
  ```

- Inactive tabs (every `TabsList` variant), off `Toggle` / `ToggleGroup` items and Bare buttons are no longer dimmed with 40% opacity: their label and icon colour is `text-secondary`, set through a custom property (`--segment-fg` for segmented items and `Toggle`, `--tab-fg` for Underline tabs, `--button-fg` for Bare buttons) that hover, keyboard focus and the selected state switch to black (`primary` for the active Underline tab). Content that relied on the dimming (an image, a coloured icon) is now fully opaque: dim it yourself. A `text-*` class passed as `className` still sets the colour, now in every state; to change only the rest colour and keep the state colours, set the property instead: `className="[--button-fg:var(--color-red-text)]"`.

**New**

- `text-secondary` (`--color-text-secondary`): the colour for secondary text, which the Figma kit draws in Black/40% (2.85:1 on white). Black/60% in light mode (5.74:1 on `background-1`) and White/70% in dark mode (7.08:1 on `#333`); at least 4.5:1 on every library surface. Use it instead of `text-black-40` for text.
- `red-text` (`--color-red-text`): error text. Secondary/Red is 3.36:1 on white; `red-text` is `#D42020` in light mode and `#FF8080` in dark mode (5.21:1 on `background-1` in both).
- `TabsTrigger` supports `asChild` (a router link as the tab): the icon, the label and the Underline line are rendered inside the child.

**Visual changes** (see "Accessibility deviations from the Figma kit" in the README)

- Secondary text is darker (`text-secondary` instead of Black/40%): Breadcrumb parents, Table headers, Calendar weekdays and outside days, Dialog, Sheet and Form descriptions, `Label` and the Input title, ListItem descriptions, menu group labels (DropdownMenu, ContextMenu, Select), CommandPalette group headings, empty message and Enter hint, Scheduler day and hour labels, and the Pagination ellipsis.
- The Select placeholder and the Search shortcut hint use `text-secondary` instead of Black/20%; the Search hint no longer has a fill of its own.
- `FormMessage` and an invalid `FormLabel` use `red-text` instead of `red`.
- `TooltipShortcut` is at 70% opacity instead of 40%, the Search clear button at 60%, the Tag close icon at 80%, Scheduler event times at 60%; the Scheduler's today label is black on indigo instead of white.

**Fixes**

- `Slider` passes `aria-label` / `aria-labelledby` to its thumbs (`role="slider"`), so the slider has an accessible name; a range names its thumbs "…, minimum" / "…, maximum".
- `ToastClose` no longer triggers React's warning about a non-boolean `toast-close` attribute.
