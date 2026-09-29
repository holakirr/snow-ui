---
"@holakirr/snow-ui": minor
---

Localization, right-to-left support and `asChild` composition.

**`SnowUIProvider`** (optional) sets `messages`, `locale` and `dir` for the components below it. `messages` translates every built-in string — accessible names, screen-reader text, placeholders, empty states — and is typed: `Messages` (grouped by component, strings with values are functions), with the English `defaultMessages` as the default and `MessagesOverrides` for partial translations merged namespace by namespace. `locale` (a date-fns or react-day-picker locale) localizes `Calendar` and the `Scheduler` labels. `dir` sets Radix's direction (keyboard navigation of Tabs, Slider, menus, RadioGroup, ToggleGroup, Accordion), `Calendar`'s arrow keys, the `start` / `end` sides of `Sheet` and `Sidebar`, and the `dir` of portalled content. Providers nest. `useMessages()` and `useSnowUI()` read them. A component's own label props win over the provider; new ones: `DialogHeader` / `SheetContent` `closeLabel`, `Tag` `removeLabel`, `BreadcrumbEllipsis` / `PaginationEllipsis` `label`, `CommandPalette` `loadingLabel`, `Slider` `thumbLabels`.

**RTL:** the components use logical utilities (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`, `text-start`, `rounded-s-`/`rounded-e-`, `border-s`), so they mirror under `dir="rtl"`; directional icons (pagination, calendar, accordion, menu and link arrows, `SidebarTrigger`, icon breadcrumb separators) flip, the `Switch` thumb moves the other way, keyboard shortcuts (`KBD`) stay left-to-right and toasts are swiped to the left. New values: `Sheet` / `Sidebar` `side="start" | "end"` (the defaults: `end` for `Sheet`, `start` for `Sidebar`, the same sides as before in left-to-right text), `Tag` `shape="arrow-start" | "arrow-end"`, `Typography` `align="start" | "end"` (default `start`).

**`asChild`** is the way to render a component as another element: new on `Button`, `Typography`, `IconText`, `ListItem`, `Link`, `BreadcrumbLink`, `PaginationLink`, `PaginationPrevious` and `PaginationNext`. The child gets the props, ref and composed event handlers, its classes are merged with `twMerge` (the child's win), and the component's content (label, icons) goes inside it. The `Sidebar` parts that had `asChild` now merge classes the same way. `Search` gains `onValueChange(value)`.

**Deprecated** (they keep working, with a one-time development warning, and will be removed in the next major version):

- `as` on `Button`, `Typography`, `IconText` and `ListItem`: use `asChild` and put element props on the child, `<Button asChild><a href="/">…</a></Button>`.
- `leftContent` / `rightContent` on `Button`, `Tag` and `DialogHeader`: use `startContent` / `endContent`, which follow the text direction.
- `onClose` on `Tag`: use `onRemove`.

Also: the modules of `Badge`, `Breadcrumb`, `Link`, `Pagination` and `Tag` are now client components (`'use client'`), as they read the provider's context; the `BreadcrumbEllipsis` screen-reader text ("More pages") is no longer hidden from screen readers; `Pagination`'s default name is "Pagination" (was "pagination"); `Scheduler` formats its day and hour labels with the provider's locale (en-US by default) instead of mixing en-US and ru-RU. New dependency: `@radix-ui/react-direction`.
