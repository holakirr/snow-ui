---
"@holakirr/snow-ui": minor
---

New `Image`, the Figma "Image": a rounded-square frame (the kit's squircle where the browser supports `corner-shape`) for a picture, a logo or an icon, 12 to 80px (`size`) or any size (`size="free"` with a class). Pass the `<img>` (or a framework image, a `<picture>`, an icon) as children: it fills the frame, or, with `icon`, sits inset on a Black/4% tile. For image pickers: `interactive` adds the kit's hover shading, `option` the selection mark (the kit's RadioAlt) on the top end corner, and `selected` checks the mark (or shows a 2px Primary ring without it). Unlike `Avatar`, which is round, Image is a square frame; put picker images in controls that say which one is selected.
