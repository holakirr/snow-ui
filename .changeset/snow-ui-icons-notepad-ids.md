---
"@holakirr/snow-ui-icons": patch
---

`NotepadIcon` generates the ids of its gradients with `useId`, so several Notepad icons on a page no longer share the same hard-coded ids (duplicate DOM ids), and an icon no longer loses its gradients when the first one on the page is hidden or removed. The README now names the icons `StatusIcon` renders: the filled `Warning` and `CheckCircle` (it said `Check`).
