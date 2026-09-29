---
"@holakirr/snow-ui": minor
---

New `AlertDialog`, for confirmations the user must answer before going on ("Delete this project?"). It is built on Radix AlertDialog and reuses the Dialog's mask, motion and glass popup, as one 448px card: `AlertDialogTitle` (24 Semibold) and `AlertDialogDescription` in `AlertDialogHeader`, and `AlertDialogCancel` (a Gray `lg` Button, "Cancel" by default) and `AlertDialogAction` (a Filled `lg` Button) in `AlertDialogFooter`. `AlertDialogTrigger`, `AlertDialogPortal` and `AlertDialogOverlay` are exported too.

- `role="alertdialog"`: opening focuses Cancel, Tab stays inside, Escape and Cancel close it without the action, and a click on the mask does nothing (the focus stays in the dialog).
- `<AlertDialogAction variant="destructive">` is a red Filled button (`red-text` with the `white` label: 5.21:1 in light mode, 8.65:1 in dark mode); the action and Cancel also take any Button variant and size. `event.preventDefault()` in the action's `onClick` keeps the dialog open (e.g. while a request runs).
- The buttons sit side by side and stack, the action on top, when they don't fit (a phone, long labels).
- The Cancel label is `messages.alertDialog.cancel` in `SnowUIProvider` messages; the content takes the provider's `dir`.
