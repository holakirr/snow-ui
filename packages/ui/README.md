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

- **Theme:** light by default; dark with `<html data-theme="dark">`, or with the OS dark preference unless `<html data-theme="light">`.
- **Colors:** `primary` (black in light, indigo in dark), `black`, `white` and their Figma alpha steps (`black-80`, `black-40`, `black-20`, `black-10`, `black-4`, same for `white`), `background-1..3`, `surface-1..3`, `color-1`, `color-2`, `static-white`, `static-black`, the secondary colours (`purple`, `indigo`, `blue`, `cyan`, `mint`, `green`, `yellow`, `orange`, `red`), and `indigo-text`, an accessible indigo for text (see below). Use them as `bg-black-10`, `text-black-40`, `border-black-10` or `var(--color-black-10)`. In dark mode, `black-10` and `black-4` get the design's stronger alpha (15% and 10%); the Tailwind modifiers `black/10` and `black/4` keep one alpha in both modes.
- **Typography:** `text-12` … `text-64` (the Figma text styles: font size and line height), Inter with `font-feature-settings: "ss01" 1, "cv01" 1`.
- **Radius:** `rounded-4` … `rounded-80` (the Figma corner radius scale).
- **Spacing:** the Figma spacing and size values are multiples of 4px, so Tailwind's spacing utilities (`p-1` = 4px, `gap-3` = 12px, `size-10` = 40px) cover them.
- **Focus:** the `focus-ring` utility is the keyboard focus indicator of every component: on `:focus-visible` it draws the Figma "Focus" ring (`ring-4 ring-focus`) plus a 2px `black-80` outline offset by 2px. Use it on your own focusable elements: `<button className="focus-ring">`.
- **Effects:** `shadow-1`, `shadow-2`, `shadow-glow`, `shadow-glass-1`, `shadow-glass-2`, `inset-shadow-inner`, the Figma focus ring `ring-4 ring-focus` (or `shadow-focus`), the background blurs `backdrop-blur-bg-40` (20px) and `backdrop-blur-bg-100` (50px), and `glass` / `glass-1` / `glass-2`, which approximate Figma's Glass effects with a fill, a background blur and a shadow.

The package doesn't load Inter. Load it yourself; the Google Fonts build of Inter doesn't include the `ss01` / `cv01` features, the build from [rsms.me/inter](https://rsms.me/inter/) does.

Old token names (`brand`, `bg1`…`bg5`, `brand-hover` and the shadcn-style `background`, `foreground`, `muted`, `accent`, `destructive`, `input`, `ring`…) still work as deprecated aliases; see the [changelog](CHANGELOG.md) for the mapping.

## Accessibility deviations from the Figma kit

This is a reference implementation, so where the Figma kit conflicts with WCAG 2.2 AA, accessibility wins. Contrast ratios are against `background-1` (#FFF light, #333 dark) unless stated otherwise.

| Where | Figma | Library | Why |
| --- | --- | --- | --- |
| Focus indicator (all controls) | "Focus" effect: 4px ring, black 4% (1.1:1); no focus state on Button or Tab | `focus-ring`: the Figma ring plus a 2px `black-80` outline, offset 2px — 12.6:1 light, 8.7:1 dark | 2.4.7, 1.4.11 |
| Inactive tabs, off toggles, Bare buttons, the Tag close icon | 40% layer opacity | 100% while keyboard-focused, so the focus ring isn't dimmed | 1.4.11 |
| Filled Button label, checked Checkbox mark | `#FFF` in both modes: 2.07:1 on the dark-mode indigo Primary | the per-mode `white` token: white on black (21:1), black on indigo (10.15:1) | 1.4.3, 1.4.11 |
| Badge number | `#FFF` on indigo, 2.07:1 | black on indigo, 10.15:1 | 1.4.3 |
| Indigo text: default Link, active Tag | Secondary/Indigo `#ADADFB`: 2.07:1 on white | `indigo-text`: `#5B5BD6` in light mode (5.37:1; 5.04:1 on the active Tag tint), `#ADADFB` in dark mode (6.11:1). Fills keep the Figma indigo | 1.4.3 |
| Default Link hover | colour change only | colour change plus an underline | 1.4.1 |
| External Link | — | `target="_blank"` and `rel="noopener noreferrer"` by default, and a visually hidden "(opens in a new tab)" (`externalLabel`) | 3.2.5 (advisory) |
| Tag close button | a 12px icon | the same icon with a 24×24px hit area | 2.5.8 |
| Icon-only tabs | — | a development warning without `aria-label` / `aria-labelledby` | 4.1.2 |
| Dark Tooltip in dark mode | Black/80% flips to white/80% but the text stays `#FFF` | the text flips with it (black on white/80%) | 1.4.3 |

Known gaps (Figma values kept for now): the Black/20% rings of unchecked Checkbox and Radio and the 0.5px Black/20% Input stroke (1.6:1), the Switch's white thumb on the dark-mode indigo track (2.07:1), Black/20% placeholders, the 40% Link arrow and external icon, and the Black/4% highlight of menu items.

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
