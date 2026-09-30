---
"@holakirr/snow-ui": minor
---

`Slider` now matches the Figma kit (a design fix: the props, the names and the keyboard are unchanged):

- **One value** is the Figma "Slider2" bar: 32px high, an 8px radius, a Black/4% track that fills with Primary (black; indigo in the dark theme; rounded at both ends) up to the value. The round white thumb is gone; its Active state (hover, drag and keyboard focus) shows a 2×8px handle line 4px inside the fill's end and darkens the value, and keyboard focus rings the whole bar (the `focus-ring` look). The thumb is still the `role="slider"` element, an invisible target at the value with a 24px hit area.
- **Two or more values** are the Figma "SliderBar" range: a 3px Black/4% track, a Primary range between 28px static white thumbs with the kit's drop shadow (0 2px 8px, black at 20%), 32px high, and the thumb's `focus-ring`. With `showValue` it is the whole SliderBar: the values 16px from the track and 16px / 12px padding, 56px high.
- New `label`: the text inside the bar at its start (white over the fill, black over the track). It names the thumb when there is no `aria-label`.
- New `showValue`: the value inside the bar at its end, or at both ends of a range (as wide as the widest of `min` and `max`, so the track doesn't move). The thumbs read the same text out (`aria-valuetext`).
- New `valueFormatter(value)`: formats the value for `showValue` and `aria-valuetext`. The default is a new optional message, `messages.slider.value(value, min, max)`: the position between `min` and `max` in percent ("28%").
- The value text is `text-secondary` on the track (`black-80` when active) and the per-mode `white` at 70% on the fill (`white-80` when active), not the Figma Black/20% and White/40% (1.6:1 and 3.66:1; WCAG 1.4.3). With more contrast the bar and the range's track get a `control-border` boundary and the range's thumbs a `control-border-strong` border.
- Invalid (`aria-invalid`): a 1px `control-border-invalid` stroke inside the bar, over the fill, or red borders on the range's thumbs. Disabled: 40% opacity, and the thumbs get `aria-disabled` (Radix set it only on the role-less root).
- Forced-colours mode (Windows High Contrast): the bar gets a border and a `Highlight` fill, the range a `GrayText` track, a `Highlight` range and bordered thumbs.
- Switching a slider between controlled and uncontrolled still logs a development warning (Radix's own no longer fires: it always gets a controlled value now).
- A range with `showValue` renders a wrapper `<div>` around the texts and the slider: `className` goes on it, the other props on the Radix root as before.
