---
"@holakirr/snow-ui": patch
---

The contrast tokens (`control-border`, `control-border-strong`, `placeholder`, `control-border-invalid`) now have their two levels as variables of every theme scope, `--color-<name>--standard` and `--color-<name>--more`, which a theme of yours overrides like any token. Overriding `--color-<name>` itself replaced the value that each theme and contrast scope computes, so it lost the high-contrast level (or came back inside a `data-contrast` scope); the Theming and Contrast guides show the levels instead.
