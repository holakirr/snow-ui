---
"@holakirr/snow-ui": minor
---

New stylesheet `@holakirr/snow-ui/theme-core.css`: `theme.css` without the `@source` of the package's components. `theme.css` adds the built components to Tailwind's sources, so a Tailwind v4 project generates the classes of every component, whether it renders them or not. Projects that copy the components (the `@snow-ui` shadcn registry) or only use the tokens import `theme-core.css` instead, and Tailwind generates only the classes of their own code: about 55 kB instead of 140 kB of minified CSS (11 kB instead of 22 kB gzipped) in a Next.js app with one copied Button. Nothing changes for `theme.css`.
