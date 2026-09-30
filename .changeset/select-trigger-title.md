---
'@holakirr/snow-ui': minor
---

**`SelectTrigger` gets `title`**: the Figma "2 row" field of a form, as `Input`'s `title` — a 12/16 `text-secondary` title inside the field above the value, which names the trigger (`aria-labelledby`) unless `aria-label` or `aria-labelledby` does.

**What changes for you:** `title` used to reach the `<button>` as the native tooltip attribute; it now shows the title in the field instead. For a tooltip, wrap the trigger in `Tooltip`.
