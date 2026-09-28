---
"@holakirr/snow-ui": minor
---

Scoped themes: `data-theme="dark"` now works on any element, not only `<html>`. Its subtree gets the SnowUI-Dark token values (before, only `dark:` utilities switched and the tokens kept the page's values), and `data-theme="light"` inside a dark subtree switches back. See "Scoped themes" in the README.

- The token values are declared on `:root, [data-theme="light"]`, on `[data-theme="dark"]` and, for the OS preference, on `:root:not([data-theme="light"])` in `@media (prefers-color-scheme: dark)`. Tokens built from other tokens (`primary-hover`, `primary-hover-strong` and the deprecated aliases such as `brand`, `bg1`, `foreground`) are re-declared in every scope so they follow it too. The deprecated `--black` / `--white` / `--brand` / `--bg*` channels follow the same scopes.
- `color-scheme` is set to `light` or `dark` with the theme, so native form controls, scrollbars and the default page colours match. With the OS in dark mode and no `data-theme` on `<html>`, the page canvas and default text colour are now dark as well; pin `<html data-theme="light">` if your app has no dark mode.
- The `dark:` variant no longer matches inside a `data-theme="light"` element nested in a dark scope.
- Overlays (`Dialog`, `Popover`, `Select`, menus, `Tooltip`, `Sheet`, `CommandPalette`) are portalled to `<body>`, so they take the theme of `<html>`; pass `data-theme` to their `*Content` component to scope them.
- `CommandPalette`: the loading spinner turns around its centre (it used to swing around the icon box).
