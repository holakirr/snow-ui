---
"@holakirr/snow-ui": minor
---

Toasts can stack. `<Toaster limit={3} />` shows up to three toasts at once, like Sonner: the newest in front, the older ones peeking out above it, smaller, and the stack spreads into a list while the pointer is on it or focus is in it (F8), which also pauses their timers; `expand` keeps it spread. Over the limit, the oldest toast now closes with its exit animation instead of vanishing. The default `limit` is 1, so a new toast still replaces the visible one; each `<Toaster id>` keeps its own limit. The toast keeps the Figma look.

- `ToastClose` has a 24px hit area in both sizes (it was 16px small, 20px large; WCAG 2.5.8).
- `Toast` no longer passes `status` to the DOM as an invalid `status` attribute: it sets `data-status` instead.
- `ToastViewport` accepts a `ref`.
- **Deprecated:** the `reducer` export of the toast store. It is internal, no longer the store's reducer, and will be removed in 6.0; use `toast()`, `useToast()` and `<Toaster limit>`. It keeps its 5.0 behaviour and warns once in development.
