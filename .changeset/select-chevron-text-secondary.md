---
"@holakirr/snow-ui": patch
---

The chevron of the `Select` trigger is `text-secondary` (Black/60%, White/70% in dark mode) instead of the Figma Black/40%, which is 2.85:1 on white, under the 3:1 of WCAG 1.4.11 for a control's icon. It is now at least 5.72:1 in light mode and 5.58:1 in dark mode, at both contrast levels; a disabled trigger's chevron is Black/20% as before.
