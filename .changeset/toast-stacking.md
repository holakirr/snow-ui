---
"@holakirr/snow-ui": minor
---

Toasts can stack. `<Toaster limit={3} />` shows up to three toasts at once, like Sonner: the newest in front, two older ones peeking out above it, smaller (a longer stack keeps the rest hidden behind them), and the stack spreads into a list while the pointer is on it or keyboard focus is in it (F8), which also pauses their timers; `expand` keeps it spread. The default `limit` is 1, so a new toast still replaces the visible one; each `<Toaster id>` keeps its own limit (`NaN` counts as 1, `Infinity` is allowed).

- Over the limit, the oldest toast now fades out in place behind the new one instead of vanishing; a toast dismissed with the others keeps its place too. With reduced motion the stack moves at once, and only opacity animates.
- When a focused toast is removed (over the limit, `dismiss(id)`), the timers of the others resume; before, they could stay paused, so the next toast never closed on its own.
- Toasts shown before their `<Toaster>` mounts no longer stay cut to one: a toaster registers its `limit` before the page's own effects run, and one that mounts later (lazily loaded) reopens the toasts that are still in the store, up to its limit. Without a `<Toaster>` (toasts rendered with `useToast()` and `Toast` yourself) the limit is still 1.
- `ToastClose` has a 24px hit area in both sizes (it was 16px small, 20px large; WCAG 2.5.8).
- `Toast` no longer passes `status` to the DOM as an invalid `status` attribute: it sets `data-status` instead.
- `ToastViewport` accepts a `ref`.
- **Deprecated:** the `reducer` export of the toast store. It is internal, no longer the store's reducer, and will be removed in 6.0; use `toast()`, `useToast()` and `<Toaster limit>`. It keeps its 5.0 behaviour and warns once in development.
