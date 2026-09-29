---
"@holakirr/snow-ui": minor
---

**`Scheduler` starts the week on the locale's first day** (`locale.options.weekStartsOn` from `SnowUIProvider`) instead of always on Monday: Sunday with the default English (`enUS`), Monday with `ru` and most European locales, like `Calendar`. An explicit `startOfWeek` still wins.

**What changes for you:** a Scheduler without `startOfWeek` in an English (or other Sunday-first) locale now shows Sunday as the first column. To keep the Figma kit's Monday start whatever the locale, pass `startOfWeek={1}`.
