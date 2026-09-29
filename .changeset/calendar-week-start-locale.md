---
'@holakirr/snow-ui': minor
---

**`Calendar` starts the week on the locale's first day** (`locale.options.weekStartsOn`, from its `locale` prop or `SnowUIProvider`'s) instead of always on Monday: Sunday with the default English (`enUS`) locale, Monday with `ru` and most European locales. `DatePicker` and `DateRangePicker` follow the same rule. An explicit `weekStartsOn` still wins over the locale.

**What changes for you:** a Calendar without `weekStartsOn` in an English (or other Sunday-first) locale now shows Sunday as the first column. To keep the Figma kit's Monday start whatever the locale, pass `weekStartsOn={1}`.
