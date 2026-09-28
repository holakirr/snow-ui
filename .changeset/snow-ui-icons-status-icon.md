---
"@holakirr/snow-ui-icons": minor
---

`StatusIcon` uses the SnowUI Figma Toast icons and colours:

- `success` is a filled `CheckCircle` (was `Check`) in Secondary/Green.
- `error` is a filled `Warning` in Secondary/Yellow (was meant to be red).
- The colours are `var(--color-green, #71dd8c)` and `var(--color-yellow, #fc0)`, so they follow the `@holakirr/snow-ui` tokens and fall back to the Figma values without them. Before, the icons used the classes `fill-secondary-green` / `fill-secondary-red`, which no stylesheet defined, so they rendered in the text colour.
- `progress` no longer adds the undefined `fill-black-100` class or an invalid inline `fill`; it uses the text colour.

A `color` prop or a `style.color` still overrides the colour, and `weight` overrides the filled weight.

The colours are light and meant for dark surfaces such as the toast (5:1 or more there); they don't reach 3:1 on white.
