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
- **`@holakirr/snow-ui/fonts.css`** (opt-in): self-hosted [Inter](https://rsms.me/inter/) 4.1, the rsms build that has the `ss01` / `cv01` features the design turns on (the Google Fonts build doesn't). Variable weight 100–900, `font-display: swap`, split by `unicode-range` (about 105 kB for Latin); SIL Open Font License, in `dist/fonts/LICENSE.txt`. The font files are exported as `@holakirr/snow-ui/fonts/*`, e.g. for preloading.
- **Cascade layers**: react-day-picker's stylesheet is now in `@layer components` in both stylesheets (it was unlayered in `index.css`), so every rule of `index.css` is in one of Tailwind's layers and your unlayered CSS overrides the library predictably. Side effect: Tailwind utilities now override react-day-picker's defaults, so in a `Calendar` with `captionLayout="dropdown"` the month and year dropdowns are 4px apart (the component's `gap-1`) instead of react-day-picker's 8px. Nothing else in `index.css` changes.
- **Design tokens** are now [W3C Design Tokens (DTCG)](https://www.designtokens.org/) files in the repository (`packages/ui/tokens`: colours with light and dark modes, text styles, radius, effects), generated into the stylesheets and the Storybook Foundations pages with Terrazzo. No token value changed; the deprecated aliases keep working.
