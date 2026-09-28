---
"@holakirr/snow-ui": minor
---

Styles for projects on Tailwind CSS v4, self-hosted Inter, and design tokens as DTCG files.

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
