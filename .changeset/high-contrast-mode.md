---
"@holakirr/snow-ui": minor
---

A high-contrast mode for the form controls, which meets WCAG 2.2 AA in both themes while the default keeps the SnowUI Figma look:

- It turns on with the OS setting `prefers-contrast: more` (macOS and iOS "Increase contrast"), unless `<html data-contrast="standard">`, and inside any element with `data-contrast="more"` (for your app's own setting). `data-contrast="standard"` switches a subtree back. Contrast and theme scopes combine at any depth: a `data-theme="dark"` panel in a high-contrast page gets the dark high-contrast values.
- New colour tokens, generated from the DTCG tokens like the others (the resolver has a new `contrast` modifier): `control-border` (unchecked Checkbox and Radio rings, text field and Select strokes, the Switch's off track), `control-border-strong` (their hover and focus states, the Slider thumb border, the Select chevron) and `placeholder` (native placeholders and the Search icon). By default they are the Figma Black/20% and Black/40%, so nothing changes; with more contrast they are Black/50%, Black/80% and Black/60% (White/50%, White/80% and White/75% in dark mode): at least 3:1 for boundaries and 4.5:1 for placeholders.
- With more contrast the 0.5px field strokes are 1px, the gray `InputSmall` and `Search` fields get a stroke, the Switch thumb is the per-mode `white` (black on the dark-mode indigo track, 10.14:1 instead of 2.06:1), and the highlighted menu item (DropdownMenu, ContextMenu, Select) and CommandPalette option get a 2px `black-80` ring.
- `theme.css` redefines the `contrast-more:` variant to follow the same scopes, like `dark:` (Tailwind's reads only the OS preference).

If you override `--color-black-20` or `--color-black-40` to restyle these controls, override the new tokens instead.
