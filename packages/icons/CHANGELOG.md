# Changelog

## 2.2.1

### Patch Changes

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`e90ac4b`](https://github.com/holakirr/snow-ui/commit/e90ac4bf4272b1021fe5276d595e8822c485701f) Thanks [@holakirr](https://github.com/holakirr)! - `SnowUIIcon` (the SnowUI logo) follows `color` (`currentColor` by default) instead of hard-coded black bars and a white snowflake, so it no longer disappears in dark mode or on dark surfaces. The snowflake is now cut out of the bars with a mask (an id per icon, from `useId`), so it shows the background behind the icon; the translucent white highlights are kept. On a white page with black text it looks as before; pass `color="black"` to keep the black logo on coloured text.

## 2.2.0

### Minor Changes

- [#157](https://github.com/holakirr/snow-ui/pull/157) [`b98db21`](https://github.com/holakirr/snow-ui/commit/b98db21adf0c16375e71d06f328d29223abc60e8) Thanks [@holakirr](https://github.com/holakirr)! - `StatusIcon` uses the SnowUI Figma Toast icons and colours:

  - `success` is a filled `CheckCircle` (was `Check`) in Secondary/Green.
  - `error` is a filled `Warning` in Secondary/Yellow (was meant to be red).
  - The colours are `var(--color-green, #71dd8c)` and `var(--color-yellow, #fc0)`, so they follow the `@holakirr/snow-ui` tokens and fall back to the Figma values without them. Before, the icons used the classes `fill-secondary-green` / `fill-secondary-red`, which no stylesheet defined, so they rendered in the text colour.
  - `progress` no longer adds the undefined `fill-black-100` class or an invalid inline `fill`; it uses the text colour.

  A `color` prop or a `style.color` still overrides the colour, and `weight` overrides the filled weight.

  The colours are light and meant for dark surfaces such as the toast (5:1 or more there); they don't reach 3:1 on white.

### Patch Changes

- [#166](https://github.com/holakirr/snow-ui/pull/166) [`8266fe8`](https://github.com/holakirr/snow-ui/commit/8266fe8e17522c4e682f20ada86d0a4265e20708) Thanks [@holakirr](https://github.com/holakirr)! - `NotepadIcon` generates the ids of its gradients with `useId`, so several Notepad icons on a page no longer share the same hard-coded ids (duplicate DOM ids), and an icon no longer loses its gradients when the first one on the page is hidden or removed. The README now names the icons `StatusIcon` renders: the filled `Warning` and `CheckCircle` (it said `Check`).

## 2.1.1

### Patch Changes

- [#149](https://github.com/holakirr/snow-ui/pull/149) [`2576127`](https://github.com/holakirr/snow-ui/commit/25761274df7395ae159a7d561ff316c8f63d53d1) Thanks [@holakirr](https://github.com/holakirr)! - Built with tsdown. CommonJS consumers get matching `.d.cts` type declarations (`require` no longer resolves to ESM-flavoured `.d.ts` types). The exported icons and API are unchanged.

## 2.1.0

### Features

- Tree-shakeable build: one file per icon, ESM (`.js`) and CJS (`.cjs`), `exports` map, `module` and `sideEffects: false`. Importing a single icon is ~1 kB instead of ~109 kB (esbuild, minified).
- `size` accepts any number or CSS length; the preset sizes still autocomplete.
- `ICON_SIZES` and `ICON_WEIGHTS` are exported.

### Fixes

- The SVG namespace is `http://www.w3.org/2000/svg`, so serialized icons render.
- Decorative icons (no `alt`, `aria-label` or `aria-labelledby`) get `aria-hidden="true"` and no `<title>`, so screen readers no longer announce them as "Icon".
- A user-provided `style` is merged with the default transition instead of replacing it.
- `StatusIcon` no longer adds a literal `undefined` class.

### Changes

- The UMD build is removed. Import from the package root (`@holakirr/snow-ui-icons`); deep imports into `dist` are no longer supported by the `exports` map.
- The root `<svg>` no longer sets `stroke`. Only `LoadingAIcon` draws with a stroke, and it now sets its own. Custom children no longer inherit a stroke from the root.
- `displayName` is no longer assigned; React DevTools uses the function names.
- `@phosphor-icons/react` does not need to be installed; the two icons used by `StatusIcon` are bundled.
