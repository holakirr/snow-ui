---
"@holakirr/snow-ui": minor
---

`Separator` draws the rest of the Figma "Line" set: `count` (2 to 8 parallel lines, stacked, or side by side when vertical, spread like the Figma frames: the outer lines 8px apart for 2, 16 for 3, 32 for 4 and 5, 40 for 6 to 8) and `arrow` (an arrowhead at the `start`, `end`, `left` or `right` end of a horizontal line; `start` and `end` follow the text direction). The lines are drawn in the text colour, Black/10% by default: a `text-*` class sets it (`text-black` is the Figma Line's Black/100%). The single line is drawn the same way now, so `text-*` works on it too; it looks the same, and a `bg-*` class still wins.
