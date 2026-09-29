---
"@holakirr/snow-ui": minor
---

Pointer targets of at least 24×24px (WCAG 2.5.8), without visual changes:

- New `hit-area` utility in `theme.css`: an invisible hit area of at least 24×24px centred on a smaller control, drawn by its `::after` (the element needs `relative` and no `::before` or `::after` of its own). It only adds the empty space around the control: its `::before` keeps each control's own box over every other hit area, so a click on a control's visible edge is never taken by a neighbour's hit area. Controls closer than 24px share the space between them (the later one gets it).
- `Switch` (28×16), bare `Button`s (no box, as small as their icon or text), the `Slider` thumb (16px), sortable `TableHead` buttons (16px high), line `TabsTrigger`s (22px high in the small size) the `Search` clear button (16px) and `Calendar`'s "Today" and "Last selection" actions (20px high) use it.
- The `Search` input fills the field's 28px height instead of sitting 20px high inside its padding, so a click anywhere on the field's height focuses it.
