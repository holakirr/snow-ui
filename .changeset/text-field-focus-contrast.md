---
"@holakirr/snow-ui": patch
---

With more contrast (`prefers-contrast: more` or `data-contrast="more"`), the focus stroke of `Input`, `InputSmall`, `Textarea`, `Search`, `Combobox` and `MultiSelect` is 2px instead of 1px: its inner pixel was the fill, so a focused field differs from an unfocused one by at least 5.59:1 (WCAG 2.4.7, 1.4.11). The standard contrast keeps the Figma 0.5px Black/40% stroke (2.85:1 on the fill), now listed in the README's known gaps. The exported `focusInputClasses` carries the new `contrast-more:focus:inset-ring-2`.
