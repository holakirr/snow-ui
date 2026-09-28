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

Tailwind CSS is not required at runtime: `@holakirr/snow-ui/index.css` ships precompiled.

Then just import styles:

```tsx
import '@holakirr/snow-ui/index.css'
```

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

`index.css` implements the SnowUI Figma tokens (the SnowUI-Light and SnowUI-Dark modes) as Tailwind theme variables. Storybook's "Foundations" pages list every token with its Figma name and both mode values.

- **Theme:** light by default; dark with `data-theme="dark"` on `<html>` or on any element (see [Scoped themes](#scoped-themes)), or with the OS dark preference unless `<html data-theme="light">`. `color-scheme` follows, so native controls and scrollbars match.
- **Colors:** `primary` (black in light, indigo in dark), `black`, `white` and their Figma alpha steps (`black-80`, `black-40`, `black-20`, `black-10`, `black-4`, same for `white`), `background-1..3`, `surface-1..3`, `color-1`, `color-2`, `static-white`, `static-black`, and the secondary colours (`purple`, `indigo`, `blue`, `cyan`, `mint`, `green`, `yellow`, `orange`, `red`). Use them as `bg-black-10`, `text-black-40`, `border-black-10` or `var(--color-black-10)`. In dark mode, `black-10` and `black-4` get the design's stronger alpha (15% and 10%); the Tailwind modifiers `black/10` and `black/4` keep one alpha in both modes.
- **Typography:** `text-12` … `text-64` (the Figma text styles: font size and line height), Inter with `font-feature-settings: "ss01" 1, "cv01" 1`.
- **Radius:** `rounded-4` … `rounded-80` (the Figma corner radius scale).
- **Spacing:** the Figma spacing and size values are multiples of 4px, so Tailwind's spacing utilities (`p-1` = 4px, `gap-3` = 12px, `size-10` = 40px) cover them.
- **Effects:** `shadow-1`, `shadow-2`, `shadow-glow`, `shadow-glass-1`, `shadow-glass-2`, `inset-shadow-inner`, the focus ring `ring-4 ring-focus` (or `shadow-focus`), the background blurs `backdrop-blur-bg-40` (20px) and `backdrop-blur-bg-100` (50px), and `glass` / `glass-1` / `glass-2`, which approximate Figma's Glass effects with a fill, a background blur and a shadow.

The package doesn't load Inter. Load it yourself; the Google Fonts build of Inter doesn't include the `ss01` / `cv01` features, the build from [rsms.me/inter](https://rsms.me/inter/) does.

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

## Component Documentation

Components are documented in Storybook with examples and props documentation. Visit the [Storybook](https://snow-ui.holakirr.com) to explore the components and their usage.

## Testing

- Unit tests are written using Vitest and React Testing Library
- E2E tests are written using Playwright; `bun run e2e` starts Storybook automatically (or reuses one already running on port 53741)
- E2E visual snapshots are generated on macOS (`*-chromium-darwin.png`), so run `bun run e2e` / `bun run e2e:update` on macOS; other platforms need their own baselines
- Unit tests cover Button, Accordion and date utils so far; more are welcome

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
