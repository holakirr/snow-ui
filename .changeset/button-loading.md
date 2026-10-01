---
"@holakirr/snow-ui": minor
---

`Button` gets `loading`, the kit's loading state (Guidance → Form): the content stays in place but invisible, so the button keeps its size and its accessible name, and Spinner's ring turns in the middle, the size of the button's icon (12/16/20px, 16/20/24px icon-only) in its text colour. A Filled button turns Gray (Black/4%) as in the kit; the others keep their fill, without hover or the press scale. The button gets `aria-busy` and `aria-disabled`, stays focusable, and ignores clicks, Enter and Space (no `onClick`, no form submission, no navigation with `asChild` and a link). Opt-in: nothing changes without it.
