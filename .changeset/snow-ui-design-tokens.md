---
"@holakirr/snow-ui": major
---

Align the design tokens with the SnowUI Figma kit (SnowUI-Light and SnowUI-Dark modes). Colors, typography, radius and effects now use the Figma names and values, and Storybook has a new "Foundations" section that lists every token.

**New tokens**

- Colors: `primary`, `primary-hover`, `primary-hover-strong`, the Figma alpha steps `black-80`/`-40`/`-20`/`-10`/`-4` and `white-80`/`-40`/`-20`/`-10`/`-4`, `background-1`/`-2`/`-3`, `surface-1`/`-2`/`-3`, `color-1`, `color-2`, `static-white`, `static-black`. Use them as `bg-black-10`, `text-black-40`, `border-black-10` or `var(--color-black-10)`. In dark mode `black-10` and `black-4` use the design's 15% and 10% alpha, which the Tailwind modifiers `black/10` and `black/4` can't express. The modifiers keep working as before.
- Typography: `text-12` … `text-64` (font size and line height of the Figma text styles).
- Radius: `rounded-4`, `-8`, `-12`, `-16`, `-20`, `-24`, `-28`, `-32`, `-40`, `-48`, `-80`.
- Effects: `shadow-1`, `shadow-2`, `shadow-focus`, `shadow-glow`, `shadow-glass-1`, `shadow-glass-2`, `inset-shadow-inner`, `ring-focus`, `backdrop-blur-bg-40` (20px), `backdrop-blur-bg-100` (50px), and the `glass`, `glass-1` and `glass-2` utilities, which approximate Figma's Glass effects.
- All token CSS variables are always emitted, even when no utility uses them.

**Deprecated names.** These still work as aliases and will be removed in the next major:

| Old | New |
| --- | --- |
| `brand` | `primary` |
| `brand-hover` | `primary-hover-strong` |
| `bg1` | `background-1` |
| `bg2` | `background-2` |
| `bg3` | `color-1` |
| `bg4` | `color-2` |
| `bg5` | `surface-1` |
| `background` | `background-1` |
| `foreground`, `accent-foreground` | `black` |
| `muted` | `black-4` |
| `muted-foreground` | `black-40` |
| `accent` | `black-10` |
| `destructive` | `red` |
| `input`, `sidebar-border`, `white-border` | `black-10` |
| `ring` | `primary` |
| `--black`, `--white`, `--brand`, `--brand-hover`, `--bg1`, `--bg2`, `--bg5` (comma-separated channels) | `--color-*` variables |

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
