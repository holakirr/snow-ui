---
"@holakirr/snow-ui": minor
---

Dark mode also follows the `dark` class, and `theme.css` no longer needs an `@source`.

- **`.dark` / `.light` classes.** The theme scopes and the `dark:` variant now accept the `dark` and `light` classes next to `data-theme="dark"` / `"light"`, on `<html>` or on any element. Apps that switch themes with a class (next-themes with `attribute="class"`, shadcn/ui) get the SnowUI dark tokens without also setting `data-theme`. The OS preference now applies only when `<html>` sets no mode: `data-theme`, or the `light` / `dark` class. Nothing changes for apps that use `data-theme`. If you redeclare tokens for the OS preference, use the new selector `:root:not([data-theme], .light, .dark)` (see Theming → Changing a token).
- **`theme.css` registers its own `@source`.** The published `theme.css` adds the package's built components to Tailwind's sources, relative to its own file, so Tailwind v4 projects only need `@import "tailwindcss"; @import "@holakirr/snow-ui/theme.css";`. The `@source "../node_modules/@holakirr/snow-ui/dist"` line, which broke when node_modules wasn't next to the stylesheet (monorepos, pnpm), is no longer needed; keeping it does no harm.
