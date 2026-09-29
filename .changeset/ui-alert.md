---
"@holakirr/snow-ui": minor
---

New `Alert` (a callout), with `AlertTitle` and `AlertDescription`: a message in the page flow in the kit's Card shape (radius 16, padding 12/16), tinted with a Secondary colour, with a 20px status icon, a 14 Semibold title and a `text-secondary` description.

- `status`: `default` (neutral, the default), `info`, `success`, `warning` or `error`. Warnings and errors are `role="alert"` (announced at once), the others `role="status"`; pass `role` to change it (e.g. `role="note"` for a static callout).
- Accessible colours: the text stays black and `text-secondary` on every tint (5.2:1 or more), and the icons are darker versions of the Secondary colours (3.6:1 or more, where the Figma colours are 1.5–2:1 on white). The fill and icon colours are the `--alert-fill` and `--alert-icon` custom properties.
- The status is read before the content as visually hidden text ("Error"), so it doesn't depend on colour.
- `action` (e.g. a Button) sits after the text or under it when the alert is narrow; `onDismiss` adds a dismiss button. `icon` replaces the icon (`null` hides it).
- `asChild` on `Alert`, `AlertTitle` and `AlertDescription` (a `<section>`, a heading, a paragraph).
- New `SnowUIProvider` messages: `alert.dismiss` and `alert.info` / `success` / `warning` / `error`, overridden by `dismissLabel` and `statusLabel`.
