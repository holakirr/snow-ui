---
"@holakirr/snow-ui": patch
---

`Avatar` hover, in a link or a button, now follows the kit's Component state as read in Figma: a photo zooms in (×1.125 inside the round clip) instead of getting a `color-1` underlay, and initials grow from 12 Regular to 14 Semibold (by 14/12 in the bigger avatars) on a lighter fill: White/40% layered over `color-2`, or over a fill you set with `className`. The icon fallback's Black/20% fill is unchanged; the zoom has no transition with reduced motion.
