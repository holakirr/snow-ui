---
"@holakirr/snow-ui-icons": patch
---

`SnowUIIcon` (the SnowUI logo) follows `color` (`currentColor` by default) instead of hard-coded black bars and a white snowflake, so it no longer disappears in dark mode or on dark surfaces. The snowflake is now cut out of the bars with a mask (an id per icon, from `useId`), so it shows the background behind the icon; the translucent white highlights are kept. On a white page with black text it looks as before; pass `color="black"` to keep the black logo on coloured text.
