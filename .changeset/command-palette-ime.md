---
'@holakirr/snow-ui': patch
---

`CommandPalette` no longer selects the highlighted item with the Enter that commits an IME composition in Safari (WebKit sends it with `keyCode` 229 and `isComposing` false).
