# Changelog

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
