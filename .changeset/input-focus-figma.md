---
"@holakirr/snow-ui": patch
---

Text fields (`Input`, `InputSmall`, `Textarea`) use the Figma "Focus" state exactly — a Black/40% stroke and the 4px Focus ring on any focus — instead of the `focus-ring` outline, which appeared on every mouse click in a text field. Other controls keep `focus-ring` for keyboard focus.
