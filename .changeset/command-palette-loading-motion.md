---
"@holakirr/snow-ui": patch
---

`CommandPalette`, `Combobox` and `MultiSelect`: the loading spinner in the field is the `Spinner` ring, turned by CSS, so it stops turning (and pulses) with reduced motion (`prefers-reduced-motion: reduce`, WCAG 2.3.3). It was `LoadingAIcon`, which animates with SVG `<animate>` that CSS doesn't stop. At rest it shows the ring's arc instead of the icon's first frame.
