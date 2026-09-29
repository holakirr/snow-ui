---
"@holakirr/snow-ui": patch
---

**Link:** a link without an `href` (an `onClick` link, or an `asChild` element without one) is activated by Enter, as the WAI-ARIA link pattern expects: it was focusable (`role="link"`, `tabIndex={0}`) but the browser doesn't activate an `<a>` without an `href`, so its `onClick` was out of reach from the keyboard. Space doesn't activate it, a held key clicks once, and your `onKeyDown` can prevent it; an `<a href>` or a `<button>` rendered with `asChild` is left to the browser.
