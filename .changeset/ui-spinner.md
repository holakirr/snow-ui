---
"@holakirr/snow-ui": minor
---

New `Spinner`: the ring of the kit's "Loading A" icon, turning in the current text colour, at the kit's icon sizes (`size` 12–48px, 20 by default). It is a `role="status"` region with visually hidden "Loading" (`label`, or the new `spinner.label` message of `SnowUIProvider`). It animates in CSS, so for reduced motion the ring stops turning and pulses instead. Pass `aria-hidden` when visible text next to it already says that something is loading (e.g. in a busy button). A full translation typed as `Messages` needs the new namespace too (or type a partial one as `MessagesOverrides`).
