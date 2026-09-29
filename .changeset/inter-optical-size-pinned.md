---
"@holakirr/snow-ui": patch
---

Smaller self-hosted Inter. The font files behind `@holakirr/snow-ui/fonts.css` and `fonts-italic.css` now pin Inter's optical-size axis at 14, the text optical size that the design uses at every size (the base layer already sets `font-optical-sizing: none`, so browsers never drew another one). The glyphs are unchanged and the files are 32–39% smaller: the Latin file goes from 105 kB to 69 kB, and all upright files together from 550 kB to 354 kB. The weight axis stays variable (100–900).

If your own CSS turns optical sizing back on (`font-optical-sizing: auto`), large text now keeps the text shapes. To get Inter's display shapes, load Inter yourself.

The package README now shows how to preload the Latin file (`<link rel="preload" as="font" crossorigin>`, or `preload()` from `react-dom`).
