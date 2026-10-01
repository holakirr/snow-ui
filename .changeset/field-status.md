---
"@holakirr/snow-ui": minor
---

The kit's In progress and Done field states, opt-in: `status` on `Input` (`"progress" | "success"`, type `InputStatus`) and on `Search` (`"progress"`).

- `Input`: `progress` shows the turning ring of `Spinner` in Black/100% after the end content (an invalid field's Warning hides while it turns) and sets `aria-busy="true"` on the input; `success` shows a 16px `Check` in Secondary/Green (green mixed with 40% black with more contrast: 4.4:1), hidden while the field is invalid. A visually hidden `role="status"` region announces a change of status: "Checking" and "Valid" (the new optional `messages.input.progress` and `messages.input.success`), or `statusLabel`.
- `Search`: `progress` shows the ring in place of the clear button or the shortcut hint and sets `aria-busy="true"`; your results region announces the results. An `aria-busy` of your own is kept without a status.

The ring stops turning for reduced motion, as Spinner's does. Without `status` nothing changes.

The end of an `Input` reads: end content, status icon, clear button, Warning. The kit draws them one at a time, each 16px from the end; in this order each keeps that place in its own state, and a field never shows two status marks.
