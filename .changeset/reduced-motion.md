---
"@holakirr/snow-ui": patch
---

Reduced motion (WCAG 2.3.3): with the OS setting `prefers-reduced-motion: reduce`, the `--animate-slide-*` and `--animate-zoom-*` tokens of `theme.css` fade instead of moving, so Dialog and Sheet backdrops, Sheet, Popover, the menus, Select, Tooltip, Toast and CommandPalette fade in and out with the same timing, and the Accordion opens and closes without animating its height. The Skeleton stops pulsing, a pressed Button doesn't shrink, the Switch thumb and the Accordion chevron jump instead of sliding and turning, and a Dialog only fades in.
