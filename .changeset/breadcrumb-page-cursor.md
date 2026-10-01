---
"@holakirr/snow-ui": patch
---

`BreadcrumbPage` shows the arrow cursor. Its `aria-disabled` gave it the not-allowed cursor of disabled controls, but the current page isn't disabled, and the kit's disabled cursor is the arrow too.
