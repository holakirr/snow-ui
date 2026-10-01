---
"@holakirr/snow-ui": minor
---

`Toggle` and `ToggleGroup` get `variant="filled"`, the toggle counterpart of `TabsList variant="filled"`: a `ToggleGroup` puts its items on the Pill track (the same padding, gap and radius), and an item that is on is a Filled button, Primary with the per-mode `white` label (white on black, black on the dark-mode indigo, 10.15:1), which hover and focus keep. Off, the items are Borderless in `text-secondary`, as before. `ToggleVariant` and `TOGGLE_VARIANTS` include `filled`; keyboard behaviour is unchanged.
