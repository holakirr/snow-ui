# Changelog

## 5.0.0

### Major Changes

- [#161](https://github.com/holakirr/snow-ui/pull/161) [`e15a2e1`](https://github.com/holakirr/snow-ui/commit/e15a2e1ad8b324a401f83d475f1bef582108701b) Thanks [@holakirr](https://github.com/holakirr)! - Accessible secondary and error text, and accessibility fixes found by running axe on every story in both themes.

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

  - `text-secondary` (`--color-text-secondary`): the colour for secondary text, which the Figma kit draws in Black/40% (2.85:1 on white). Black/60% in light mode (5.74:1 on `background-1`) and White/70% in dark mode (7.08:1 on `[#333](https://github.com/holakirr/snow-ui/issues/333)`); at least 4.5:1 on every library surface. Use it instead of `text-black-40` for text.
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

- [#158](https://github.com/holakirr/snow-ui/pull/158) [`e4c2aef`](https://github.com/holakirr/snow-ui/commit/e4c2aef84b3f2857fe610ba52903ef664a7750c2) Thanks [@holakirr](https://github.com/holakirr)! - Align the controls with the SnowUI Figma kit: Button, Link, Tag, Badge, KBD, Input (Input, InputSmall, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, Toggle, ToggleGroup), Label, Form, Tabs, Tooltip, Popover, DropdownMenu and ContextMenu. They use the design tokens (`black-10`, `rounded-16`, `text-14`, `shadow-glass-2`…) instead of Tailwind's alpha modifiers and off-scale radii, and render the Figma variants in both light and dark mode. Where the kit conflicts with WCAG 2.2 AA, the components follow WCAG; see "Accessibility deviations from the Figma kit" in the README.

  **Breaking changes and how to migrate**

  - `Input`:

    - The title no longer floats. `title` renders the Figma "2 row" title: a static 12/16 label in Black/40% above the value, and the `placeholder` stays visible next to it.
    - `Input` renders a field element around the `<input>`. `className` and `style` now apply to that field (it holds the stroke, background, padding and width); use the new `inputClassName` and `inputStyle` for the `<input>` itself. `ref`, `id`, `value`, event handlers and every other prop still go to the `<input>`.
    - The field is full width, 44px high with one row and 68px with a title (padding 12/16, 14/20 text, a 0.5px stroke), instead of 16/20 padding and 18px text.

    ```tsx
    // Before
    <Input title="Email" className="w-80 uppercase" style={{ letterSpacing: 1 }} />
    // After
    <Input title="Email" className="w-80" inputClassName="uppercase" inputStyle={{ letterSpacing: 1 }} />
    ```

  - `focusInputClasses` no longer sets a font size (it had `text-lg`; `basicInputClasses` now sets `text-14`) and uses the `focus-ring` utility instead of `focus:ring-4 focus:ring-focus`.
  - `Button`:
    - Labels don't wrap (`whitespace-nowrap`).
    - The Figma icon sizes (12/16/20px next to a label, 16/20/24px icon-only) apply only to `<svg>` children that don't size themselves (no `width` attribute and no `size-*` class). Icons from `@holakirr/snow-ui-icons` always render `width`, so they keep their `size` (24 by default): pass `size={16}` and so on to match the design.
  - `Link`: the `arrow` and `external` variants are `inline-flex` (the default variant stays inline, so it wraps in prose). `external` links open in a new tab by default (`target="_blank"`, `rel="noopener noreferrer"`; pass your own to override) and append a visually hidden "(opens in a new tab)" (`externalLabel` to translate it).
  - `Tag`: the root is `inline-flex` (was `flex`), and the close control is a plain `<button>` (was a `Button`) with a 12px icon and a 24px hit area.

  **Accessibility deviations from the Figma kit**

  - Focus: every control shows the new `focus-ring` utility on keyboard focus — the Figma "Focus" ring plus a 2px `black-80` outline offset by 2px (12.6:1 in light mode, 8.7:1 in dark mode; the Figma ring alone is 1.1:1). Inactive tabs, off toggles and Bare buttons, which are at 40% opacity, turn fully opaque while focused.
  - The Filled Button label and the checked Checkbox mark use the per-mode `white` token: black on the dark-mode indigo Primary (10.15:1) instead of Figma's white (2.07:1).
  - The Badge number is black on indigo (10.15:1) instead of white (2.07:1).
  - Indigo text (the default Link, the active Tag) uses the new `indigo-text` token: `#5B5BD6` in light mode (5.37:1 on white) and the Figma `#ADADFB` in dark mode (6.11:1). Fills keep the Figma indigo.
  - The default Link underlines on hover as well as changing colour.
  - The Dark Tooltip's text flips with its background in dark mode.
  - An icon-only `TabsTrigger` without `aria-label` or `aria-labelledby` logs a warning in development.

  **New**

  - The `focus-ring` utility and the `indigo-text` colour token (`text-indigo-text`).
  - `Input`: `startContent` and `endContent` for icons, buttons or a `KBD` around the value; `readOnly` renders the Figma "Static" state (no hover or focus stroke); `inputClassName` and `inputStyle`.
  - `Button`: `variant="bare"` (no box, 40% opacity, 100% on hover).
  - `Tabs`: `TabsList` takes `variant` (`line`, the default; `pill`; `icon-toggle`; `solid`) and `size` (`sm`, `md`, `lg`); `TabsTrigger` takes an `icon` (a trigger with only an icon is an icon-only tab).
  - `ToggleGroup` / `Toggle`: `variant="pill"`, and `iconOnly` for square icon toggles (detected when omitted: a single child element without children, such as an icon). Toggles now look like the Tabs segmented items, and `ToggleGroupItem` props override the group's.
  - `Checkbox` renders the indeterminate state (`checked="indeterminate"`, Figma "Multiple") with a bar.
  - `Tag`: `state` (`default`, `active`, `static`), `shape` (`default`, `arrow-left`, `arrow-right`) and `dot`.
  - `TooltipContent`: `variant="light"`; `TooltipShortcut` for the 40% secondary text.
  - `KBD`: `variant` (`solid`, the default; `border`).
  - `Link`: `variant` (`default`, `arrow`, `external`) and `externalLabel`.
  - `Textarea` and `InputSmall` support the "Static" state through `readOnly`.
  - Exports: `LinkProps`, `linkVariants`, `kbdVariants`, `tooltipVariants`, `ToggleVariantProps`, `staticInputClasses`, `TabsVariant`, `TagState`, `TagShape`. `BUTTON_VARIANTS` and `TOGGLE_VARIANTS` include `bare` and `pill`.
  - `@radix-ui/react-compose-refs` is a direct dependency.

  **Visual changes**

  - `Button`: the Figma sizes — `sm` 24px (padding 4/12, radius 12, 12/16 text), `md` 36px (8/16, radius 16, 14/20), `lg` 48px (12/20, radius 20, 16/24). The label size follows the button size (it was always 16px; `textSize` still overrides it). Gray is Black/4% (10% on hover), Borderless and Outline hover to Black/4%, Outline has a 0.5px stroke, Filled hovers to `primary-hover`. Disabled buttons use Black/20% text.
  - `Checkbox`, `RadioGroup`: 2px Black/20% rings on Background/3, Black/40% on hover, the Figma check mark, and the Figma inner shadow on the checked fill; the checkbox radius is 8px. `Switch`: the thumb travels 12px, stays white in dark mode and has "Drop shadow 2".
  - Disabled states (the kit has none) stay visible in both modes instead of fading out: Checkbox and Radio get a Black/4% fill with a Black/10% ring (a Black/10% fill with a Black/40% mark, or a Black/20% dot, when checked); Switch a Black/10% track (Black/20% when on); toggles and segmented tabs full opacity with Black/20% content and a 0.5px Black/10% outline; line tabs Black/20% text.
  - Cursors: `index.css` restores the pointer cursor that Tailwind v4's preflight dropped, for buttons and the ARIA controls (`button`, `option`, `menuitem*`, `tab`, `radio`, `checkbox`, `switch`, `summary`, `label[for]`), and shows `not-allowed` on disabled elements (`:disabled`, `aria-disabled="true"`, `data-disabled`). Slider thumbs use `grab`/`grabbing` and the track `pointer`; Select options and context-menu items use `pointer` (was `default`); disabled menu items show `not-allowed` and are no longer `pointer-events: none`.
  - `Tabs` (`line`): a 2px underline; inactive tabs are at 40% opacity and 100% on hover.
  - `Tooltip`: a 12px radius, a background blur and a White/10% overlay.
  - `PopoverContent`, `DropdownMenuContent`, `ContextMenuContent`, `SelectContent`: 12px padding, Background/3, a 1px Surface/1 stroke and the "Glass 2" shadow. Their items are 36px high with a 12px radius; group labels are 12/16 Black/40%; separators are 0.5px Black/10%; shortcuts use `KBD`.
  - `SelectTrigger`: the Input field (44px, 14/20 text) with a 16px icon.
  - `InputSmall`: the Figma Search field (radius 16, 0.5px stroke, background blur).
  - `Tag`: a 12px close icon at 40% opacity without a button background.
  - `Badge`: indigo (was purple).
  - `KBD`: a 16px-high box (28px minimum width, radius 6) with 12/16 text in Black/100% (was Black/20% text without a box).
  - `Link`: 14/20 text; the default link is indigo (was 12px Black/40%).
  - `Label`, `FormDescription`, `FormMessage`: 12/16 text; the label is Black/40% and no longer `w-min`.
  - `SidebarInput` renders the new Input field, 32px high.

- [#157](https://github.com/holakirr/snow-ui/pull/157) [`ca594ef`](https://github.com/holakirr/snow-ui/commit/ca594efd16c0c24909344841ce979dc76b2404b0) Thanks [@holakirr](https://github.com/holakirr)! - Align the data, overlay and navigation components with the SnowUI Figma kit: Card, Calendar, Toast, Table, Pagination, Breadcrumb, Sidebar, Separator and Dialog, plus the token clean-up of Sheet, Skeleton, Accordion, Avatar and Scheduler. The components use the design tokens (`black-4`, `black-10`, `surface-1`, `background-3`, `text-12`, `rounded-12`, …) instead of Tailwind's `black/NN` modifiers, off-scale radii and `font-light` / `font-medium`, so they also follow the dark mode values.

  **Breaking changes and how to migrate**

  - `Card`:
    - The default card is the Figma Card component: radius 16, padding 12/16 (was 24) and `surface-1`.
    - The old padding and the dashboard look are `variant="block"`: radius 20, padding 24, `background-2`. Replace `<Card className="…">` that relied on the 24px padding with `<Card variant="block">`, or add `p-6`.
    - `bordered` draws its 0.5px Black/40% stroke inside the card (an inset ring instead of a border), so the card no longer grows by 1px.
  - `Calendar`:
    - Weeks start on Monday (`weekStartsOn` defaults to 1, also over the `locale`'s week start). Pass `weekStartsOn={0}` for a Sunday start.
    - The selected day is `primary` (black; indigo in dark mode) and today is Secondary/Indigo with static black text, as in the Figma DatePicker guidance (Figma's white text on indigo is 2.07:1, so today's number is black). Days outside the month are `black-40` without `opacity-50`. Day text is 12px (was 14px).
    - The calendar has the DatePicker surface: `glass-2` (Background/3, blur, shadow), a 1px `surface-1` inner stroke and radius 16. The root no longer has `p-4`; the months have it.
    - The previous / next buttons moved from react-day-picker's `Nav` (absolutely positioned around the caption) into the month caption: the toolbar shows "‹ month ›" on the right, and the arrows are small borderless `Button`s (24px, 16px icons). With several months, Previous is in the first caption and Next in the last. They sit in one navigation landmark labelled "Month navigation"; translate it with `labels={{ labelNav: () => '…' }}`. `buttonPreviousClassName`, `buttonNextClassName` and `navClassName` now style these buttons; `components.Nav` is no longer used.
    - With `captionLayout="dropdown"` the month and year dropdowns are pointer-cursor chips with a down chevron; react-day-picker's own dropdown classes are kept, so its stylesheet still lays the native `<select>` over the label. The previous / next buttons are never covered by the caption.
    - With several months (`numberOfMonths` > 1), outside days are hidden by default (`showOutsideDays` defaults to `true` for one month only), so dates don't repeat across months. Pass `showOutsideDays` to show them.
    - Your `classNames` are merged into the defaults slot by slot (`classNames={{ day: 'x' }}` adds `x` to the day's default classes instead of replacing every slot), and your `components` are merged with the calendar's.
  - `Toast` / `Toaster`:
    - Toasts close after 3 seconds (was Radix's 5 seconds). `<Toaster duration={5000} />` restores the old timing; a toast's own `duration` still wins.
    - The close button is only there when it's needed: `toast({ closable })` defaults to `true` for toasts with an `action` or an infinite `duration` and to `false` otherwise (the Figma toast closes itself, on swipe or with Escape). `ToastClose` is no longer absolutely positioned and hidden until hover: it is an inline, always visible button at the end of the toast.
    - The toast viewport sizes itself to its toasts (`w-max`, up to 448px from `md`, the screen width minus 32px below), instead of being limited to half the screen by its centred fixed position.
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
  - `Accordion` triggers use `black-4` on hover and the `focus-ring` indicator instead of `black/10`.
  - The focusable parts of these components (Card with `interactive`, Calendar days and toolbar, Table sort buttons, Pagination links, Sidebar items and actions, the Toast close button, Scheduler cells and events) use the shared `focus-ring` utility, and rely on the base cursor rule instead of their own `cursor-pointer`.
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
  - Independent toasters: `<Toaster id="…" />` shows only the toasts created with `toast({ toasterId: "…" })`, and the one-toast limit applies per toaster. `toast()` without a `toasterId` still goes to the `<Toaster />` without an `id`.
  - `PaginationLink`: `disabled`. A disabled link has no `href` or `onClick`, so it can't be followed or focused; it keeps `role="link"` and `aria-disabled`. `PaginationEllipsis` hides only the "…" glyph from assistive technology, so "More pages" is announced.
  - `Separator`: `hairline`.

- [#153](https://github.com/holakirr/snow-ui/pull/153) [`ad8b14b`](https://github.com/holakirr/snow-ui/commit/ad8b14bd08b6d95cd67b147ff9e7f0e5d634b3c2) Thanks [@holakirr](https://github.com/holakirr)! - Align the design tokens with the SnowUI Figma kit (SnowUI-Light and SnowUI-Dark modes). Colors, typography, radius and effects now use the Figma names and values, and Storybook has a new "Foundations" section that lists every token.

  **New tokens**

  - Colors: `primary`, `primary-hover`, `primary-hover-strong`, the Figma alpha steps `black-80`/`-40`/`-20`/`-10`/`-4` and `white-80`/`-40`/`-20`/`-10`/`-4`, `background-1`/`-2`/`-3`, `surface-1`/`-2`/`-3`, `color-1`, `color-2`, `static-white`, `static-black`. Use them as `bg-black-10`, `text-black-40`, `border-black-10` or `var(--color-black-10)`. In dark mode `black-10` and `black-4` use the design's 15% and 10% alpha, which the Tailwind modifiers `black/10` and `black/4` can't express. The modifiers keep working as before.
  - Typography: `text-12` … `text-64` (font size and line height of the Figma text styles).
  - Radius: `rounded-4`, `-8`, `-12`, `-16`, `-20`, `-24`, `-28`, `-32`, `-40`, `-48`, `-80`.
  - Effects: `shadow-1`, `shadow-2`, `shadow-focus`, `shadow-glow`, `shadow-glass-1`, `shadow-glass-2`, `inset-shadow-inner`, `ring-focus`, `backdrop-blur-bg-40` (20px), `backdrop-blur-bg-100` (50px), and the `glass`, `glass-1` and `glass-2` utilities, which approximate Figma's Glass effects.
  - All token CSS variables are always emitted, even when no utility uses them.

  **Deprecated names.** These still work as aliases and will be removed in the next major:

  | Old                                                                                                    | New                    |
  | ------------------------------------------------------------------------------------------------------ | ---------------------- |
  | `brand`                                                                                                | `primary`              |
  | `brand-hover`                                                                                          | `primary-hover-strong` |
  | `bg1`                                                                                                  | `background-1`         |
  | `bg2`                                                                                                  | `background-2`         |
  | `bg3`                                                                                                  | `color-1`              |
  | `bg4`                                                                                                  | `color-2`              |
  | `bg5`                                                                                                  | `surface-1`            |
  | `background`                                                                                           | `background-1`         |
  | `foreground`, `accent-foreground`                                                                      | `black`                |
  | `muted`                                                                                                | `black-4`              |
  | `muted-foreground`                                                                                     | `black-40`             |
  | `accent`                                                                                               | `black-10`             |
  | `destructive`                                                                                          | `red`                  |
  | `input`, `sidebar-border`, `white-border`                                                              | `black-10`             |
  | `ring`                                                                                                 | `primary`              |
  | `--black`, `--white`, `--brand`, `--brand-hover`, `--bg1`, `--bg2`, `--bg5` (comma-separated channels) | `--color-*` variables  |

  For example, `bg-bg5` becomes `bg-surface-1` and `rgba(var(--black), 0.1)` becomes `var(--color-black-10)`.

  **Visual changes**

  - Secondary colours use the Figma values: purple `#B899EB`, indigo `#ADADFB`, blue `#7DBBFF`, cyan `#A0BCE8`, mint `#6BE6D3`, green `#71DD8C`, yellow `#FFCC00`.
  - Dark mode:
    - `primary` is `#ADADFB`.
    - `background-1` is `[#333](https://github.com/holakirr/snow-ui/issues/333)` (was `#2A2A2A`).
    - `background-2` is translucent white at 4% (was opaque white).
  - `bg5` now points to `surface-1`: white at 80% in light mode and white at 4% in dark mode (was light grey `#E5E5E5`). This affects `Card`, the `Select` trigger and `InputSmall`.
  - The shadcn-style aliases point to Figma tokens:
    - `muted` is 4% (was 5%).
    - `accent` is `black-10` (was 10% of the brand colour).
  - The default border colour is `black-10` instead of Tailwind's `gray-200`.
  - The focus ring uses the Figma "Focus" effect: a 4px ring in black at 4% (was 5%). It doesn't flip in dark mode.
  - Popovers, dropdown menus, context menus and the select menu blur the background by 20px, the Figma "Background blur 40". It was 40px.
  - `Typography`:
    - It defaults to 14/20, the Figma default. Before, it inherited the size.
    - The 64 and 48 styles have the Figma line heights: 72px (was 78px) and 56px (was 58px).
    - Its size classes are `text-12` … `text-64` instead of `text-xs` … `text-[4rem]`.
  - Inter's `ss01` and `cv01` features are on globally (`font-feature-settings` on `html`).
  - `dark:` utilities follow the same theme switch as the tokens: `data-theme="dark"`, or the OS preference unless `data-theme="light"`.

### Minor Changes

- [#162](https://github.com/holakirr/snow-ui/pull/162) [`784fc60`](https://github.com/holakirr/snow-ui/commit/784fc60e1e4c0b9f2e1d7838e7fbf2b5208d0469) Thanks [@holakirr](https://github.com/holakirr)! - Styles for projects on Tailwind CSS v4, self-hosted Inter, and design tokens as DTCG files.

  - **`@holakirr/snow-ui/theme.css`**: the theme without Tailwind itself (no `@import "tailwindcss"`, no preflight), for projects that run Tailwind v4: the tokens as theme variables, the theme scopes, the `dark` variant, the `glass*` / `focus-ring` utilities, the base rules and react-day-picker's stylesheet. Your Tailwind then generates the component classes along with yours, so there is one preflight and one set of utilities:

    ```css
    @import "tailwindcss";
    @import "@holakirr/snow-ui/theme.css";
    @source "../node_modules/@holakirr/snow-ui/dist";
    ```

    `@holakirr/snow-ui/index.css` stays the precompiled stylesheet for projects without Tailwind. Import one or the other.

  - **`@holakirr/snow-ui/fonts.css`** (opt-in, import it from JavaScript or through a bundler): self-hosted [Inter](https://rsms.me/inter/) 4.1, the rsms build that has the `ss01` / `cv01` features the design turns on (the Google Fonts build doesn't). Variable weight 100–900, `font-display: swap`, split by `unicode-range`: about 105 kB for Latin, plus 10 kB for arrows and keyboard symbols (Link's ↗, CommandPalette's ↩, ⌘…). Italic faces are a separate opt-in, `@holakirr/snow-ui/fonts-italic.css` (the design has no italic styles). SIL Open Font License, in `dist/fonts/LICENSE.txt`; the package license is now `MIT AND OFL-1.1`. The font files are exported as `@holakirr/snow-ui/fonts/*`, e.g. for preloading.
  - **Optical size**: the base layer sets `font-optical-sizing: none`, so large text keeps Inter's text shapes (opsz 14) as in the Figma kit, which uses "Inter", not "Inter Display", at every size.
  - **Removed** the stylesheet's own `.opacity-4` rule: nothing used it, and in Tailwind v4 projects it came after the generated utilities, so `opacity-4 md:opacity-100` stayed at 4%. Tailwind's `opacity-4` utility (4%) replaces it.
  - **Cascade layers**: react-day-picker's stylesheet is now in `@layer components` in both stylesheets (it was unlayered in `index.css`), so every rule of `index.css` is in one of Tailwind's layers and your unlayered CSS overrides the library predictably. Side effect: Tailwind utilities now override react-day-picker's defaults, so in a `Calendar` with `captionLayout="dropdown"` the month and year dropdowns are 4px apart (the component's `gap-1`) instead of react-day-picker's 8px. Apart from this, the `font-optical-sizing` rule and the removed `.opacity-4`, `index.css` is unchanged.
  - **Design tokens** are now [W3C Design Tokens (DTCG)](https://www.designtokens.org/) files in the repository (`packages/ui/tokens`: colours with light and dark modes, text styles, radius, effects), generated into the stylesheets and the Storybook Foundations pages with Terrazzo. No token value changed; the deprecated aliases keep working.

- [#163](https://github.com/holakirr/snow-ui/pull/163) [`7c55ef2`](https://github.com/holakirr/snow-ui/commit/7c55ef2dacd300f858ab57c7b5496991d54a4423) Thanks [@holakirr](https://github.com/holakirr)! - Localization, right-to-left support and `asChild` composition.

  **`SnowUIProvider`** (optional) sets `messages`, `locale` and `dir` for the components below it. `messages` translates every built-in string — accessible names, screen-reader text, placeholders, empty states — and is typed: `Messages` (grouped by component, strings with values are functions), with the English `defaultMessages` as the default and `MessagesOverrides` for partial translations merged namespace by namespace (an `undefined` message keeps the default; an equal inline object keeps the context stable). `locale` (a date-fns or react-day-picker locale) localizes `Calendar` and the `Scheduler` labels; the Calendar's previous / next month buttons and their landmark are named by `messages.calendar` (`previousMonth`, `nextMonth`, `navigation`), whose English defaults give way to a react-day-picker locale's own labels. The provider is a client component: with React Server Components (Next.js App Router), render it from a `'use client'` module that imports the locale and messages (see the README). `dir` sets Radix's direction (keyboard navigation of Tabs, Slider, menus, RadioGroup, ToggleGroup, Accordion), `Calendar`'s arrow keys, the `start` / `end` sides of `Sheet` and `Sidebar`, and the `dir` of portalled content. Providers nest. `useMessages()` and `useSnowUI()` read them. A component's own label props win over the provider; new ones: `DialogHeader` / `SheetContent` `closeLabel`, `Tag` `removeLabel`, `BreadcrumbEllipsis` / `PaginationEllipsis` `label`, `CommandPalette` `loadingLabel`, `Slider` `thumbLabels`.

  **RTL:** the components use logical utilities (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`, `text-start`, `rounded-s-`/`rounded-e-`, `border-s`), so they mirror under `dir="rtl"`; directional icons (pagination, calendar, accordion, menu and link arrows, `SidebarTrigger`, icon breadcrumb separators) flip, the `Switch` thumb moves the other way, keyboard shortcuts (`KBD`) stay left-to-right and toasts are swiped to the left. New values: `Sheet` / `Sidebar` `side="start" | "end"` (the defaults: `end` for `Sheet`, `start` for `Sidebar`, the same sides as before in left-to-right text), `Tag` `shape="arrow-start" | "arrow-end"`, `Typography` `align="start" | "end"` (default `start`).

  **`asChild`** is the way to render a component as another element: new on `Button`, `Typography`, `IconText`, `ListItem`, `Link`, `BreadcrumbLink`, `PaginationLink`, `PaginationPrevious` and `PaginationNext`. The child gets the props, ref and composed event handlers, its classes are merged with `twMerge` (the child's win), and the component's content (label, icons) goes inside it. The `Sidebar` parts that had `asChild` now merge classes the same way. With `asChild` both your handlers run (the child's first), as with Radix `Slot`; behaviour a component adds itself follows the Radix convention and is skipped when your handler calls `event.preventDefault()`: `SidebarTrigger` and `SidebarRail` no longer toggle then (and `SidebarRail` now calls your `onClick` too instead of losing its toggle to it). `Search` gains `onValueChange(value)`.

  **Deprecated** (they keep working, with a one-time development warning, and will be removed in the next major version):

  - `as` on `Button`, `Typography`, `IconText` and `ListItem`: use `asChild` and put element props on the child, `<Button asChild><a href="/">…</a></Button>`.
  - `leftContent` / `rightContent` on `Button`, `Tag` and `DialogHeader`: use `startContent` / `endContent`, which follow the text direction.
  - `onClose` on `Tag`: use `onRemove`.

  Also: the modules of `Badge`, `Breadcrumb`, `Link`, `Pagination` and `Tag` are now client components (`'use client'`), as they read the provider's context; the `BreadcrumbEllipsis` screen-reader text ("More pages") is no longer hidden from screen readers; `Pagination`'s default name is "Pagination" (was "pagination"); `Scheduler` formats its day, hour and cell labels with the provider's locale (en-US by default, so server and browser render the same text) instead of mixing en-US, ru-RU and the runtime's default. New dependency: `@radix-ui/react-direction`, pinned to the version the Radix primitives use (one direction context).

- [#155](https://github.com/holakirr/snow-ui/pull/155) [`e8b9bd6`](https://github.com/holakirr/snow-ui/commit/e8b9bd63dc58bbf58d0e16fa4aa64acd161dfcf9) Thanks [@holakirr](https://github.com/holakirr)! - Add the SnowUI Figma components that were missing:

  - `IconBox`: the Figma "Icon". Sizes an icon, avatar or image (`size` 12, 16, 20, 24, 28, 32, 40, 48, 80) and can put it on a Black/4% tile (`background`) with a `badge` (the Figma dot, or any node such as a count; `badgeLabel` for screen readers). Exports `ICON_BOX_SIZES`.
  - `IconText`: an icon or avatar plus text, with `vertical` and `flip`. `interactive` gives it the Figma "Frame" hover fill and `active` keeps the fill on. It is polymorphic (`as="a"`, `as="button"`).
  - `Group`: a row or column of items 8px apart (`vertical`, `reverse`, `gap`) with `role="group"`.
  - `Strip`: equal segments in a row or column (`count`, `vertical`, `thickness`, `rounded`). With `value` it is a segmented progress bar (`role="progressbar"`, or pass `role="meter"`).
  - `Search`: the Figma search field (`variant` `gray` / `outline`, `size` `sm` / `lg`) with a search icon, a shortcut hint (`shortcut`) and a clear button. Clearing (button or Escape) calls `onChange` with an empty value and `onClear`. Exports `searchStyles`, for example to style a button that opens the CommandPalette.
  - `CommandPalette`: the Figma "SearchPopup", built on Radix Dialog. It shows a search combobox over a grouped listbox (`groups`, `onSelect`, `filter`, `emptyMessage`, `loading`, `hotkey`, a controlled or uncontrolled `open` and `query`). Use ↑ / ↓ to move, Enter or a click to select and Escape to close. No new dependencies.
  - `ListItem`: a row of the dashboard Notifications / Activities / Contacts lists (`icon`, `title`, `description`), built on `IconText`.

  Storybook has a new "Recipes/Dashboard" story that composes these with `Sidebar`, `Breadcrumb`, `Card` and `Button` into the SnowUI dashboard layout.

- [#160](https://github.com/holakirr/snow-ui/pull/160) [`5de682c`](https://github.com/holakirr/snow-ui/commit/5de682cbc44526e603515e50e741bb0a20d7f9f9) Thanks [@holakirr](https://github.com/holakirr)! - Scoped themes: `data-theme="dark"` now works on any element, not only `<html>`. Its subtree gets the SnowUI-Dark token values (before, only `dark:` utilities switched and the tokens kept the page's values), and `data-theme="light"` inside a dark subtree switches back. See "Scoped themes" in the README.

  - The token values are declared on `:root, [data-theme="light"]`, on `[data-theme="dark"]` and, for the OS preference, on `:root:not([data-theme="light"])` in `@media (prefers-color-scheme: dark)`. Tokens built from other tokens (`primary-hover`, `primary-hover-strong` and the deprecated aliases such as `brand`, `bg1`, `foreground`) are re-declared in every scope so they follow it too. The deprecated `--black` / `--white` / `--brand` / `--bg*` channels follow the same scopes.
  - `color-scheme` is set to `light` or `dark` with the theme, so native form controls, scrollbars and the default page colours match. With the OS in dark mode and no `data-theme` on `<html>`, the page canvas and default text colour are now dark as well; pin `<html data-theme="light">` if your app has no dark mode.
  - The `dark:` variant no longer matches inside a `data-theme="light"` element nested in a dark scope.
  - Overlays (`Dialog`, `Popover`, `Select`, menus, `Tooltip`, `Sheet`, `CommandPalette`) are portalled to `<body>`, so they take the theme of `<html>`; pass `data-theme` to their `*Content` component to scope them.
  - `CommandPalette`: the loading spinner turns around its centre (it used to swing around the icon box).

### Patch Changes

- [#159](https://github.com/holakirr/snow-ui/pull/159) [`a69bd64`](https://github.com/holakirr/snow-ui/commit/a69bd64000276cd8ddf62579117a6019e988a4ec) Thanks [@holakirr](https://github.com/holakirr)! - Text fields (`Input`, `InputSmall`, `Textarea`) use the Figma "Focus" state exactly — a Black/40% stroke and the 4px Focus ring on any focus — instead of the `focus-ring` outline, which appeared on every mouse click in a text field. Other controls keep `focus-ring` for keyboard focus.

- [#166](https://github.com/holakirr/snow-ui/pull/166) [`de7fb8c`](https://github.com/holakirr/snow-ui/commit/de7fb8ce96f12e5ca4e3c42fbc0ac5d8213c02b5) Thanks [@holakirr](https://github.com/holakirr)! - Fixes found while writing the component docs.

  - **Toast:** a toast with an `action` no longer closes after the Toaster's 3 seconds: its `duration` defaults to `Number.POSITIVE_INFINITY`, so the user has as long as they need to reach the action (WCAG 2.2.1), and it keeps the close button it gets by default. Pass a `duration` to `toast()` to close it on a timer again; the Toaster's `duration` only applies to toasts without an action.
  - **IconText / ListItem:** a focusable row (an `asChild` link or button, `interactive` or `active` or not) shows the `focus-ring` of the other controls on keyboard focus. `interactive` rows had only the faint Figma "Focus" ring (Black/4%, 1.1:1) and no outline, and other links and buttons had no indicator of their own.
  - **Scheduler:**
    - Shows the week that contains `currentDate` when it falls before `startOfWeek` in its week (a Sunday with weeks starting on Monday showed the next week).
    - `onDateClick` gets the start of the clicked hour (`hh:00:00.000`); the minutes, seconds and milliseconds of `currentDate` leaked into it and into the cells' names.
    - An event that runs past midnight continues on the next day instead of overflowing the grid, and the part of an event that started the week before is shown.
    - The hours of the grid fit the events of the shown week only; an event that ends on the hour no longer adds an empty row, and one that ends at midnight or is shorter than its one-hour block near the end of the day no longer overflows the grid.
    - Around a daylight saving change, events are as tall as the hours they cover on the clock, and the hour labels no longer depend on today's date (on the day clocks spring forward, 2 AM read "3 AM").
    - The current time shows only in the week that contains today.
    - The hour cells are `<button>` elements next to the events instead of `role="button"` elements around them: a control inside a button isn't exposed to assistive technology (axe `nested-interactive`).
    - An event that ends before it starts is shown as having no duration (the minimum one-hour block).

- Updated dependencies [[`8266fe8`](https://github.com/holakirr/snow-ui/commit/8266fe8e17522c4e682f20ada86d0a4265e20708), [`b98db21`](https://github.com/holakirr/snow-ui/commit/b98db21adf0c16375e71d06f328d29223abc60e8)]:
  - @holakirr/snow-ui-icons@2.2.0

## 4.0.0

### Major Changes

- [#149](https://github.com/holakirr/snow-ui/pull/149) [`2576127`](https://github.com/holakirr/snow-ui/commit/25761274df7395ae159a7d561ff316c8f63d53d1) Thanks [@holakirr](https://github.com/holakirr)! - Upgrade `react-day-picker` to v10. `CalendarProps` extends `DayPickerProps`, so the props and APIs react-day-picker v10 removed are no longer accepted by `Calendar`:

  - `fromMonth` / `toMonth` / `fromYear` / `toYear` → `startMonth` / `endMonth` (e.g. `startMonth={new Date(2020, 0)}`); `fromDate` / `toDate` → `hidden={{ before: date }}` / `hidden={{ after: date }}`.
  - `initialFocus` → `autoFocus`.
  - `onDayKeyUp`, `onDayKeyPress`, `onDayPointerEnter`/`Leave`, `onDayTouch*` and `onWeekNumberClick` → a custom `DayButton` / `WeekNumber` in `components`.
  - The v8-style `classNames` keys (`DeprecatedUI`) and `components.Button` → the v9 `UI` keys and `PreviousMonthButton` / `NextMonthButton`.

  See the [react-day-picker upgrade guide](https://daypicker.dev/upgrading). `captionClassName` is deprecated in favour of `monthCaptionClassName` (it is merged into the month caption, as react-day-picker has no separate `caption` slot).

### Patch Changes

- [#149](https://github.com/holakirr/snow-ui/pull/149) [`2576127`](https://github.com/holakirr/snow-ui/commit/25761274df7395ae159a7d561ff316c8f63d53d1) Thanks [@holakirr](https://github.com/holakirr)! - Built with tsdown into a flat `dist` (`.js` + `.cjs`, with `.d.ts` + `.d.cts` declarations). `require('@holakirr/snow-ui')` now works: the Phosphor icons are bundled into the build instead of being required from `@phosphor-icons/react`, whose CommonJS file Node loads as ESM, so `@phosphor-icons/react` is no longer a dependency. CommonJS consumers get matching `.d.cts` type declarations.
- Updated dependencies [[`2576127`](https://github.com/holakirr/snow-ui/commit/25761274df7395ae159a7d561ff316c8f63d53d1)]:
  - @holakirr/snow-ui-icons@2.1.1

## 3.0.0

### Breaking changes

- The library no longer depends on `react-hook-form`. `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription` and `FormMessage` from the main entry are library-agnostic: pass `error` / `invalid` to `FormItem`, or provide them with the new `FormFieldState`. `Form` is now a plain `<form>` wrapper.
- `FormField` and the react-hook-form `Form` (`FormProvider`) moved to `@holakirr/snow-ui/react-hook-form`. Migrate by changing the import path; the API is unchanged. `react-hook-form` is now an optional peer dependency.

  ```diff
  - import { Form, FormField, FormItem } from '@holakirr/snow-ui'
  + import { Form, FormField, FormItem } from '@holakirr/snow-ui/react-hook-form'
  ```

### Dependencies

- `vite` 8, `@radix-ui/react-select` 2.3.7, `@radix-ui/react-slot` 1.3.3; GitHub Actions `checkout`/`setup-node` v7.

## 2.1.0

### Breaking-ish changes (check before upgrading)

- `react-hook-form` is now a **peer dependency** (`^7.60.0`), so `Form` and your `useForm` share one instance. npm, pnpm and bun install peers automatically; otherwise add it yourself.
- `tailwindcss` is no longer a peer dependency; `dist/index.css` is precompiled.
- **Button** no longer sets a default `aria-label="Button aria label"`, `role="button"`, `tabIndex` or `title`. `aria-label` comes from `label` only for icon-only buttons. `type="button"` is set only on a native `<button>`, so `as="a"` is a real link.
- The theme font token `--font-normal` was renamed to `--font-sans`, so `font-normal` is a font-weight utility again.
- `@holakirr/snow-ui-icons` upgraded to v2.

### Features

- New `BreadcrumbPage` and `DialogDescription` components.
- ContextMenu items accept `inset`, like DropdownMenu.
- Prop types are exported for all components (Accordion, Card, Toggle, Scheduler, Tabs, Toast, Form, …).
- Semantic color tokens (`background`, `foreground`, `muted`, `muted-foreground`, `accent`, `destructive`, `input`, `ring`, `sidebar-border`) are defined on top of the palette, including dark mode.
- Sidebar restores its open state from the cookie.

### Fixes

- **Packaging**: `dist` loads in plain Node. `require()` of the CJS build and `import` of the ESM build both used to fail. react-day-picker CSS is included in `index.css` instead of being imported from JS. `date-fns` is declared as a dependency, and `sideEffects` is set.
- **Input** forwards `ref` (react-hook-form can focus fields with errors), and controlled/uncontrolled handling is fixed.
- **Calendar** no longer crashes when switching the year in range/multiple mode. The nav buttons are keyboard reachable, the custom parts no longer remount on every render, and `className` can override the root styles.
- **Scheduler** shows events in the last hour and computes its hour range from the events. EventItem and the cells work with the keyboard.
- **Sidebar** widths work with Tailwind v4.
- **Typography** merges `className`, so e.g. `text-center` works.
- **Tag** `onClose` no longer fires twice on Enter. **Slider** renders a thumb per value.
- **Accessibility**: removed misleading hard-coded labels and roles (Breadcrumb, Card, KBD, Accordion, Table, Skeleton). The mobile Sidebar sheet has a title, and ToastClose has a label.
- Fixed animation class names, the Form field guard, the `useToast` subscription and several class typos. Form error text is red again.
