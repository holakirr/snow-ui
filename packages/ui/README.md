# Holakirr Snow UI

SnowUI is a React UI components library implementation of [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/). Implemented and improved by [holakirr](https://github.com/holakirr). Based on TailwindCSS.
Build your design using [it](https://www.figma.com/community/file/1301134685302006646)

[Storybook](https://snow-ui.holakirr.com)

Take a look at my [CV](https://holakirr.com) =)

## Features

- 🎨 Built with Tailwind CSS for utility-first styling
- 📚 Storybook for component documentation and development
- 🔍 TypeScript for type safety
- ✅ Comprehensive testing setup:
  - Unit testing with Vitest
  - E2E testing with Playwright
- 🚀 tsdown (Rolldown) library build, checked with publint and are-the-types-wrong
- ⚡️ Powered by Bun for fast package management and running scripts

## Getting Started

### Installation

To get started, install Holakirr Snow UI package via package manager of your choice:

```bash
bun add @holakirr/snow-ui react react-dom
```

Peer dependencies: `react` and `react-dom` 19. Nothing else is required — the library is not tied to any form or state library.

Then import the styles, in one of two ways.

**Without Tailwind CSS:** `index.css` ships precompiled (Tailwind's preflight, the theme and every class the components use):

```tsx
import '@holakirr/snow-ui/index.css'
```

**With Tailwind CSS v4 in your project:** import the theme into your stylesheet after Tailwind, and let Tailwind scan the package for the classes the components use (the `@source` path is relative to that stylesheet):

```css
@import "tailwindcss";
@import "@holakirr/snow-ui/theme.css";
@source "../node_modules/@holakirr/snow-ui/dist";
```

`theme.css` is the same theme without Tailwind itself: the design tokens as theme variables (so `bg-black-10`, `text-14` or `rounded-12` work in your own markup), the theme scopes, the `dark` variant, the `glass*` and `focus-ring` utilities, the base rules and react-day-picker's stylesheet (for `Calendar`). Your Tailwind generates one set of utilities for your code and the components, instead of two copies of preflight and overlapping utilities. Import one of the two stylesheets, not both. Note that `theme.css` redefines `dark:` to follow [scoped themes](#scoped-themes) (`data-theme`, then the OS preference) and overrides Tailwind's `--font-sans`, `--color-black` and `--color-white`.

**Cascade layers.** Both stylesheets keep every rule in Tailwind's cascade layers (`theme`, `base`, `components`, `utilities`; react-day-picker's stylesheet is in `components`), so your own unlayered CSS overrides them whatever the load order or specificity, and your utilities override the base and component rules.

**Fonts (optional).** The design uses Inter with the `ss01` / `cv01` OpenType features, which the Google Fonts build of Inter doesn't include. `fonts.css` self-hosts [Inter](https://rsms.me/inter/) 4.1 (the rsms build, SIL Open Font License): variable weight 100–900, `font-display: swap`, split by `unicode-range` so browsers only download the scripts a page uses (about 105 kB for Latin):

```tsx
import '@holakirr/snow-ui/fonts.css'
```

The font files are in `@holakirr/snow-ui/fonts/*` (e.g. for a preload: `import latin from '@holakirr/snow-ui/fonts/inter-latin-normal.woff2?url'` in Vite). To load Inter yourself, use a build with those features; the stylesheets only set `font-family: Inter, sans-serif` and the `font-feature-settings`.

### Basic example

Buttons are build using the Button component:

```tsx
import { Button } from '@holakirr/snow-ui'

function App() {
 return (
  <Button variant="filled" size="md">
   Click me
  </Button>
 )
}
```

## Forms

`Form*` components are library-agnostic: pass the validation state to `FormItem` and the label, control, description and message are wired up (ids, `aria-invalid`, `aria-describedby`).

```tsx
import { Form, FormControl, FormItem, FormLabel, FormMessage, Input } from '@holakirr/snow-ui'

<Form onSubmit={handleSubmit}>
  <FormItem error={errors.email}>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <Input name="email" />
    </FormControl>
    <FormMessage />
  </FormItem>
</Form>
```

This works with any form library (TanStack Form, Formik, Conform, server actions…). Adapters can provide the state for nested items with `<FormFieldState value={{ name, error, invalid }}>`.

### react-hook-form

An optional adapter is available as a separate entry point. Install `react-hook-form` yourself; the main entry doesn't import it.

```tsx
import { Form, FormField, FormItem, FormControl, FormMessage } from '@holakirr/snow-ui/react-hook-form'
```

## Design tokens

`index.css` and `theme.css` implement the SnowUI Figma tokens (the SnowUI-Light and SnowUI-Dark modes) as Tailwind theme variables. They are generated from [W3C Design Tokens (DTCG)](https://www.designtokens.org/) files in [`tokens/`](https://github.com/holakirr/snow-ui/tree/main/packages/ui/tokens), the source of truth, which other tools (Style Dictionary, Terrazzo, Figma plugins) can read too. Storybook's "Foundations" pages list every token with its Figma name and both mode values.

- **Theme:** light by default; dark with `data-theme="dark"` on `<html>` or on any element (see [Scoped themes](#scoped-themes)), or with the OS dark preference unless `<html data-theme="light">`. `color-scheme` follows, so native controls and scrollbars match.
- **Colors:** `primary` (black in light, indigo in dark), `black`, `white` and their Figma alpha steps (`black-80`, `black-40`, `black-20`, `black-10`, `black-4`, same for `white`), `background-1..3`, `surface-1..3`, `color-1`, `color-2`, `static-white`, `static-black`, the secondary colours (`purple`, `indigo`, `blue`, `cyan`, `mint`, `green`, `yellow`, `orange`, `red`), and `indigo-text`, an accessible indigo for text (see below). Use them as `bg-black-10`, `text-black-40`, `border-black-10` or `var(--color-black-10)`. In dark mode, `black-10` and `black-4` get the design's stronger alpha (15% and 10%); the Tailwind modifiers `black/10` and `black/4` keep one alpha in both modes.
- **Typography:** `text-12` … `text-64` (the Figma text styles: font size and line height), Inter with `font-feature-settings: "ss01" 1, "cv01" 1`.
- **Radius:** `rounded-4` … `rounded-80` (the Figma corner radius scale).
- **Spacing:** the Figma spacing and size values are multiples of 4px, so Tailwind's spacing utilities (`p-1` = 4px, `gap-3` = 12px, `size-10` = 40px) cover them.
- **Cursors:** a base rule gives buttons and ARIA controls (`option`, `menuitem`, `tab`, `radio`, `checkbox`, `switch`, `label[for]`…) the pointer cursor, which Tailwind v4's preflight no longer sets, and disabled elements (`:disabled`, `aria-disabled="true"`, `data-disabled`) the not-allowed cursor. `cursor-*` utilities override it.
- **Focus:** the `focus-ring` utility is the keyboard focus indicator of every component: on `:focus-visible` it draws the Figma "Focus" ring (`ring-4 ring-focus`) plus a 2px `black-80` outline offset by 2px. Use it on your own focusable elements: `<button className="focus-ring">`.
- **Effects:** `shadow-1`, `shadow-2`, `shadow-glow`, `shadow-glass-1`, `shadow-glass-2`, `inset-shadow-inner`, the Figma focus ring `ring-4 ring-focus` (or `shadow-focus`), the background blurs `backdrop-blur-bg-40` (20px) and `backdrop-blur-bg-100` (50px), and `glass` / `glass-1` / `glass-2`, which approximate Figma's Glass effects with a fill, a background blur and a shadow.

Inter itself is opt-in: import `@holakirr/snow-ui/fonts.css` (see [Installation](#installation)) or load a build with the `ss01` / `cv01` features yourself.

Old token names (`brand`, `bg1`…`bg5`, `brand-hover` and the shadcn-style `background`, `foreground`, `muted`, `accent`, `destructive`, `input`, `ring`…) still work as deprecated aliases; see the [changelog](CHANGELOG.md) for the mapping.

### Scoped themes

`data-theme` works on any element, not only `<html>`: the tokens of an element come from its nearest `data-theme` ancestor, so a subtree can use the other mode, and `data-theme="light"` inside a dark subtree switches back.

```tsx
<html data-theme="light">
  …
  <aside data-theme="dark" className="bg-background-1 text-black">
    {/* dark tokens: background-1 is #333, black is white */}
    <div data-theme="light">{/* light again */}</div>
  </aside>
</html>
```

- A scope sets the tokens and `color-scheme`, not a background or text colour: give it `bg-background-1 text-black` (or your own) to paint it.
- Without `data-theme` on `<html>`, the page follows the OS preference; `<html data-theme="light">` or `"dark"` pins it. Scopes inside work either way.
- `dark:` utilities follow the same scopes, with one limit: a dark scope inside a light scope inside a dark scope gets the dark tokens but not `dark:` utilities. Prefer the tokens, which switch at any depth.
- Overlays are portalled: the content of `Dialog`, `Sheet`, `Popover`, `DropdownMenu`, `ContextMenu`, `Tooltip`, `Select` and `CommandPalette` renders at the end of `<body>`, outside your scope, so it takes the theme of `<html>`. Set the theme on `<html>` for the whole app, or give the content its own scope: `<PopoverContent data-theme="dark">` (the `*Content` components pass it through). Toasts render inside `<Toaster />`, so they take the theme of wherever you place it.

## Components

- **Base:** `Typography`, `KBD`, `IconBox`, `IconText`, `Group`, `Strip`, `Separator`, `Badge`, `Tag`, `Link`, `Avatar`, `AvatarGroup`, `Skeleton`.
- **Controls:** `Button`, `Input`, `InputSmall`, `Search`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`, `Select`, `Slider`, `Label`, `Form*`.
- **Overlays:** `Dialog`, `Sheet`, `Popover`, `DropdownMenu`, `ContextMenu`, `Tooltip`, `Toaster`, `CommandPalette`.
- **Data and navigation:** `Card`, `Table`, `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Sidebar`, `ListItem`, `Calendar`, `Scheduler`.

The components that map to the SnowUI Figma base components:

- **`IconBox`** — the Figma "Icon": sizes an icon, avatar or image (`size` 12–80), optionally on a Black/4% tile (`background`) with a `badge` (a dot, or any node such as a count).
- **`IconText`** — an icon or avatar plus text (`vertical`, `flip`). `interactive` adds the Figma "Frame" hover fill (Black/4%), `active` keeps it on; render it `as="a"` or `as="button"` for navigation items and rows.
- **`Group`** — lays out items in a row or column, 8px apart (`vertical`, `reverse`, `gap`), with `role="group"`.
- **`Strip`** — a row or column of equal segments (`count`, `vertical`, `thickness`, `rounded`); with `value` it is a segmented progress bar (`role="progressbar"`, or `role="meter"`).
- **`Search`** — the 28px search field (`gray` / `outline`, `sm` / `lg`) with a search icon, a keyboard shortcut hint (`shortcut={['/']}`) and a clear button (also Escape) that calls `onChange` with an empty value and `onClear`.
- **`CommandPalette`** — the Figma "SearchPopup": a dialog with a search combobox and a grouped listbox. Pass `groups` of items (`label`, `icon`, `keywords`, `disabled`, `onSelect`); ↑ / ↓ move the highlight, Enter or a click selects (`onSelect(item, event)` — check `event.metaKey` to open in a new tab), Escape closes. `hotkey` (`'/'`, `'mod+k'`) opens it, `filter={false}` + `onQueryChange` + `loading` serve results from a server, `emptyMessage` replaces "No results".
- **`ListItem`** — a row of the dashboard Notifications / Activities / Contacts lists: `icon`, `title` and a Black/40% `description` or timestamp; an `IconText`, so `interactive`, `active` and `as` work too.

Storybook's "Recipes/Dashboard" composes them with `Sidebar`, `Breadcrumb`, `Card` and `Button` into the SnowUI dashboard layout (sidebar, header, content, right sidebar).

## Accessibility deviations from the Figma kit

This is a reference implementation, so where the Figma kit conflicts with WCAG 2.2 AA, accessibility wins. Contrast ratios are against `background-1` (#FFF light, #333 dark) unless stated otherwise.

| Where | Figma | Library | Why |
| --- | --- | --- | --- |
| Focus indicator (all controls except text fields) | "Focus" effect: 4px ring, black 4% (1.1:1); no focus state on Button or Tab | `focus-ring`: the Figma ring plus a 2px `black-80` outline, offset 2px — 12.6:1 light, 8.7:1 dark | 2.4.7, 1.4.11 |
| Inactive tabs, off toggles, Bare buttons, the Tag close icon | 40% layer opacity | 100% while keyboard-focused, so the focus ring isn't dimmed | 1.4.11 |
| Filled Button label, checked Checkbox mark | `#FFF` in both modes: 2.07:1 on the dark-mode indigo Primary | the per-mode `white` token: white on black (21:1), black on indigo (10.15:1) | 1.4.3, 1.4.11 |
| Badge number | `#FFF` on indigo, 2.07:1 | black on indigo, 10.15:1 | 1.4.3 |
| Indigo text: default Link, active Tag | Secondary/Indigo `#ADADFB`: 2.07:1 on white | `indigo-text`: `#5B5BD6` in light mode (5.37:1; 5.04:1 on the active Tag tint), `#ADADFB` in dark mode (6.11:1). Fills keep the Figma indigo | 1.4.3 |
| Default Link hover | colour change only | colour change plus an underline | 1.4.1 |
| External Link | — | `target="_blank"` and `rel="noopener noreferrer"` by default, and a visually hidden "(opens in a new tab)" (`externalLabel`) | 3.2.5 (advisory) |
| Tag close button | a 12px icon | the same icon with a 24×24px hit area | 2.5.8 |
| Icon-only tabs | — | a development warning without `aria-label` / `aria-labelledby` | 4.1.2 |
| Dark Tooltip in dark mode | Black/80% flips to white/80% but the text stays `#FFF` | the text flips with it (black on white/80%) | 1.4.3 |

Text fields (`Input`, `InputSmall`, `Textarea`, `Search`) keep the Figma "Focus" state exactly: a Black/40% stroke and the 4px Focus ring on any focus (mouse or keyboard); the caret and the stroke mark focus, so they don't get the `focus-ring` outline.

Data, overlay and navigation components:

- **Calendar:** today's date is static black on Secondary/Indigo (10.15:1). Figma uses white, which is 2.07:1 (1.4.3).
- **Sidebar:** group labels (`SidebarGroupLabel`) are `black-80` (12.6:1 light, 8.7:1 dark). Figma's Black/40% is 2.85:1 at 14px (1.4.3).
- **Toast:** toasts with an `action` or an infinite `duration` get a close button by default (`closable`), so they can be dismissed with a pointer and an action doesn't vanish on a timer (2.2.1). The Figma toast has no close button.

Known gaps (Figma values kept for now): the Black/20% rings of unchecked Checkbox and Radio and the 0.5px Black/20% Input stroke (1.6:1), the Switch's white thumb on the dark-mode indigo track (2.07:1), Black/20% placeholders, the 40% Link arrow and external icon, and the Black/4% highlight of menu items.

## Component Documentation

Components are documented in Storybook with examples and props documentation. Visit the [Storybook](https://snow-ui.holakirr.com) to explore the components and their usage.

## Testing

- Unit tests are written using Vitest and React Testing Library
- E2E tests are written using Playwright; `bun run e2e` starts Storybook automatically (or reuses one already running on port 53741)
- E2E visual snapshots are generated on macOS (`*-chromium-darwin.png`), so run `bun run e2e` / `bun run e2e:update` on macOS; other platforms need their own baselines
- Unit tests cover most components (see the `*.test.tsx` files next to them), the toast store, the date utils and the design tokens; more are welcome

## Usage

```bash
bun add @holakirr/snow-ui
```

```tsx
import { Button } from '@holakirr/snow-ui'

function App() {
 return (
  <Button variant="filled" size="md">
   Click me
  </Button>
 )
}
```

## Development

This package lives in the [snow-ui monorepo](https://github.com/holakirr/snow-ui) under `packages/ui`. Install dependencies and run scripts from the repository root — see the [root README](https://github.com/holakirr/snow-ui#readme). Icons come from the sibling workspace package [`@holakirr/snow-ui-icons`](https://github.com/holakirr/snow-ui/tree/main/packages/icons).

## License

MIT
