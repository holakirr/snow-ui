---
"@holakirr/snow-ui": patch
---

`<html data-theme="system">` (or any `data-theme` value other than `light` and `dark`, such as a theme name) follows the OS dark preference again, as in 5.0: only `data-theme="light"` / `"dark"` and the `light` / `dark` classes set a mode. It applies to the tokens and to the `dark:` variant.
