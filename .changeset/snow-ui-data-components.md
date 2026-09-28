---
"@holakirr/snow-ui": major
---

Align the data, overlay and navigation components with the SnowUI Figma kit: Card, Calendar, Toast, Table, Pagination, Breadcrumb, Sidebar, Separator and Dialog, plus the token clean-up of Sheet, Skeleton, Accordion, Avatar and Scheduler. The components use the design tokens (`black-4`, `black-10`, `surface-1`, `background-3`, `text-12`, `rounded-12`, …) instead of Tailwind's `black/NN` modifiers, off-scale radii and `font-light` / `font-medium`, so they also follow the dark mode values.

**Breaking changes and how to migrate**

- `Card`:
  - The default card is the Figma Card component: radius 16, padding 12/16 (was 24) and `surface-1`.
  - The old padding and the dashboard look are `variant="block"`: radius 20, padding 24, `background-2`. Replace `<Card className="…">` that relied on the 24px padding with `<Card variant="block">`, or add `p-6`.
  - `bordered` draws its 0.5px Black/40% stroke inside the card (an inset ring instead of a border), so the card no longer grows by 1px.
- `Calendar`:
  - Weeks start on Monday (`weekStartsOn` defaults to 1, also over the `locale`'s week start). Pass `weekStartsOn={0}` for a Sunday start.
  - The selected day is `primary` (black; indigo in dark mode) and today is Secondary/Indigo with static black text, as in the Figma DatePicker guidance (Figma's white text on indigo is 2.07:1, so today's number is black). Days outside the month are `black-40` without `opacity-50`. Day text is 12px (was 14px).
  - The calendar has the DatePicker surface: `glass-2` (Background/3, blur, shadow), a 1px `surface-1` inner stroke and radius 16. The root no longer has `p-4`; the months have it.
  - The previous / next buttons moved from react-day-picker's `Nav` (absolutely positioned around the caption) into the month caption: the toolbar shows "‹ month ›" on the right. With several months, Previous is in the first caption and Next in the last. They sit in one navigation landmark labelled "Month navigation"; translate it with `labels={{ labelNav: () => '…' }}`. `buttonPreviousClassName`, `buttonNextClassName` and `navClassName` now style these buttons; `components.Nav` is no longer used.
  - Your `classNames` are merged into the defaults slot by slot (`classNames={{ day: 'x' }}` adds `x` to the day's default classes instead of replacing every slot), and your `components` are merged with the calendar's.
- `Toast` / `Toaster`:
  - Toasts close after 3 seconds (was Radix's 5 seconds). `<Toaster duration={5000} />` restores the old timing; a toast's own `duration` still wins.
  - The close button is only there when it's needed: `toast({ closable })` defaults to `true` for toasts with an `action` or an infinite `duration` and to `false` otherwise (the Figma toast closes itself, on swipe or with Escape). `ToastClose` is no longer absolutely positioned and hidden until hover: it is an inline, always visible button at the end of the toast.
  - Radius 16 on both sizes, the Figma fill (Black/80% under White/10%) with a 20px background blur, big toasts padded 8/12, Regular titles. Toasts hug their content instead of stretching to the viewport width.
  - The toast is dark in both themes: the Figma component is pinned to SnowUI-Light, so its colours are the static ones (`static-black/80`, `static-white`) instead of the flipping `black-80` / `white`. The green and yellow status icons have at least 5:1 on it.
- `Table`:
  - The table uses `border-separate border-spacing-0`, and the lines are drawn on the cells: a `black-20` line under the header cells and `black-4` separators under body cells. Custom `border-*` classes on `TableHeader` / `TableRow` should move to `TableHead` / `TableCell`.
  - Cells are Regular (was `font-light`), 12px, 40px high, padded 8/12 including the first column (`first-of-type:ps-0` is gone).
  - Hovered rows and rows with `data-state="selected"` get a rounded Black/4% highlight.
- `Pagination`:
  - Items are the Figma Button Small "Outline": 24px high, radius 12, a 0.5px `black-10` stroke. The current page has a `black-4` fill instead of the black filled button; the default `size` is `sm` (was `md`).
  - `PaginationPrevious` / `PaginationNext` without children render as square icon buttons; the list gap is 8px.
- `Breadcrumb`: 12px items with the Button Small padding (4/12, radius 12, `black-4` on hover), 4px apart (was 8px); `BreadcrumbPage` has the same padding; separators are `black-10`.
- `Sidebar`:
  - 212px wide (was 256px), no background (the sidebar sits on the page), a 0.5px `black-10` inner edge. The mobile sheet keeps a `background-1` panel.
  - Menu buttons are 36px high with radius 12, 14px Regular text and 20px icons; hover and active items use `black-4` (was `black/10`, active also `font-medium`). The collapsed icon width is 52px.
  - Group labels are 14px Regular `black-80` (was 12px medium `black/70`); Figma's Black/40% is 2.85:1. Groups, header and footer are padded 16px horizontally.
  - Sub-menu buttons (`SidebarMenuSubButton`) are 36px high (was 28px) with radius 12, like the menu buttons; `size="sm"` stays 28px.
- `Separator` is a `black-10` line by default (was solid black). Pass `className="bg-black"` for the old look. The new `hairline` prop draws it 0.5px thick.
- `Dialog`: the popup (`DialogBody`) is `background-3` with a 20px background blur, padded 80px from the `md` breakpoint (32px below), and the content is 576px wide (`max-w-xl`). The padding reads `--dialog-padding`: a `p-*` class replaces it at every breakpoint, and `[--dialog-padding:…]` (with or without `md:`) changes it. The mask blurs 20px (was 4px); like Figma's dark dashboards, it keeps its light gradient in dark mode. `DialogTitle` is `text-48`.
- `Sheet`: the overlay is the Dialog mask (gradient and blur) instead of 40% black, and the panel is `background-3` with a background blur and a 0.5px `black-10` edge.
- `Skeleton` is a flat `black-4` block with radius 8 (was a white-to-black gradient with radius 6).
- `Accordion` triggers use `black-4` on hover and a focus ring instead of `black/10`.
- `AvatarFallback` text is `static-black`, so it stays readable on `color-2` in dark mode.

**Accessibility deviations from the Figma kit** (also listed in the README)

- `Calendar`: today's number is static black on Secondary/Indigo (10:1) instead of Figma's white (2.07:1).
- `Sidebar`: group labels are `black-80` instead of Figma's Black/40% (2.85:1 at 14px).
- `Toast`: toasts with an `action` or an infinite `duration` get a close button by default; the Figma toast has none.

**New**

- `Card`: `variant`, `interactive` (the Figma hover stroke) and `selected` (a 1px `primary` stroke, `data-state="selected"`).
- `Calendar`: `header` (a slot above the months, e.g. a date input), `showTodayButton` / `onTodayClick` and `lastSelection` / `onLastSelectionClick` for the Figma "Today" and "Last selection" actions, `todayLabel` / `lastSelectionLabel`.
- `TableHead`: `sortDirection` and `onSort` turn the header into a sort button with `aria-sort`. With TanStack Table pass `sortDirection={column.getCanSort() ? column.getIsSorted() : undefined}` and `onSort={column.getToggleSortingHandler()}`; `undefined` renders a plain header. `TableSortDirection` type.
- `Toaster`: `duration`; `toast({ closable })`.
- `PaginationLink`: `disabled`. A disabled link has no `href` or `onClick`, so it can't be followed or focused; it keeps `role="link"` and `aria-disabled`. `PaginationEllipsis` hides only the "…" glyph from assistive technology, so "More pages" is announced.
- `Separator`: `hairline`.
