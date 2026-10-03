# Changelog

## 5.3.0

### Minor Changes

- [#223](https://github.com/holakirr/snow-ui/pull/223) [`1e05301`](https://github.com/holakirr/snow-ui/commit/1e05301f329ca0a4c0b53977d7b8bfa1ccf1b7ba) Thanks [@holakirr](https://github.com/holakirr)! - The kit's tables (Table A, Search results, loading data dynamically): new props and ready-made parts. Without them a table is unchanged.

  - `TableHead` gets `reveal`, the kit's "Select all" that shows only while the pointer is over the table (or while it has the focus, is checked or mixed, or has an open menu; always on touch screens), and `filtered`, the kit's filtered column: a 16px FunnelSimple 4px before the label, the label in black, and "Filtered" for screen readers before it.
  - A selected column: `data-state="selected"` on a `TableHead` and the `TableCell`s of its column gives them the row highlight (Black/4%), rounded 12px at the top of the header and the bottom of the last row; the header label turns black. With forced colours the cells get a 2px Highlight outline instead.
  - `TableSelectionBar`: the function bar "when data is selected": a 12px Black/10% divider, "2 Selected", and the Delete (Trash) and Duplicate (Copy) buttons for the handlers you pass (`onDelete`, `onDuplicate`), 8px apart, then your own actions. A `role="group"` named by its count; `deleteLabel` and `duplicateLabel` name the buttons, and `busy` makes them `aria-disabled` while an action runs, so they keep the focus.
  - `TableCopyButton`: a 16px ClipboardText button for a cell, shown while the pointer is over its cell or it has the keyboard focus (always on touch screens), with a 24px hit area. A click copies `value` with the Clipboard API, shows a check mark for 2 seconds, announces "Copied" and calls `onCopy`.
  - `TablePageSize`: the kit's "20 ∨" rows per page, a Radix Select with a small borderless trigger (12/16, ArrowLineDown 16 in `text-secondary`); `options` default to 20, 50 and 100, and a value that isn't one of them is added to the list; `value` / `defaultValue` / `onValueChange` take numbers; `name`, `form` and `required` make it a form field.
  - `TableResults`: the kit's "105 results", 12/16 `text-secondary` in a `role="status"` region, so a new count is announced.
  - `TableLoadMore`: the kit's "loading data dynamically", a 40px row under the table with a 16px spinner while `loading` ("Loading more" is announced); `onLoadMore` is called when it scrolls into view (an IntersectionObserver).
  - New optional messages namespace `table` (`filtered`, `selected`, `delete`, `duplicate`, `copy`, `copied`, `pageSize`, `results`, `loadingMore`), required in 6.0 like the 5.1 namespaces.

  The Table stories are now recipes of the kit's interactive guidance. Table A sorts and filters from the function bar's menus (the headers are text; the sorted one gets an arrow and `aria-sort`), shows "2 Selected" with Delete (a "Deleted" toast with Undo) and Duplicate (the copies go under the selection and are selected), copies addresses and has rows per page and the result count under it. New stories: Search results (the Search "In progress" until the results come), No results, LoadMore, ColumnSelection (a click on the blank area of a column, Ctrl / ⌘ and Shift, a click outside to clear) and SortableHeaders (`sortDirection` / `onSort`, unchanged). In the `@snow-ui` registry the `table` item now also installs `snow-ui-provider`, for the "Filtered" text.

## 5.2.0

### Minor Changes

- [#214](https://github.com/holakirr/snow-ui/pull/214) [`d225acd`](https://github.com/holakirr/snow-ui/commit/d225acd0872b34a586735ed2adba775e1fb44e50) Thanks [@holakirr](https://github.com/holakirr)! - `Badge` and `BadgeComponent` get `color`: `"indigo"` (the default, unchanged) or `"red"`, the kit's red badge. The red dot is Secondary/Red; the red number is the per-mode `white` on `red-text` (5.21:1, 8.65:1 in dark mode) instead of the kit's white on Secondary/Red (3.36:1). New type: `BadgeColor`.

- [#214](https://github.com/holakirr/snow-ui/pull/214) [`cf55314`](https://github.com/holakirr/snow-ui/commit/cf55314ffddbe032e7a31654103975455775425a) Thanks [@holakirr](https://github.com/holakirr)! - `Button` gets `loading`, the kit's loading state (Guidance → Form): the content stays in place but invisible, so the button keeps its size and its accessible name, and Spinner's ring turns in the middle, the size of the button's icon (12/16/20px, 16/20/24px icon-only) in its text colour. A Filled button turns Gray (Black/4%) as in the kit; the others keep their fill, without hover or the press scale. The button gets `aria-busy` and `aria-disabled`, stays focusable, and ignores clicks, Enter and Space (no `onClick`, no form submission, no navigation with `asChild` and a link). Opt-in: nothing changes without it.

- [#215](https://github.com/holakirr/snow-ui/pull/215) [`b265ef6`](https://github.com/holakirr/snow-ui/commit/b265ef6f9c75111cfed279fcb4c190b35566d94b) Thanks [@holakirr](https://github.com/holakirr)! - `CommandPalette`: the kit's search results, opt-in.

  - `showCount` shows the number of results above the list while there is a query ("105 results", 12/16 `text-secondary`), in a polite live region; `resultCount` sets the number when the list holds only some results. New optional message `commandPalette.results(count)` ("1 result", "105 results"), required in 6.0.
  - `highlightMatches` marks the words of the query in each label and snippet with `<mark>`, in `indigo-text` (the kit's Secondary/Indigo, 5.37:1; 4.91:1 on the highlighted option). In dark mode it is mixed with 30% white (6.47:1, 4.78:1), as #ADADFB is 3.78:1 on the highlight. In forced-colors mode the matches take the system `Mark`. The options' names are unchanged.
  - An item's new `snippet` is a second line under the label (12/16 `text-secondary`), such as the text on the page that matched; it is the option's description, and `defaultCommandPaletteFilter` matches it too.

  Without these props the palette is unchanged.

- [#215](https://github.com/holakirr/snow-ui/pull/215) [`6426f82`](https://github.com/holakirr/snow-ui/commit/6426f8268b334f5df2c0c0bcb80c0bf345b49b80) Thanks [@holakirr](https://github.com/holakirr)! - `DropdownMenu`: a search field at the top of the menu (the kit's Popover search), opt-in with the new `search` prop on `DropdownMenuContent` (`true`, or `DropdownMenuSearchOptions`: `query`, `defaultQuery`, `onQueryChange`, `filter`, `label`, `placeholder`, `emptyMessage`). Without `search` the menu is unchanged.

  - The kit's gray Search (28px high, 4/8 padding, a 16px radius) in a 44px row with 8px of padding; the items scroll under it.
  - Typing filters the items, checkbox and radio items and sub triggers by their text (`textValue`, or their children's text): every word of the query, in any case (`defaultDropdownMenuSearchFilter`). While filtering, labels and separators are hidden; a submenu isn't filtered.
  - The field takes the focus when the menu opens. Typing in it doesn't trigger the menu's typeahead; ArrowDown / ArrowUp move to the first / last item, ArrowUp on the first item goes back to the field, a letter typed on an item goes to the field, and Escape clears the field before it closes the menu (an Escape that cancels an IME composition does neither).
  - The field and the empty state ("No results", in a polite live region) are next to the `role="menu"` list, which keeps the menu's name and orientation: a menu may only contain items.
  - New optional messages namespace `dropdownMenu` (`search`, `empty`), required in 6.0 like the 5.1 namespaces.

- [#211](https://github.com/holakirr/snow-ui/pull/211) [`bed28d5`](https://github.com/holakirr/snow-ui/commit/bed28d5f53f97f23d8a71fea085a571f86b81b84) Thanks [@holakirr](https://github.com/holakirr)! - Invalid text fields get the kit's Error icon. An `Input` or `Textarea` with `aria-invalid="true"` (as `FormControl` sets it) shows a 16px `Warning` icon at the end, next to the red stroke it already had. The icon is decorative: `aria-invalid` and the `FormMessage` tell the error.

  - `Input`: an element after the end content, in the stroke's colour (`control-border-invalid`: Secondary/Red, `red-text` with more contrast). If you already put an error icon in `endContent`, hide the new one with `className="[&_[data-slot=input-invalid-icon]]:hidden"`.
  - `Textarea`: a background image at the end of the first row, so the `<textarea>` gets no wrapper. While invalid the text stops 40px from the end instead of 16px, so lines may rewrap, and your own background image is covered. Turn it off with `className="aria-invalid:bg-none aria-invalid:pe-4"`. It stays Secondary/Red with more contrast.
  - `FormLabel` now stays `text-secondary` on an invalid field, as the kit's title does; it turned `red-text` before.

  Select, Combobox, InputSmall and Search keep the stroke without an icon, as the kit draws them.

- [#217](https://github.com/holakirr/snow-ui/pull/217) [`ef0afcd`](https://github.com/holakirr/snow-ui/commit/ef0afcd1c6667b74fe7a43d1ba9de59df99eabf5) Thanks [@holakirr](https://github.com/holakirr)! - The kit's In progress and Done field states, opt-in: `status` on `Input` (`"progress" | "success"`, type `InputStatus`) and on `Search` (`"progress"`).

  - `Input`: `progress` shows the turning ring of `Spinner` in Black/100% after the end content (an invalid field's Warning hides while it turns) and sets `aria-busy="true"` on the input; `success` shows a 16px `Check` in Secondary/Green (green mixed with 40% black with more contrast: 4.4:1), hidden while the field is invalid. A visually hidden `role="status"` region announces a change of status: "Checking" and "Valid" (the new optional `messages.input.progress` and `messages.input.success`), or `statusLabel`.
  - `Search`: `progress` shows the ring in place of the clear button or the shortcut hint and sets `aria-busy="true"`; your results region announces the results. An `aria-busy` of your own is kept without a status.

  The ring stops turning for reduced motion, as Spinner's does. Without `status` nothing changes.

  The end of an `Input` reads: end content, status icon, clear button, Warning. The kit draws them one at a time, each 16px from the end; in this order each keeps that place in its own state, and a field never shows two status marks.

- [#217](https://github.com/holakirr/snow-ui/pull/217) [`4c6ec8a`](https://github.com/holakirr/snow-ui/commit/4c6ec8a6a046d0d14ddef937f0ed51453caf1604) Thanks [@holakirr](https://github.com/holakirr)! - `Input` gets the kit's clear button, opt-in: `clearable`. A focused field with a value shows a 16px `XCircle` (fill, Black/100%) at the end, as the kit's Focus state draws it (before the Warning of an invalid field); it hides while the field is empty, unfocused, disabled or read-only. A `type="search"` input's own clear button is hidden. Clearing sets the value the way typing does (an `input` event), so `onChange` fires with an empty value for controlled and uncontrolled fields and react-hook-form records it; `onClear` runs after, and the focus returns to the input. The button is a tab stop while it shows (Enter or Space clears), named by `clearLabel` or the new optional `messages.input.clear` ("Clear"; the `input` namespace is optional until 6.0, like those added in 5.1).

- [#215](https://github.com/holakirr/snow-ui/pull/215) [`7451a37`](https://github.com/holakirr/snow-ui/commit/7451a3783757fb89d95c82978e5f30033e12e397) Thanks [@holakirr](https://github.com/holakirr)! - `DropdownMenuItem` and `ContextMenuItem`: new `variant="destructive"` for an action that deletes or can't be undone (the kit's red "Delete Property" row). The text and the icons are `red-text` (#D42020: 5.21:1 on the popover, 4.77:1 on the highlighted item); in dark mode `red-text` is mixed with 40% white (#FFB3B3: 6.21:1, 4.59:1), since #FF8080 is 3.22:1 on the White/10% highlight. A disabled one is dimmed like the others; the item gets `data-variant="destructive"`. Without `variant` (`'default'`) items are unchanged.

- [#215](https://github.com/holakirr/snow-ui/pull/215) [`9860013`](https://github.com/holakirr/snow-ui/commit/9860013919277078872a444a1ee8a175e55a6cac) Thanks [@holakirr](https://github.com/holakirr)! - New `DropdownMenuSwitchItem` and `ContextMenuSwitchItem`: a checkbox item that ends in the kit's Switch instead of a check (the kit's "Wrap Column" row). The Switch look is drawn from the item's state: a 28×16 track (`control-border` off, `primary` on, Black/10% / Black/20% when disabled) and a 12px thumb that moves to the end (to the left in right-to-left text); in forced-colors mode the track and the thumb are outlined. The item stays a `menuitemcheckbox` with `aria-checked`; the switch is `aria-hidden`, not a control inside the menu item. It takes a checkbox item's props with a boolean `checked` / `onCheckedChange`; `event.preventDefault()` in `onSelect` toggles it without closing the menu. A `DropdownMenuContent` `search` filters it like the other items.

- [#214](https://github.com/holakirr/snow-ui/pull/214) [`0d06e18`](https://github.com/holakirr/snow-ui/commit/0d06e186110490b7ac5a09392895390196bd37d9) Thanks [@holakirr](https://github.com/holakirr)! - `TabsList` gets `variant="filled"`: the kit's segmented control with a Filled active item ("Daily / Weekly / Monthly" in the Button and Group docs). The Pill track and items, with the active item a Filled button: Primary with the per-mode `white` label (white on black, black on the dark-mode indigo, 10.15:1); the others Borderless in `text-secondary`. Keyboard behaviour is unchanged.

- [#214](https://github.com/holakirr/snow-ui/pull/214) [`c7552af`](https://github.com/holakirr/snow-ui/commit/c7552af23006003af66803d3aad3df91a8df525d) Thanks [@holakirr](https://github.com/holakirr)! - `TabsList` gets `underline`: `"full"` (the default, unchanged) or `"short"`, the kit's short underline from the Line docs — a rounded Primary dash, 6×3px, centred under the active `line` tab's label, 6px below it. The tabs get 3px taller with it. The segmented variants ignore it. New type: `TabsUnderline`.

- [#214](https://github.com/holakirr/snow-ui/pull/214) [`16832b4`](https://github.com/holakirr/snow-ui/commit/16832b40feb4db9af8208eccfcd3d1269745e4bf) Thanks [@holakirr](https://github.com/holakirr)! - `Toggle` and `ToggleGroup` get `variant="filled"`, the toggle counterpart of `TabsList variant="filled"`: a `ToggleGroup` puts its items on the Pill track (the same padding, gap and radius), and an item that is on is a Filled button, Primary with the per-mode `white` label (white on black, black on the dark-mode indigo, 10.15:1), which hover and focus keep. Off, the items are Borderless in `text-secondary`, as before. `ToggleVariant` and `TOGGLE_VARIANTS` include `filled`; keyboard behaviour is unchanged.

- [#215](https://github.com/holakirr/snow-ui/pull/215) [`52e0dad`](https://github.com/holakirr/snow-ui/commit/52e0dadbe02144f988211954b6d1dcda47623557) Thanks [@holakirr](https://github.com/holakirr)! - `Tooltip`: the kit's rich, multi-line tooltip, with the new `TooltipTitle` (a 12/16 semibold `<p>`) and `TooltipDescription` (a 12/16 `<p>`). With either inside `TooltipContent`, the content stacks them, start-aligned and 4px apart, with an 8px radius, and wraps at 280px; tooltips without them are unchanged. The trigger's description reads the title and the text with a space between them. Text only, like any tooltip: for links or buttons, use a Popover.

## 5.1.1

### Patch Changes

- [#205](https://github.com/holakirr/snow-ui/pull/205) [`46b0dc0`](https://github.com/holakirr/snow-ui/commit/46b0dc0ad1e8387d4923713626c592542964f8fd) Thanks [@holakirr](https://github.com/holakirr)! - The `AccordionTrigger` arrow is `text-secondary` at rest and black when the trigger is hovered or focused from the keyboard, as the kit's small chevrons (Black/20% at rest in the kit, which is 1.6:1, so `text-secondary` as the library's other chevrons). It was black in every state.

- [#205](https://github.com/holakirr/snow-ui/pull/205) [`46b0dc0`](https://github.com/holakirr/snow-ui/commit/46b0dc0ad1e8387d4923713626c592542964f8fd) Thanks [@holakirr](https://github.com/holakirr)! - `Avatar` hover, in a link or a button, now follows the kit's Component state as read in Figma: a photo zooms in (×1.125 inside the round clip) instead of getting a `color-1` underlay, and initials grow from 12 Regular to 14 Semibold (by 14/12 in the bigger avatars) on a lighter fill: White/40% layered over `color-2`, or over a fill you set with `className`. The icon fallback's Black/20% fill is unchanged; the zoom has no transition with reduced motion.

- [#205](https://github.com/holakirr/snow-ui/pull/205) [`46b0dc0`](https://github.com/holakirr/snow-ui/commit/46b0dc0ad1e8387d4923713626c592542964f8fd) Thanks [@holakirr](https://github.com/holakirr)! - `BreadcrumbPage` shows the arrow cursor. Its `aria-disabled` gave it the not-allowed cursor of disabled controls, but the current page isn't disabled, and the kit's disabled cursor is the arrow too.

- [#205](https://github.com/holakirr/snow-ui/pull/205) [`46b0dc0`](https://github.com/holakirr/snow-ui/commit/46b0dc0ad1e8387d4923713626c592542964f8fd) Thanks [@holakirr](https://github.com/holakirr)! - `Calendar` and the date pickers' month, year and time views in dark mode: today (the current month, year or hour), unless selected, has no fill, only indigo text (white on hover) and its dot. A selected day is indigo in dark mode, so a selected today and an unselected one looked the same (indigo with the dot); now only the selected one is filled. The light theme and forced colours are unchanged. If you restyle today with `todayClassName`, also override its `dark:` classes (`dark:not-aria-selected:[&>button]:bg-transparent` and `dark:not-aria-selected:[&>button]:text-indigo`), which otherwise keep a dark today unfilled.

- [#206](https://github.com/holakirr/snow-ui/pull/206) [`aa6505c`](https://github.com/holakirr/snow-ui/commit/aa6505c0eb3a5a7b5a7bd6c742fe05500c38002c) Thanks [@holakirr](https://github.com/holakirr)! - The `arrow` variant of `Link` draws its arrow as a 12px Phosphor `ArrowUpRight` icon, like the `external` variant's icon, instead of the "↗" text character, whose shape and width changed with the font. It stays decorative (`aria-hidden`), at 40% opacity, full on hover and with more contrast, and mirrored in right-to-left text. The link's text content no longer ends with "↗".

- [#205](https://github.com/holakirr/snow-ui/pull/205) [`46b0dc0`](https://github.com/holakirr/snow-ui/commit/46b0dc0ad1e8387d4923713626c592542964f8fd) Thanks [@holakirr](https://github.com/holakirr)! - Menu group titles and dividers match the kit. `DropdownMenuLabel`, `ContextMenuLabel`, `SelectLabel` and the `Combobox` and `MultiSelect` group titles are 14/20 (the kit's SearchPopup group title) instead of 12/16, still `text-secondary` and 28px high. `DropdownMenuSeparator`, `ContextMenuSeparator` and `SelectSeparator` are a 1px Black/4% line, 7px under the item above and 8px over the item below (the kit's item group: 8px padding and a 1px stroke inside its bottom edge), instead of 0.5px Black/10% with 8px on each side: 16px between two groups instead of 16.5. With more contrast the line is `black-20`, and with forced colours the system GrayText, so it no longer disappears.

- [#206](https://github.com/holakirr/snow-ui/pull/206) [`aa6505c`](https://github.com/holakirr/snow-ui/commit/aa6505c0eb3a5a7b5a7bd6c742fe05500c38002c) Thanks [@holakirr](https://github.com/holakirr)! - `SidebarGroupLabel` is `text-secondary` instead of `black-80`, the colour of the Dashboard recipe's section headings and of the library's other secondary text: one colour for the kit's Black/40% headings, which are 2.85:1. It is 5.74:1 in light mode and 7.08:1 in dark mode on the page (Background/1), at least 5.65:1 and 6.42:1 on the inset variant's Background/2.

## 5.1.0

### Minor Changes

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`e827405`](https://github.com/holakirr/snow-ui/commit/e82740546718501c68a74bbf6437477071bd8910) Thanks [@holakirr](https://github.com/holakirr)! - Badge and Avatar fixes:

  - **`Badge`'s `className` now goes on its wrapper**, like its other props and every other component's `className`; it went on the dot or number. Style the badge itself with the new `badgeClassName`: replace `<Badge className="bg-red">` with `<Badge badgeClassName="bg-red">`.
  - `AvatarGroup` merges `className` into its row classes (`twMerge`) instead of replacing them, so `className="justify-center"` no longer drops the flex layout and the overlap.
  - `AvatarGroup`'s "+N" avatar is read as "N more" by screen readers (`messages.avatarGroup.more(count)`, a new message; the visible "+N" is hidden from them).
  - `AvatarFallback`'s initials grow with the avatar: 37.5% of its width, at least 12px (12px at `sm` and `md`, 24px at `lg`). They were 12px at every size. The avatar is a size container (`@container`), so an avatar resized by its parent (an `IconBox` slot) gets initials that fit.
  - New message namespaces: `avatarGroup` and `charts` (the built-in strings of `@holakirr/snow-ui-charts`). They are optional in the `Messages` type, so a translation typed as `Messages` for 5.0 still compiles (the English defaults fill them in); `useMessages()` and `defaultMessages` are typed `Required<Messages>`, with every namespace.

- [#178](https://github.com/holakirr/snow-ui/pull/178) [`d3490f4`](https://github.com/holakirr/snow-ui/commit/d3490f45532410dc4fe2c25578ee7199c113ae2e) Thanks [@holakirr](https://github.com/holakirr)! - New **`Combobox`**: a text field with a list of options that filters as the user types, for picking one value out of many (countries, time zones, people). It looks like the Input field with the Select menu and follows the WAI-ARIA combobox pattern: focus stays in the field and the highlighted option is its `aria-activedescendant`; ↓ / ↑ open the list and move the highlight, Enter or a click picks, Escape closes the list and then clears the field.

  - `options` flat or in titled groups (`{ label, options }`), each `{ value, label, icon?, keywords?, disabled? }`; `defaultComboboxFilter` matches every word in the label or the keywords, `filter` takes your own, `filter={false}` + `onQueryChange` + `loading` serve results from a server.
  - `creatable` + `onCreate(query)` offer 'Create "query"'; `clearable` (on by default) shows a clear button; empty and loading messages are shown and announced.
  - `value` / `defaultValue` / `onValueChange` (strings, `null` for none) and `open` / `defaultOpen` / `onOpenChange`. Input props (`id`, `aria-*`, `onBlur`, `ref`) go to the `<input>`, so it works in `FormControl` and with react-hook-form (`field.ref` focuses it on errors); `name` submits the value with a hidden input; `aria-invalid` gives it a red stroke.
  - Right-to-left aware, with its strings in the new `messages.combobox` namespace (`empty`, `loading`, `clear`, `create(query)`, `selected(labels)`, `removed(label)`). The namespace is optional in the `Messages` type (English defaults fill it in; `useMessages()` returns `Required<Messages>`), so a full translation typed as `Messages` for 5.0 keeps compiling.
  - **Forms:** `name` submits the picked value (not the typed text) with a hidden input that follows `form="id"` and is disabled with the field; `required` blocks native submission while nothing is picked, also when text was typed ("Select an item in the list.", `messages.combobox.required`); Enter never submits the form while the list is open; a form reset (`form.reset()`, a reset button, React 19's form actions) brings back the initial value (a controlled field gets `onValueChange` with it; a reset cancelled in `onReset` changes nothing). A custom validity message set by the app stays.
  - `disabled` or `readOnly` closes an open list (with `onOpenChange(false)` and `onQueryChange('')`) and takes no picks; the Enter that commits an IME composition in Safari doesn't pick an option; the clear button has the `focus-ring` outline.

- [#173](https://github.com/holakirr/snow-ui/pull/173) [`019f6d5`](https://github.com/holakirr/snow-ui/commit/019f6d5d936d9d1cbb9fd87462b883a46e47cdd5) Thanks [@holakirr](https://github.com/holakirr)! - Dark mode also follows the `dark` class, and `theme.css` no longer needs an `@source`.

  - **`.dark` / `.light` classes.** The theme scopes and the `dark:` variant now accept the `dark` and `light` classes next to `data-theme="dark"` / `"light"`, on `<html>` or on any element. Apps that switch themes with a class (next-themes with `attribute="class"`, shadcn/ui) get the SnowUI dark tokens without also setting `data-theme`. The OS preference now applies only when `<html>` sets no mode: `data-theme`, or the `light` / `dark` class. Nothing changes for apps that use `data-theme`. If you redeclare tokens for the OS preference, use the new selector `:root:not([data-theme], .light, .dark)` (see Theming → Changing a token).
  - **`theme.css` registers its own `@source`.** The published `theme.css` adds the package's built components to Tailwind's sources, relative to its own file, so Tailwind v4 projects only need `@import "tailwindcss"; @import "@holakirr/snow-ui/theme.css";`. The `@source "../node_modules/@holakirr/snow-ui/dist"` line, which broke when node_modules wasn't next to the stylesheet (monorepos, pnpm), is no longer needed; keeping it does no harm.

- [#178](https://github.com/holakirr/snow-ui/pull/178) [`86fb8ee`](https://github.com/holakirr/snow-ui/commit/86fb8eed17a42801008bffefb0b0278b9c4d3c53) Thanks [@holakirr](https://github.com/holakirr)! - New **`DatePicker`**: a form field for a date (and a time) that opens the Figma DatePicker in a popover. The field looks like the Select trigger with a calendar icon; it is a `<button role="combobox">` that opens a modal dialog with focus on the picked day (or today). The arrow keys move between days, Enter picks one and closes the calendar, Escape closes it without a change; ↓ on the field opens it, Backspace or Delete clears it.

  - **The Figma popup**, 360×360 with a five-week month: a top area with the date typed by parts in the locale's order ("10 / 22 / 2026", "22 . 10 . 2026" in Russian), as React Aria's DateField — each part a spinbutton that digits fill and the arrow keys step, Backspace empties, Enter confirms; today, dimmed, while there is no date. A typed date that can't be picked (`minDate`, `maxDate`, `disabledDates`) turns red and isn't taken. Then "Today" and "Last selection" (the value when it opened), the short month ("‹ Feb ›", a button to the months) and the days. The month and the year of the top area open the months and years grids ("This month", "This year", "‹ 2026 ›", "‹ Back"). Closing the popover confirms the date (Enter in the top area, a click outside, a picked day); Escape cancels.
  - **Time:** `withTime` (the Figma "Date and time" type) adds the time to the top area ("04 : 08 AM") and `withSeconds` the seconds; `hourCycle` is 12 or 24 (the locale's by default: 12 in English, 24 in Russian). Its parts open the hours, minutes and seconds grids ("System time", AM / PM); 13 typed into a 12-hour hour is 01 PM. A picked day keeps the time and the popover open. The field shows "Jan 20, 2025, 4:08 PM" and a form gets `2025-01-20T16:08`.
  - **`title`:** the Figma "2 row" field of a form, the title inside the field above the date; it names the field.

  - `value` / `defaultValue` / `onValueChange` (a `Date`, `null` once cleared) and `open` / `defaultOpen` / `onOpenChange`.
  - `minDate`, `maxDate` and `disabledDates` (react-day-picker matchers) limit the days; `calendarProps` passes any other `Calendar` prop (`captionLayout`, `showTodayButton`…).
  - The date is formatted with date-fns (`dateFormat`, `"PP"` by default) in `SnowUIProvider`'s `locale` (or the `locale` prop); the week starts on Monday, as in `Calendar` (`weekStartsOn`, or `SnowUIProvider`'s, sets another day). `clearable` (on by default) shows a clear button.
  - Button props (`id`, `aria-*`, `onBlur`, `ref`) go to the trigger, so it works in `FormControl` and with react-hook-form; `name` submits the date as `yyyy-MM-dd` with a hidden input; `aria-invalid` gives it a red stroke; `required` sets `aria-required`.
  - Right-to-left aware (the typed date reads left to right), with its strings in the new `messages.datePicker` namespace (`placeholder`, `dialog`, `clear`; the top area's `date`, `time`, `year`, `month`, `day`, `hour`, `minute`, `second`, `dayPeriod`, `empty`; the views' `thisMonth`, `thisYear`, `systemTime`, `back`, `chooseMonth`, `chooseYear`, `previousYear`, `nextYear`), optional in the `Messages` type like `messages.combobox`, so a full translation typed as `Messages` for 5.0 keeps compiling.

  The deprecated `DatePickerType` and `RangePickerType` types are unrelated to it and unchanged.

  **Forms:** `name` submits `yyyy-MM-dd` (empty with no date) with a hidden input that follows `form="id"`; `required` blocks native submission while there is no date; a form reset brings back the initial date (a controlled field gets `onValueChange` with it; a reset cancelled in `onReset` changes nothing); `onInvalid` gets the `invalid` event of a `required` field. An `Invalid Date` value counts as no date; picking the same day again calls nothing; disabling the field closes the calendar with `onOpenChange(false)`; a month with no day to pick focuses the month navigation.

- [#178](https://github.com/holakirr/snow-ui/pull/178) [`42d0e21`](https://github.com/holakirr/snow-ui/commit/42d0e2139fca07cb04022ddb2dc1fb645e5d0fcd) Thanks [@holakirr](https://github.com/holakirr)! - New **`DateRangePicker`**: the `DatePicker` field for a range of dates, with the `Calendar` in range mode. Every time the calendar opens a new range starts: the first pick is the start, the second the end (the two are put in order), and the calendar closes; while the end is being picked the range follows the pointer, and closing after one pick keeps the previous range. `value` / `defaultValue` / `onValueChange` take a `DateRange` (`{ from, to }`, re-exported from react-day-picker) or `null`; `numberOfMonths` shows several months (one by default); `name` submits an ISO 8601 interval (`2025-01-13/2025-01-16`). The top area shows the start and the end ("10 / 22 / 2026 – 10 / 29 / 2026"), the one being picked in black and the other dimmed; the active one switches by itself (start, then end), and clicking the other one picks it instead, keeping the date already there. `withTime` (the Figma "Date range and time" type) adds the time of the date being picked; a picked end keeps the popover open to set it, and a form gets `2025-01-13T09:30/2025-01-16T18:00`. The field writes a range within one month with the month and the year once, as the kit's formats do: "Feb 2 – 10, 2026" (the locale's order and dash from `Intl.DateTimeFormat#formatRangeToParts`, so "2–10 фев. 2026 г." in Russian); other ranges show two full dates, "Feb 2, 2026 – Mar 3, 2026", and a one-day range that day; a `dateFormat`, `withTime` or your own `messages.datePicker.range` joins two dates in the `dateFormat` with `range(start, end)`. Limits, the typed dates, the views, the date format, localization, `title`, forms and right-to-left text work as in `DatePicker`; its strings are `rangePlaceholder`, `rangeDialog`, `range(start, end)`, `startDate`, `endDate`, `startTime` and `endTime` in `messages.datePicker`.

  **Forms and edge cases:** `name` submits the interval `yyyy-MM-dd/yyyy-MM-dd`, or nothing for no range or a range without an end (shown as "Jan 20, 2025 – …"); `required` blocks native submission until both ends are set; a form reset drops a half-picked range and brings back the initial range; picking a range with the same days again calls nothing. **`excludeDisabled`** keeps disabled days out of a range: an end past one starts a new range there. With a controlled `open` that stays `true`, every range starts anew; picking the same range again calls nothing.

- [#193](https://github.com/holakirr/snow-ui/pull/193) [`657b611`](https://github.com/holakirr/snow-ui/commit/657b611e5b1de869474c2a7c32fe7c89c6d57a24) Thanks [@holakirr](https://github.com/holakirr)! - Closer to the SnowUI Figma kit (design fixes; no props removed):

  - **Pagination:** the current page is the kit's Button "Gray", a Black/4% fill without the 0.5px Black/10% stroke the other pages ("Outline") keep. The item size (24px, radius 12) and the 8px gap already matched.
  - **Sidebar:** `SidebarMenuButton` has the Figma nav item's 4px gap (it was 8px), and `SidebarMenuSub` is indented without the start-side line (the kit's sub-items have none).
  - **DropdownMenu and ContextMenu:** the check mark of checkbox and radio items sits at the end of the item, like Select's (the kit's selected item: text, then a 16px Check); it was at the start. Radio items show the same check in both menus (a dot in DropdownMenu, a 6px dot in ContextMenu before). `inset` still adds its start padding: drop it from items and labels that used it only to line up with the old start-side mark, or they are now indented past the check items' text.
  - **ContextMenu:** `ContextMenuSubTrigger` ends in the kit's 16px `ArrowLineRight` chevron, as in DropdownMenu (it was an arrow with a shaft).
  - **Dialog:** the close button of `DialogHeader` has the kit's radius 12 (Button Medium "Gray", icon-only), not 16. The `startContent` slot is at least 40px wide instead of exactly 40px, so it fits the kit's 48px "Add data" icon without overflowing or shrinking under a long title (the kit's plus is 36px; our `AddIcon` at size 48 draws a 30px one, our icon set's inset); a 40px or smaller start element lays out as before.
  - **Table:** new `TableToolbar`, the kit's table function bar (a Background/2 strip at least 44px high, with radius 12, padded 8px, its children 16px apart) for the add, filter and sort buttons and a Search, and `TableCell`'s `reveal`, which shows a cell's elements only while their row is hovered or selected, or while they hold the focus, a checked checkbox or an open menu (the kit's row checkbox and "…" action; always shown on devices without hover). Existing tables are unchanged.

- [#180](https://github.com/holakirr/snow-ui/pull/180) [`0a49226`](https://github.com/holakirr/snow-ui/commit/0a4922632f79e376149a7b9421841211084551ae) Thanks [@holakirr](https://github.com/holakirr)! - A high-contrast mode for the form controls, which meets WCAG 2.2 AA in both themes while the default keeps the SnowUI Figma look:

  - It turns on with the OS setting `prefers-contrast: more` (macOS and iOS "Increase contrast"), unless `<html data-contrast="standard">`, and inside any element with `data-contrast="more"` (for your app's own setting). `data-contrast="standard"` switches a subtree back. Contrast and theme scopes combine at any depth: a `data-theme="dark"` panel in a high-contrast page gets the dark high-contrast values.
  - New colour tokens, generated from the DTCG tokens like the others (the resolver has a new `contrast` modifier): `control-border` (unchecked Checkbox and Radio rings, text field and Select strokes, the Switch's off track), `control-border-strong` (their hover and focus states, the Slider thumb border) `placeholder` (native placeholders and the Search icon) and `control-border-invalid` (the stroke of an invalid control). By default they are the Figma Black/20% and Black/40% and Secondary/Red, so nothing changes; with more contrast they are Black/50%, Black/80%, Black/60% (White/50%, White/80% and White/75% in dark mode) and `red-text`: at least 3:1 for boundaries and 4.5:1 for placeholders.
  - With more contrast the 0.5px field strokes are 1px, the gray `InputSmall` and `Search` fields get a stroke, the Switch thumb is the per-mode `white` (black on the dark-mode indigo track, 10.14:1 instead of 2.06:1), the highlighted menu item (DropdownMenu, ContextMenu, Select) and CommandPalette option get a 2px `black-80` ring, and the Link arrow and external icon are fully opaque (40% by default).
  - `theme.css` redefines the `contrast-more:` variant to follow the same scopes, like `dark:` (Tailwind's reads only the OS preference).

  If you override `--color-black-20` or `--color-black-40` to restyle these controls, override their levels instead, in your theme scopes: `--color-control-border--standard` (the default contrast) and `--color-control-border--more` (more contrast), and the same for the other three tokens. Don't set `--color-control-border` itself: it is computed from the two levels in every theme and contrast scope, so a value of yours would lose one of them.

- [#194](https://github.com/holakirr/snow-ui/pull/194) [`62dcb60`](https://github.com/holakirr/snow-ui/commit/62dcb602cbd4df6ebe821e1910b9692d7e2eb403) Thanks [@holakirr](https://github.com/holakirr)! - **Input:** `titleLayout="horizontal"` gives the Figma "2 row horizontal" field: the `title` at the start of one 44px row and the value aligned to the end (`vertical`, the default, keeps the title above the value). The Figma Code Connect template maps the "2 row horizontal" type to it.

- [#202](https://github.com/holakirr/snow-ui/pull/202) [`76307d9`](https://github.com/holakirr/snow-ui/commit/76307d999a2fe075d9b08f6cc0516543309407bf) Thanks [@holakirr](https://github.com/holakirr)! - Submenu items of `DropdownMenu` and `ContextMenu`:

  - The chevron at the end of `DropdownMenuSubTrigger` and `ContextMenuSubTrigger` is `text-secondary` (Black/60%, White/70% in dark mode), as the Select chevron, instead of black: lighter, as in the kit, and still 3:1 or more in both themes (at least 5.5:1 light, 4.82:1 dark, on the highlighted item too). The kit's Black/20% is 1.6:1. It dims with a disabled item.
  - New `hint` prop on both: the submenu's current value (the kit's value hint, such as "Multi-Select"), in 12/16 `text-secondary` text 8px before the chevron. It is part of the item's accessible name. Without it the item is unchanged.

- [#178](https://github.com/holakirr/snow-ui/pull/178) [`d3490f4`](https://github.com/holakirr/snow-ui/commit/d3490f45532410dc4fe2c25578ee7199c113ae2e) Thanks [@holakirr](https://github.com/holakirr)! - New **`MultiSelect`**: a `Combobox` that picks several values, shown as removable `Tag`s in the field. Enter or a click toggles the highlighted option and the list stays open (`aria-multiselectable`); Backspace in the empty field removes the last tag, and each tag has a remove button. The picked options describe the field for screen readers ("Selected: …", `messages.combobox.selected`) and removals are announced (`messages.combobox.removed`). `value` / `defaultValue` / `onValueChange` take arrays of strings; filtering, groups, server results, `creatable`, `clearable`, forms (`ref`, `name` with one hidden input per value, `aria-invalid`) and right-to-left text work as in `Combobox`.

  **Forms:** `name` submits one hidden input per picked value, following `form="id"`; `required` blocks native submission while no tag is picked ("Select at least one item in the list.", `messages.combobox.requiredMultiple`); a form reset brings back the initial values (a controlled field gets `onValueChange` with them; a reset cancelled in `onReset` changes nothing). A removal is announced once (it doesn't come back after "Loading" or "No results").

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`6441d12`](https://github.com/holakirr/snow-ui/commit/6441d12bba090be8e055b11103128eb56939d823) Thanks [@holakirr](https://github.com/holakirr)! - Pagination has a client-side mode. Give `Pagination` an `onPageChange(page)` and each item the `page` it goes to: `PaginationLink`, `PaginationPrevious` and `PaginationNext` without `href` render as `<button type="button">`s, so paging through state no longer needs `event.preventDefault()` on fake links. Items with both `href` and `page` stay links (new tab, no JavaScript) and a plain click calls `onPageChange` instead of navigating; modified and middle clicks, and links with a `target` or `download`, navigate as before. A disabled client-side button uses `aria-disabled`, and a disabled link stays focusable when `onPageChange` is set, so "next" disabled on the last page keeps the keyboard's focus. `ref` and the event handlers are typed for the `<a>` (`PaginationLinkProps`, as in 5.0) or, for a `page` without `href`, the `<button>` (`PaginationButtonProps`, new).

  Fixed: a disabled `asChild` link (a router link) could still be activated by a click or Enter. It now gets `tabIndex={-1}`, and its clicks stop before its own handlers, as `BreadcrumbLink` does. Link mode without `onPageChange` is unchanged.

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`12337f1`](https://github.com/holakirr/snow-ui/commit/12337f16e4e87e4e92d1bcaa949a60dac406ed8c) Thanks [@holakirr](https://github.com/holakirr)! - Portalled content can follow a scoped theme and contrast level. The new `ThemeScope` (`<ThemeScope theme="dark">`, `<ThemeScope contrast="more">`, or `asChild` to put the attributes on your own element) scopes the tokens like `data-theme` and `data-contrast` attributes and also passes them to the overlays opened inside it: `DialogContent`, `AlertDialogContent`, `SheetContent`, `PopoverContent`, `DropdownMenuContent` / `SubContent`, `ContextMenuContent` / `SubContent`, `TooltipContent`, `SelectContent`, `CommandPalette`, the lists of `Combobox` and `MultiSelect` and the calendars of `DatePicker` and `DateRangePicker` get them as their `data-theme` and `data-contrast`, although they render at the end of `<body>`. `SnowUIProvider` takes the same `theme` and `contrast` props (inherited by nested providers, like `dir`), and `useSnowUI()` returns them. Without either, nothing changes: portals take the theme and contrast of `<html>`, and a `data-theme` or `data-contrast` on a `*Content` component still wins.

- [#192](https://github.com/holakirr/snow-ui/pull/192) [`57b8acc`](https://github.com/holakirr/snow-ui/commit/57b8acc45e564a21b071fd2861ca6226ba2d04ce) Thanks [@holakirr](https://github.com/holakirr)! - **`SelectTrigger` gets `title`**: the Figma "2 row" field of a form, as `Input`'s `title` — a 12/16 `text-secondary` title inside the field above the value, which names the trigger (`aria-labelledby`) unless `aria-label` or `aria-labelledby` does.

  **What changes for you:** `title` used to reach the `<button>` as the native tooltip attribute; it now shows the title in the field instead. For a tooltip, wrap the trigger in `Tooltip`.

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`b608dc7`](https://github.com/holakirr/snow-ui/commit/b608dc7cec0346dbfbd5b444ec9c2cd8ae7a991f) Thanks [@holakirr](https://github.com/holakirr)! - Sidebar:

  - **Collapsed off-canvas, the sidebar leaves the tab order and the accessibility tree.** Once it has slid out it is `visibility: hidden`, so Tab no longer walks through links you can't see (WCAG 2.4.3, 2.4.11). A `SidebarRail` inside it stays visible at the screen edge to reopen it.
  - **Server rendering without a hydration mismatch.** `SidebarProvider` no longer reads the saved state while hydrating: the server and the first client render use `defaultOpen`, then the browser applies the saved state (read once, when the provider mounts). To server-render the saved state, read it with the new `readSidebarState(cookieHeader)` (a plain function, callable from Server Components) and pass it as `defaultOpen`.
  - **The cookie is now `sidebar_state`** (exported as `SIDEBAR_COOKIE_NAME`): `sidebar:state` isn't a valid cookie name (`:`), and some servers drop it. The old cookie is still read, so users keep their saved state, and still written next to the new one, so a server that reads `sidebar:state` itself keeps working; move it to `readSidebarState`, which reads both (the old cookie goes in 6.0).
  - `SidebarTrigger` sets `aria-expanded` and `aria-controls`: the id of each collapsible `Sidebar` of the provider (your `id`, or a generated one).
  - `SidebarProvider` with `onOpenChange` but no `open` toggles the sidebar and reports the change (it didn't toggle, like a controlled sidebar that ignored the change).
  - On small screens, `Sidebar`'s `className`, `style` and other props go on the sheet (they were dropped).
  - `SidebarGroupAction` and `SidebarMenuAction` keep a 24px hit area from `md` up (it was removed there, leaving a 20px target; WCAG 2.5.8). Below `md` it is still 36px.
  - ⌘B / Ctrl+B no longer toggles the sidebar in text fields and rich-text editors (where it means bold), or when a handler has called `preventDefault()`.

- [#189](https://github.com/holakirr/snow-ui/pull/189) [`5935483`](https://github.com/holakirr/snow-ui/commit/5935483b19a994266d92d14b16f606ca539eb8bf) Thanks [@holakirr](https://github.com/holakirr)! - `Slider` now matches the Figma kit (a design fix: the props, the names and the keyboard are unchanged):

  - **One value** is the Figma "Slider2" bar: 32px high, an 8px radius, a Black/4% track that fills with Primary (black; indigo in the dark theme; rounded at both ends) up to the value. The round white thumb is gone; its Active state (hover, drag and keyboard focus) shows a 2×8px handle line 4px inside the fill's end and darkens the value, and keyboard focus rings the whole bar (the `focus-ring` look). The thumb is still the `role="slider"` element, an invisible target at the value with a 24px hit area.
  - **Two or more values** are the Figma "SliderBar" range: a 3px Black/4% track, a Primary range between 28px static white thumbs with the kit's drop shadow (0 2px 8px, black at 20%), 32px high, and the thumb's `focus-ring`. With `showValue` it is the whole SliderBar: the values 16px from the track and 16px / 12px padding, 56px high.
  - New `label`: the text inside the bar at its start (white over the fill, black over the track). It names the thumb when there is no `aria-label`.
  - New `showValue`: the value inside the bar at its end, or at both ends of a range (as wide as the widest of `min` and `max`, so the track doesn't move). The thumbs read the same text out (`aria-valuetext`).
  - New `valueFormatter(value)`: formats the value for `showValue` and `aria-valuetext`. The default is a new optional message, `messages.slider.value(value, min, max)`: the position between `min` and `max` in percent ("28%").
  - The value text is `text-secondary` on the track (`black-80` when active) and the per-mode `white` at 70% on the fill (`white-80` when active), not the Figma Black/20% and White/40% (1.6:1 and 3.66:1; WCAG 1.4.3). With more contrast the bar and the range's track get a `control-border` boundary and the range's thumbs a `control-border-strong` border.
  - Invalid (`aria-invalid`): a 1px `control-border-invalid` stroke inside the bar, over the fill, or red borders on the range's thumbs. Disabled: 40% opacity, and the thumbs get `aria-disabled` (Radix set it only on the role-less root).
  - Forced-colours mode (Windows High Contrast): the bar gets a border and a `Highlight` fill, the range a `GrayText` track, a `Highlight` range and bordered thumbs.
  - Switching a slider between controlled and uncontrolled still logs a development warning (Radix's own no longer fires: it always gets a controlled value now).
  - A range with `showValue` renders a wrapper `<div>` around the texts and the slider: `className` goes on it, the other props on the Radix root as before.

- [#171](https://github.com/holakirr/snow-ui/pull/171) [`ab5ef41`](https://github.com/holakirr/snow-ui/commit/ab5ef4138eeb649f3b77539980daa4461333db65) Thanks [@holakirr](https://github.com/holakirr)! - Refs, invalid fields and form accessibility.

  - **`ref` in the types:** every component that forwards a ref now accepts one in TypeScript. `<Checkbox ref>`, `<Switch ref>`, `<SelectTrigger ref>`, `<DialogContent ref>`, `<Label ref>` and 37 more (Accordion, ContextMenu, Dialog, Form, Popover, Select, Sheet, Tabs and Tooltip parts, Separator and SidebarSeparator, Slider, Toggle) failed with TS2322 although the ref reached the element, so react-hook-form's `field.ref` didn't type-check on Checkbox, Switch or Select. Their props types are `ComponentProps<typeof Primitive>`, which include `ref`; `SwitchProps` and `FormControlProps` are new exports. The build is now checked by type tests of `dist/*.d.ts`.
  - **Invalid fields:** a field with `aria-invalid="true"` (`FormControl` sets it while the item has an error) shows it: a 1px Secondary/Red stroke on Input, InputSmall, Textarea, Search, the Select trigger and Switch (also on hover, focus, while the Select is open and on a read-only field), a red ring on an unchecked Checkbox and on the radios of an invalid RadioGroup, and a red track stroke and thumb borders on Slider. For a field of your own, use `aria-invalid:inset-ring aria-invalid:inset-ring-control-border-invalid`. The stroke is the kit's Error state on its text fields (without its `Warning` icon yet); the error text stays in `FormMessage`.
  - **Form:** `FormControl`'s `aria-describedby` only lists the description and message that are rendered, by their own `id` if they have one (it always pointed at the description's id, rendered or not), and is left out when there is neither. The server HTML has it for the parts found among `FormItem`'s children; `FormDescription` and `FormMessage` count wherever they render (in a portal too), and your own parts with the ids of `useFormField()` count when they are in the document. An `aria-describedby` on `FormControl` or on the control is now kept in front of the parts' ids; it used to replace them (a behaviour change for code that relied on replacing the list). While the field is invalid, `FormMessage` is `role="alert"`, so the error is announced when it appears (pass `role="status"` for a polite announcement); a message on a valid field is plain text. `FormDescription` and `FormMessage` have `data-slot="form-description"` / `"form-message"`. `Form`, `FormItem`, `FormControl`, `FormDescription` and `FormMessage` take a `ref`.
  - **Slider:** `aria-describedby` and `aria-invalid` go to the thumbs (the elements with `role="slider"`) instead of the root, so a `FormControl` around a Slider describes each thumb.
  - **Input and InputSmall:** no forced `role="textbox"`: a `number` input is a spinbutton, a `search` input a searchbox and a `password` input has no role again. Queries such as `getByRole('textbox')` for those types need the native role.
  - **Link:** `role="link"` and `tabIndex={0}` are only added when there is no `href` (on the link or on the `asChild` element); a link with an `href` is a plain `<a href>`.
  - **BreadcrumbLink:** `disabled` drops the `href`: a `<span role="link" aria-disabled="true">` out of the tab order instead of a link that still led to the page. With `asChild`, the child keeps its `href` and gets `aria-disabled` and `tabIndex={-1}` as before, and a click or Enter no longer activates it (the click is stopped before a router link's own handler). An enabled `BreadcrumbLink` no longer sets `tabIndex={0}` on its `<a href>`.
  - **Button, Toggle and ToggleGroupItem:** an icon-only one (an icon at the start, the end or both, or as the only child) without an accessible name (`aria-label`, `aria-labelledby`, `title`, or an icon with `alt` that isn't `aria-hidden`) logs a development warning, once per component, as `TabsTrigger` does. An icon is an `<svg>`, an `<img>` or a component named like one (`StarIcon`, `IconStar`); any other element may render text (`<FormattedMessage id />`, `<Trans i18nKey />`) and doesn't count as an icon.

- [#180](https://github.com/holakirr/snow-ui/pull/180) [`1a0a344`](https://github.com/holakirr/snow-ui/commit/1a0a344a94dbc049dba72496343c38f4a8d6ad1e) Thanks [@holakirr](https://github.com/holakirr)! - Pointer targets of at least 24×24px (WCAG 2.5.8), without visual changes:

  - New `hit-area` utility in `theme.css`: an invisible hit area of at least 24×24px centred on a smaller control, drawn by its `::after` (the element needs `relative` and no `::before` or `::after` of its own). It only adds the empty space around the control: its transparent `::before` lifts the control's own box to `z-index: 1`, over the other hit areas in its stacking context, so a neighbour's hit area doesn't take a click on the control's visible edge. Controls closer than 24px share the space between them (the later one gets it). An overlay that can cover such a control in the same stacking context (a sticky header) needs a `z-index` of 2 or more.
  - `Switch` (28×16), bare `Button`s (no box, as small as their icon or text), the `Slider` thumb (16px), sortable `TableHead` buttons (16px high), line `TabsTrigger`s (22px high in the small size) the `Search` clear button (16px) and `Calendar`'s "Today" and "Last selection" actions (20px high) use it.
  - The `Search` input fills the field's 28px height instead of sitting 20px high inside its padding, so a click anywhere on the field's height focuses it.

- [#194](https://github.com/holakirr/snow-ui/pull/194) [`28cac6e`](https://github.com/holakirr/snow-ui/commit/28cac6e85737397f2dd7ba4e32d06f5c46510b18) Thanks [@holakirr](https://github.com/holakirr)! - **Textarea:** the Figma character counter, opt-in with `showCount`. "12/200" (against the `maxLength`, or "12" without one) sits in the bottom-end corner next to the resize handle, in `text-secondary` instead of the Figma Black/20% (1.6:1), and the text stops above it. Screen readers get "12 of 200 characters" as the field's description, read when it gets focus rather than on every keystroke (`messages.textarea.count`, a new optional namespace). With the counter, the textarea and the counter are wrapped in a `<div data-slot="textarea-field">`, sized with the new `containerClassName`; `className` still styles the `<textarea>`. Without `showCount` (the default), Textarea renders as before, also with a `maxLength`. The text fields' class strings (`basicInputClasses` and the others) now come from a module without `'use client'`, so a `Textarea` in a Server Component no longer gets client references for them.

- [#190](https://github.com/holakirr/snow-ui/pull/190) [`a3ba020`](https://github.com/holakirr/snow-ui/commit/a3ba020cf468aec624c0844343b294c243e2563f) Thanks [@holakirr](https://github.com/holakirr)! - New stylesheet `@holakirr/snow-ui/theme-core.css`: `theme.css` without the `@source` of the package's components. `theme.css` adds the built components to Tailwind's sources, so a Tailwind v4 project generates the classes of every component, whether it renders them or not. Projects that copy the components (the `@snow-ui` shadcn registry) or only use the tokens import `theme-core.css` instead, and Tailwind generates only the classes of their own code: about 55 kB instead of 140 kB of minified CSS (11 kB instead of 22 kB gzipped) in a Next.js app with one copied Button. Nothing changes for `theme.css`.

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`013921b`](https://github.com/holakirr/snow-ui/commit/013921b0123155c066ddb1619b22da3bf5ccd76c) Thanks [@holakirr](https://github.com/holakirr)! - Toasts can stack. `<Toaster limit={3} />` shows up to three toasts at once, like Sonner: the newest in front, two older ones peeking out above it, smaller (a longer stack keeps the rest hidden behind them), and the stack spreads into a list while the pointer is on it or keyboard focus is in it (F8), which also pauses their timers; `expand` keeps it spread. The default `limit` is 1, so a new toast still replaces the visible one; each `<Toaster id>` keeps its own limit (`NaN` counts as 1, `Infinity` is allowed).

  - Over the limit, the oldest toast now fades out in place behind the new one instead of vanishing; a toast dismissed with the others keeps its place too. With reduced motion the stack moves at once, and only opacity animates.
  - When a focused toast is removed (over the limit, `dismiss(id)`), the timers of the others resume; before, they could stay paused, so the next toast never closed on its own.
  - Toasts shown before their `<Toaster>` mounts no longer stay cut to one: a toaster registers its `limit` before the page's own effects run, and one that mounts later (lazily loaded) reopens the toasts that are still in the store, up to its limit. Without a `<Toaster>` (toasts rendered with `useToast()` and `Toast` yourself) the limit is still 1.
  - `ToastClose` has a 24px hit area in both sizes (it was 16px small, 20px large; WCAG 2.5.8).
  - `Toast` no longer passes `status` to the DOM as an invalid `status` attribute: it sets `data-status` instead.
  - `ToastViewport` accepts a `ref`.
  - **Deprecated:** the `reducer` export of the toast store. It is internal, no longer the store's reducer, and will be removed in 6.0; use `toast()`, `useToast()` and `<Toaster limit>`. It keeps its 5.0 behaviour and warns once in development.

- [#177](https://github.com/holakirr/snow-ui/pull/177) [`31b22a5`](https://github.com/holakirr/snow-ui/commit/31b22a51e9922bc439599f32e6c493db4a989a4e) Thanks [@holakirr](https://github.com/holakirr)! - New `AlertDialog`, for confirmations the user must answer before going on ("Delete this project?"). It is built on Radix AlertDialog and reuses the Dialog's mask, motion and glass popup, as one 448px card: `AlertDialogTitle` (24 Semibold) and `AlertDialogDescription` in `AlertDialogHeader`, and `AlertDialogCancel` (a Gray `lg` Button, "Cancel" by default) and `AlertDialogAction` (a Filled `lg` Button) in `AlertDialogFooter`. `AlertDialogTrigger`, `AlertDialogPortal` and `AlertDialogOverlay` are exported too.

  - `role="alertdialog"`: opening focuses Cancel, Tab stays inside, Escape and Cancel close it without the action, and a click on the mask does nothing (the focus stays in the dialog).
  - `<AlertDialogAction variant="destructive">` is a red Filled button (`red-text` with the `white` label: 5.21:1 in light mode, 8.65:1 in dark mode); the action and Cancel also take any Button variant and size. `event.preventDefault()` in the action's `onClick` keeps the dialog open (e.g. while a request runs).
  - The buttons sit side by side and stack, the action on top, when they don't fit (a phone, long labels).
  - The Cancel label is `messages.alertDialog.cancel` in `SnowUIProvider` messages; the content takes the provider's `dir`.

- [#177](https://github.com/holakirr/snow-ui/pull/177) [`3cf7ff5`](https://github.com/holakirr/snow-ui/commit/3cf7ff55b9a40dbcae1d64cadc55c80092b29a9b) Thanks [@holakirr](https://github.com/holakirr)! - New `Alert` (a callout), with `AlertTitle` and `AlertDescription`: a message in the page flow in the kit's Card shape (radius 16, padding 12/16), tinted with a Secondary colour, with a 20px status icon, a 14 Semibold title and a `text-secondary` description.

  - `status`: `default` (neutral, the default), `info`, `success`, `warning` or `error`. Warnings and errors are `role="alert"` (announced at once), the others `role="status"`; pass `role` to change it (e.g. `role="note"` for a static callout).
  - Accessible colours: the text stays black and `text-secondary` on every tint (5.2:1 or more), and the icons are darker versions of the Secondary colours (3.6:1 or more, where the Figma colours are 1.5–2:1 on white). The fill and icon colours are the `--alert-fill` and `--alert-icon` custom properties.
  - The status is read before the content as visually hidden text ("Error"), so it doesn't depend on colour.
  - `action` (e.g. a Button) sits after the text or under it when the alert is narrow; `onDismiss` adds a dismiss button. `icon` replaces the icon (`null` hides it).
  - `asChild` on `Alert`, `AlertTitle` and `AlertDescription` (a `<section>`, a heading, a paragraph).
  - New `SnowUIProvider` messages: `alert.dismiss` and `alert.info` / `success` / `warning` / `error`, overridden by `dismissLabel` and `statusLabel`.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`b23b997`](https://github.com/holakirr/snow-ui/commit/b23b9975d688ce7f51a8330ffd34c0d83fcfca14) Thanks [@holakirr](https://github.com/holakirr)! - `Card` takes `marker`: the Figma selection mark (the kit's RadioAlt) on the top end corner, as the kit's Hover and Selected cards show it. It is checked when the card is `selected`; when it isn't, it shows empty only while the card is hovered or has the keyboard focus inside, and stays hidden at rest. The card keeps its content clear of the mark. The mark is decorative: say what is selected with `aria-checked` (or a control inside); its empty ring uses the `control-border` tokens, so it meets 3:1 with more contrast.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`559bb44`](https://github.com/holakirr/snow-ui/commit/559bb4453dd5f948b77f4afa0024567c6a92f8d8) Thanks [@holakirr](https://github.com/holakirr)! - New `Chip`, the Figma "Chip": a short coloured label, such as a status in a table cell. Seven colours (`color`: `purple`, `indigo`, `blue`, `green`, `orange`, `red`, `grey`), tinted (`background`, the default: H 20, padding 4/2, radius 4; `big`, a pill: H 28, padding 12/4, radius 80) or a coloured dot and text (`background={false}`), in 12/16 or, `big`, 14/20. The text mixes the Secondary colour with 45% of `black` (white in dark mode), so it reads at 4.5:1 or more where the Figma colours are 1.5–2.4:1; the dot and the tint keep the kit's colours. `asChild` puts the chip's look on a link or a button.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`02eac36`](https://github.com/holakirr/snow-ui/commit/02eac3636743acd568388d1c55eae3e9d5733a43) Thanks [@holakirr](https://github.com/holakirr)! - `IconBox` takes `glass`: the Figma `Glass` tile, White/20% with the "Glass 1" effect (the `glass-1` utility: a background blur and a soft shadow) instead of Black/4%, for icons over a picture or a colour. It implies `background`, with the same padding, radius and badge position, except at 80, where the Figma Glass tile is 88px (padding 4, radius 24) where the Black/4% one is 104px; `data-glass` is set on the box.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`688087f`](https://github.com/holakirr/snow-ui/commit/688087f6f9a3023323170ca7a1a76befc3b5ef9a) Thanks [@holakirr](https://github.com/holakirr)! - New `Image`, the Figma "Image": a rounded-square frame (the kit's squircle where the browser supports `corner-shape`) for a picture, a logo or an icon, 12 to 80px (`size`) or any size (`size="free"` with a class), with the kit's radius for each size: 4 up to 20px, 8 up to 32, 12 at 40 and 48, 16 at 56 and 20 from 64 (and `free`). Pass the `<img>` (or a framework image, a `<picture>`, an icon) as children: it fills the frame, or, with `icon`, sits inset on a Black/4% tile. For image pickers: `interactive` adds the kit's hover shading, `option` the selection mark (the kit's RadioAlt) on the top end corner, and `selected` checks the mark (or shows a 2px Primary ring without it). Unlike `Avatar`, which is round, Image is a square frame; put picker images in controls that say which one is selected.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`41da2a4`](https://github.com/holakirr/snow-ui/commit/41da2a4decdb1b135189ac26489589eb7bfda5d4) Thanks [@holakirr](https://github.com/holakirr)! - New `ListCard`, `NotificationsCard`, `ActivitiesCard` and `ContactsCard`, the Figma Notifications, Activities and Contacts cards: a titled list of `ListItem` rows on the popup surface (Background/3 with "Glass 2", radius 24, padding 16), 248px wide. The title is 18 Semibold 18/28 with padding 4/8 (44 high) and the rows are 4px apart, so with the kit's rows the Notifications card is 300 high, Activities 356 and Contacts 316. The card is a `<section>` named by its heading (`headingLevel`, `<h2>` by default) with the rows in a `<ul>`; a row with `href` is a link, with `onSelect` a button, both with the Figma hover. `NotificationsCard` puts a 16px icon on a 24px tile above the time, `ActivitiesCard` takes an avatar and a time, `ContactsCard` one-line rows of a 28px avatar and a name, 44 high. Their default titles come from the new optional `listCards` messages (`notifications`, `activities`, `contacts`), and a `title` prop wins over them.

- [#177](https://github.com/holakirr/snow-ui/pull/177) [`659b2e4`](https://github.com/holakirr/snow-ui/commit/659b2e4d48488938bdbfaac3f46b544761a0ddb8) Thanks [@holakirr](https://github.com/holakirr)! - New `Progress` and `ProgressCircle`, built on Radix Progress (`role="progressbar"`).

  - `Progress` is a linear bar, the continuous sibling of the Figma Strip: a Black/100% fill on a Black/10% track with rounded ends, `thickness` 2, 4 (default), 6 or 8px. It fills from the start side, so from the right in right-to-left text.
  - `ProgressCircle` draws the same on the ring of the kit's "Loading A" icon, filled clockwise from the top, `size` 12–48px (24 by default).
  - `value` of `max` (100 by default), clamped to the range. Without a value both are indeterminate: a bar crosses the track, the ring turns. For reduced motion they pulse instead of moving, and value changes don't animate.
  - The value is read out as a percentage and the bar is named "Progress" unless you give it an `aria-label` or `aria-labelledby`: new `SnowUIProvider` messages `progress.label` and `progress.value(value, max)`; `getValueLabel` overrides the value text.
  - The colours are the `--progress-fill` and `--progress-track` custom properties.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`3047d4c`](https://github.com/holakirr/snow-ui/commit/3047d4ce5b3b4caff8994bafdf08ea2179adc9e2) Thanks [@holakirr](https://github.com/holakirr)! - New `scrollbar-snow` utility (in `theme.css`, and in `index.css`): the Figma "Scrollbar" on your scroll containers, with no track: a 4px rounded thumb in `black-10` (the Figma Black/10%) that widens to 8px in `control-border` (the Figma Black/20%) under the pointer and while it is dragged. With more contrast the resting thumb is `control-border` too (3:1 or more). Both colours follow the theme. The thumb stays visible, where the kit shows it only while the pointer is over the scroll area, so keyboard and touch users can find it. Chrome, Edge and Safari draw the kit's thumb in an 8px gutter; Firefox, which can't style a hovered thumb, draws its thin scrollbar at its own width and turns it `control-border` while the pointer is over the container. Nothing animates, and forced-colors mode keeps the system scrollbar. See Foundations › Scrollbar.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`73fa28d`](https://github.com/holakirr/snow-ui/commit/73fa28dea1f8ab0101ea0f465ec86fd29a6d4e39) Thanks [@holakirr](https://github.com/holakirr)! - `Separator` draws the rest of the Figma "Line" set: `count` (2 to 8 parallel lines, stacked, or side by side when vertical, spread like the Figma frames: the outer lines 8px apart for 2, 16 for 3, 32 for 4 and 5, 40 for 6 to 8) and `arrow` (an arrowhead at the `start`, `end`, `left` or `right` end of a horizontal line; `start` and `end` follow the text direction). The lines are drawn in the text colour, Black/10% by default: a `text-*` class sets it (`text-black` is the Figma Line's Black/100%). The single line is drawn the same way now, so `text-*` works on it too; it looks the same, and a `bg-*` class still wins.

- [#177](https://github.com/holakirr/snow-ui/pull/177) [`9c21b45`](https://github.com/holakirr/snow-ui/commit/9c21b4592f09c09ca3cdc68732dc7e02d48bb6c6) Thanks [@holakirr](https://github.com/holakirr)! - New `Spinner`: the ring of the kit's "Loading A" icon, turning in the current text colour, at the kit's icon sizes (`size` 12–48px, 20 by default). It is a `role="status"` region with visually hidden "Loading" (`label`, or the new `spinner.label` message of `SnowUIProvider`). It animates in CSS, so for reduced motion the ring stops turning and pulses instead. Pass `aria-hidden` when visible text next to it already says that something is loading (e.g. in a busy button).

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`4779572`](https://github.com/holakirr/snow-ui/commit/4779572c65c091415ceeff1a5d40945c51c723d6) Thanks [@holakirr](https://github.com/holakirr)! - `Typography` takes `interactive`: the Figma Text `State=Hover`, 4px of padding on each side while the pointer is over the text (the hover of the Button label). The padding animates, except for reduced motion.

- [#195](https://github.com/holakirr/snow-ui/pull/195) [`8869a36`](https://github.com/holakirr/snow-ui/commit/8869a36a3fa3f255b77a012479549422e434ad12) Thanks [@holakirr](https://github.com/holakirr)! - New `TextStrip`, the Figma "TextStrip": a 160×28 pill of centred 14px text, Black/4% with semibold text, or, with `strip`, Secondary/Indigo (with static black text, 10.15:1, where the kit's white is 2.07:1). Long text is cut with an ellipsis; a class changes the width. With more contrast the pill gets the control border and the strip a 2px ring. `asChild` styles a button, a link or a heading; `strip` sets `data-state="on"`.

- [#187](https://github.com/holakirr/snow-ui/pull/187) [`a8d82bd`](https://github.com/holakirr/snow-ui/commit/a8d82bd75ccbfa61da8358a6d5122b96c30fa154) Thanks [@holakirr](https://github.com/holakirr)! - **`SnowUIProvider` gets `weekStartsOn`**: the first day of the week of `Calendar`, `DatePicker`, `DateRangePicker` and `Scheduler` under it, unless their own `weekStartsOn` (`startOfWeek` on `Scheduler`) is set. It takes a day (`0` for Sunday … `6` for Saturday), or `"locale"` for the locale's first day (`locale.options.weekStartsOn`: Sunday with the default `enUS`, Monday with `ru` and most European locales). Nested providers inherit it; its type is exported as `WeekStart`.

  ```tsx
  <SnowUIProvider locale={enUS} weekStartsOn="locale">
    <DatePicker /> {/* weeks start on Sunday */}
  </SnowUIProvider>
  ```

  **What changes for you:** nothing without it. The week still starts on Monday, as in 5.0 and the Figma kit, whatever the locale.

  **Planned for 6.0:** `"locale"` becomes the default. To keep the Monday start then, set `weekStartsOn={1}` on the provider (or on the components).

### Patch Changes

- [#202](https://github.com/holakirr/snow-ui/pull/202) [`bb9833f`](https://github.com/holakirr/snow-ui/commit/bb9833fe01c691e18819d27c92f8b866d19b3f76) Thanks [@holakirr](https://github.com/holakirr)! - `Avatar` has the Figma kit's hover, by kind, and only in a link or a button (`<a href>`, an enabled `<button>`, `role="button"`) and where the pointer can hover, as the library's other hovers (a tap on a touch screen doesn't leave it on): a photo gets a `color-1` underlay (seen through a cut-out picture), an icon fallback (an `<svg>` in `AvatarFallback`) a Black/20% fill (a static gray, like the fallback's `color-2`), and initials turn semibold. It replaces the 105% brightness every avatar had on hover, also where it wasn't interactive. The avatar at rest doesn't change, except that without the filter its initials are anti-aliased like the text around them. Colours fade (`transition-colors` instead of `transition-all`); in forced-colors mode the fills give way to the system colours and the semibold initials stay.

- [#200](https://github.com/holakirr/snow-ui/pull/200) [`eaf149e`](https://github.com/holakirr/snow-ui/commit/eaf149eb28fb075dc83f23c7af15275957691202) Thanks [@holakirr](https://github.com/holakirr)! - `Calendar`: in dark mode, where a selected day is indigo like today, today gets a 4px dot in the text colour under its number, so the two differ by more than a hover. The dot also marks a selected today (in both themes) and today with forced colours (Windows High Contrast), where the fills are dropped and selected days (and range bands) now use the system Highlight. In the light theme an unselected today stays the kit's Secondary/Indigo fill alone.

- [#187](https://github.com/holakirr/snow-ui/pull/187) [`a7d373c`](https://github.com/holakirr/snow-ui/commit/a7d373c1779849ef4fcdfde2115ec2bf26fd2ab1) Thanks [@holakirr](https://github.com/holakirr)! - `CommandPalette` no longer selects the highlighted item with the Enter that commits an IME composition in Safari (WebKit sends it with `keyCode` 229 and `isComposing` false).

- [#188](https://github.com/holakirr/snow-ui/pull/188) [`3ede694`](https://github.com/holakirr/snow-ui/commit/3ede69497fd0d117fbd97dd50f2029db11283db0) Thanks [@holakirr](https://github.com/holakirr)! - `CommandPalette`, `Combobox` and `MultiSelect`: the loading spinner in the field is the `Spinner` ring, turned by CSS, so it stops turning (and pulses) with reduced motion (`prefers-reduced-motion: reduce`, WCAG 2.3.3). It was `LoadingAIcon`, which animates with SVG `<animate>` that CSS doesn't stop. At rest it shows the ring's arc instead of the icon's first frame.

- [#188](https://github.com/holakirr/snow-ui/pull/188) [`8d92a38`](https://github.com/holakirr/snow-ui/commit/8d92a3816f57a06d3a4ddcd8ffcbb3a768151c46) Thanks [@holakirr](https://github.com/holakirr)! - The contrast tokens (`control-border`, `control-border-strong`, `placeholder`, `control-border-invalid`) now have their two levels as variables of every theme scope, `--color-<name>--standard` and `--color-<name>--more`, which a theme of yours overrides like any token. Overriding `--color-<name>` itself replaced the value that each theme and contrast scope computes, so it lost the high-contrast level (or came back inside a `data-contrast` scope); the Theming and Contrast guides show the levels instead.

- [#175](https://github.com/holakirr/snow-ui/pull/175) [`d6a2b90`](https://github.com/holakirr/snow-ui/commit/d6a2b9091ffa65da325f7bd4f66687326514fa89) Thanks [@holakirr](https://github.com/holakirr)! - Smaller self-hosted Inter. The font files behind `@holakirr/snow-ui/fonts.css` and `fonts-italic.css` now pin Inter's optical-size axis at 14, the text optical size that the design uses at every size (the base layer already sets `font-optical-sizing: none`, so browsers never drew another one). The glyphs are unchanged and the files are 32–39% smaller: the Latin file goes from 105 kB to 69 kB, and all upright files together from 550 kB to 354 kB. The weight axis stays variable (100–900).

  If your own CSS turns optical sizing back on (`font-optical-sizing: auto`), large text now keeps the text shapes. To get Inter's display shapes, load Inter yourself.

  The package README now shows how to preload the Latin file (`<link rel="preload" as="font" crossorigin>`, or `preload()` from `react-dom`).

- [#184](https://github.com/holakirr/snow-ui/pull/184) [`b82172a`](https://github.com/holakirr/snow-ui/commit/b82172a35ba40d4c20c96840c84b0c0e24e786fe) Thanks [@holakirr](https://github.com/holakirr)! - **Link:** a link without an `href` (an `onClick` link, or an `asChild` element without one) is activated by Enter, as the WAI-ARIA link pattern expects: it was focusable (`role="link"`, `tabIndex={0}`) but the browser doesn't activate an `<a>` without an `href`, so its `onClick` was out of reach from the keyboard. Space doesn't activate it, a held key clicks once, and your `onKeyDown` can prevent it; an `<a href>` or a `<button>` rendered with `asChild` is left to the browser.

- [#202](https://github.com/holakirr/snow-ui/pull/202) [`66af4c9`](https://github.com/holakirr/snow-ui/commit/66af4c942d9feebbbc917f9e1b7ea75e98d09445) Thanks [@holakirr](https://github.com/holakirr)! - Menu separators have the Figma kit's spacing: `DropdownMenuSeparator`, `ContextMenuSeparator` and `SelectSeparator` are 8px from the items on each side (8 + 0.5 + 8 between groups); they were 4px. `DropdownMenuGroup`'s 4px above and below is now a margin instead of padding, so next to a separator it merges into the separator's 8px and a line between two groups stays at 8 + 0.5 + 8 (it would have been 12 + 0.5 + 12). Two groups without a line between them are 4px apart instead of 8px. Menus with separators grow by 8px per separator.

- [#202](https://github.com/holakirr/snow-ui/pull/202) [`a735de2`](https://github.com/holakirr/snow-ui/commit/a735de2c65e7fc6018f31647ac5c94a5c3ce24e2) Thanks [@holakirr](https://github.com/holakirr)! - `DropdownMenuShortcut` and `ContextMenuShortcut` are the Figma kit's plain shortcut text ("⌘C" in Black/40%), in `text-secondary`, instead of a `KBD` key cap with a Black/4% fill and black text. They are still a `<kbd>` with `aria-keyshortcuts` and take the same props; the text dims with a disabled item. Pass a `variant` (`solid` or `border`) to keep the key cap, and `separator=""` to join symbol keys as the kit does (`⌘C`; the default separator is still `+`). A `KBD` you put in an item yourself is unchanged.

  In right-to-left menus the shortcut now sits at the end of the item (on the left); it stayed next to the label, because the `<kbd>` is left-to-right and its `ms-auto` became a left margin.

- [#180](https://github.com/holakirr/snow-ui/pull/180) [`6708acd`](https://github.com/holakirr/snow-ui/commit/6708acd78c154edc9ab50e83c262f7a03f810a25) Thanks [@holakirr](https://github.com/holakirr)! - Reduced motion (WCAG 2.3.3): with the OS setting `prefers-reduced-motion: reduce`, the `--animate-slide-*` and `--animate-zoom-*` tokens of `theme.css` fade instead of moving, so Dialog and Sheet backdrops, Sheet, Popover, the menus, Select, Tooltip, Toast and CommandPalette fade in and out with the same timing, and the Accordion opens and closes without animating its height. The Skeleton stops pulsing, a pressed Button doesn't shrink, the Switch thumb and the Accordion chevron jump instead of sliding and turning, a Dialog or AlertDialog only fades in, and the Sidebar collapses and expands without animating its width.

- [#180](https://github.com/holakirr/snow-ui/pull/180) [`1111367`](https://github.com/holakirr/snow-ui/commit/11113676d01d7e5e3fa30e1b1ace59057760e04f) Thanks [@holakirr](https://github.com/holakirr)! - Keyboard and screen reader support for Scheduler and the Calendar year view.

  - **Scheduler:**
    - The week is a `grid` named by its dates in the locale ("September 28 – October 4, 2026"; your `aria-label` or `aria-labelledby` replaces it), with rows of day column headers, hour row headers and a cell per hour holding its button and the events that start in it. The layout doesn't change.
    - It is one tab stop instead of one per hour and event. Tab enters on the last focused hour or event (at first, the current hour of today); the arrow keys move between days (mirrored in right-to-left text, following the `dir` prop or `SnowUIProvider`) and down the day through each hour and its events, Home / End go to the first / last day of the row, Ctrl or ⌘ + Home / End to the first / last hour of the grid, and Page Down / Page Up move six hours. ArrowDown on an event moves on instead of opening its menu; Enter and Space still open it, and Escape returns focus to the event.
    - Today's day label has `aria-current="date"` and is semibold, so it isn't told by its colour alone; the current hour's cell has `aria-current="time"`. The current-time tag is hidden from assistive technology and lets clicks through to the cells below it.
  - **Calendar:** the year switcher (the caption label) has `aria-expanded` and `aria-controls`, and opening or closing the year view or picking a year keeps the focus on it instead of losing it (also from a later month's switcher, with several months). The year view is a real `grid` named by its years ("2021 - 2032"), with rows of four year cells; it was a `grid` named by the month with no rows (the day grid's role, name and `aria-multiselectable` on a list of year buttons). The years are one tab stop (the year shown, at first); the arrow keys move between them (mirrored in right-to-left text) and on to the next or previous years, Home / End go to the first / last year of the row, Ctrl or ⌘ + Home / End to the first / last year shown, and Page Down / Page Up show the next / previous years. The year shown is `aria-selected`, the current year `aria-current="date"`. The look doesn't change. The year view also opens on the years that hold the month shown (it opened on the current years, which could all be after `endMonth`, leaving nothing to focus), the previous-years button is no longer disabled while an earlier year is enabled (`startMonth` in June), and an `endMonth` on December 31 no longer enables the next year.

- [#188](https://github.com/holakirr/snow-ui/pull/188) [`dde54ca`](https://github.com/holakirr/snow-ui/commit/dde54caa9e58735f474e24cd4555242b7ad02923) Thanks [@holakirr](https://github.com/holakirr)! - `Scheduler` fixes:

  - An invalid `currentDate` (a bad date from a URL) renders "Invalid Date" labels again, as in 5.0, instead of throwing.
  - Deleting an event from its own menu (`dropdownContentRenderer`) gives the focus to the event's hour cell instead of the page.
  - Today, the current hour and the current-time line follow the browser's clock after hydration, so a server in another time zone no longer leaves a second tab stop or a wrong "today"; they now also move on every minute.
  - The rows keep their layout in Chrome and Edge 111–116, which lack CSS `subgrid` (they repeat the grid's columns and inherit its column gap there).
  - The events of an hour are in the order they start, for the arrow keys, Tab and on screen, whatever the order of `events`.

- [#202](https://github.com/holakirr/snow-ui/pull/202) [`4fd0f64`](https://github.com/holakirr/snow-ui/commit/4fd0f640dde1a2200c1fbcff724170e1636ad9d3) Thanks [@holakirr](https://github.com/holakirr)! - The library's own scroll areas use the kit's scrollbar (`scrollbar-snow`): the lists of `Select`, `Combobox` and `MultiSelect`, `DropdownMenuContent` and `DropdownMenuSubContent`, the `CommandPalette` results and `SidebarContent`. Chrome, Edge and Safari draw it in an 8px gutter at the end of a list while it scrolls (`scrollbar-gutter` stays `auto`, so a list that doesn't scroll keeps its padding on both sides); in the popovers the track stops 12px from the ends, clear of the 16px corners. Forced-colors mode keeps the system scrollbar.

  - `Select` shows the scrollbar Radix hides, next to its scroll buttons.
  - `DropdownMenuContent` and `DropdownMenuSubContent` scroll when they are taller than the room on their side (`max-h-(--radix-dropdown-menu-content-available-height)`); they used to run off the window. They already clipped their overflow, so portal submenus with `DropdownMenuPortal` as before. The exported `dropdownMenuContentStyles` has the same classes; a `max-h-*` or `overflow-*` class of yours still wins.
  - `ContextMenuContent` gets the scrollbar for when you make it scroll (`max-h-(--radix-context-menu-content-available-height) overflow-y-auto`, with portalled submenus); it doesn't scroll by default, which would clip a submenu that isn't portalled.

- [#188](https://github.com/holakirr/snow-ui/pull/188) [`7da96f4`](https://github.com/holakirr/snow-ui/commit/7da96f46598b5542aecf30ddadc32411ae31333b) Thanks [@holakirr](https://github.com/holakirr)! - `Search`: the clear button's keyboard focus is visible: it gets the `focus-ring` outline (12.6:1) at full opacity instead of a Black/20% ring (1.6:1). WCAG 2.4.7, 1.4.11.

- [#202](https://github.com/holakirr/snow-ui/pull/202) [`abc7d24`](https://github.com/holakirr/snow-ui/commit/abc7d24c17ee610ba2466ef201fc1b6f1647e026) Thanks [@holakirr](https://github.com/holakirr)! - The chevron of the `Select` trigger is `text-secondary` (Black/60%, White/70% in dark mode) instead of the Figma Black/40%, which is 2.85:1 on white, under the 3:1 of WCAG 1.4.11 for a control's icon. It is now at least 5.72:1 in light mode and 5.58:1 in dark mode, at both contrast levels; a disabled trigger's chevron is Black/20% as before.

- [#188](https://github.com/holakirr/snow-ui/pull/188) [`8e035d8`](https://github.com/holakirr/snow-ui/commit/8e035d8098f6217e4b1cb88727ec7299ca8a5895) Thanks [@holakirr](https://github.com/holakirr)! - With more contrast (`prefers-contrast: more` or `data-contrast="more"`), the focus stroke of `Input`, `InputSmall`, `Textarea`, `Search`, `Combobox` and `MultiSelect` is 2px instead of 1px: its inner pixel was the fill, so a focused field differs from an unfocused one by at least 5.59:1 (WCAG 2.4.7, 1.4.11). The standard contrast keeps the Figma 0.5px Black/40% stroke (2.85:1 on the fill), now listed in the README's known gaps. The exported `focusInputClasses` carries the new `contrast-more:focus:inset-ring-2`.

- [#188](https://github.com/holakirr/snow-ui/pull/188) [`9da6f8f`](https://github.com/holakirr/snow-ui/commit/9da6f8f8a67ce7c533e704ab2bfb600c52102cc0) Thanks [@holakirr](https://github.com/holakirr)! - `<html data-theme="system">` (or any `data-theme` value other than `light` and `dark`, such as a theme name) follows the OS dark preference again, as in 5.0: only `data-theme="light"` / `"dark"` and the `light` / `dark` classes set a mode. It applies to the tokens and to the `dark:` variant.
- Updated dependencies [[`e90ac4b`](https://github.com/holakirr/snow-ui/commit/e90ac4bf4272b1021fe5276d595e8822c485701f)]:
  - @holakirr/snow-ui-icons@2.2.1

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
    - `background-1` is `#333` (was `#2A2A2A`).
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
