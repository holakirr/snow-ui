---
"@holakirr/snow-ui": minor
---

New `Progress` and `ProgressCircle`, built on Radix Progress (`role="progressbar"`).

- `Progress` is a linear bar, the continuous sibling of the Figma Strip: a Black/100% fill on a Black/10% track with rounded ends, `thickness` 2, 4 (default), 6 or 8px. It fills from the start side, so from the right in right-to-left text.
- `ProgressCircle` draws the same on the ring of the kit's "Loading A" icon, filled clockwise from the top, `size` 12–48px (24 by default).
- `value` of `max` (100 by default), clamped to the range. Without a value both are indeterminate: a bar crosses the track, the ring turns. For reduced motion they pulse instead of moving, and value changes don't animate.
- The value is read out as a percentage and the bar is named "Progress" unless you give it an `aria-label` or `aria-labelledby`: new `SnowUIProvider` messages `progress.label` and `progress.value(value, max)`; `getValueLabel` overrides the value text.
- The colours are the `--progress-fill` and `--progress-track` custom properties.
