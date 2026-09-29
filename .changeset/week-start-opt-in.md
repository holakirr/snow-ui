---
'@holakirr/snow-ui': minor
---

**`SnowUIProvider` gets `weekStartsOn`**: the first day of the week of `Calendar`, `DatePicker`, `DateRangePicker` and `Scheduler` under it, unless their own `weekStartsOn` (`startOfWeek` on `Scheduler`) is set. It takes a day (`0` for Sunday … `6` for Saturday), or `"locale"` for the locale's first day (`locale.options.weekStartsOn`: Sunday with the default `enUS`, Monday with `ru` and most European locales). Nested providers inherit it; its type is exported as `WeekStart`.

```tsx
<SnowUIProvider locale={enUS} weekStartsOn="locale">
  <DatePicker /> {/* weeks start on Sunday */}
</SnowUIProvider>
```

**What changes for you:** nothing without it. The week still starts on Monday, as in 5.0 and the Figma kit, whatever the locale.

**Planned for 6.0:** `"locale"` becomes the default. To keep the Monday start then, set `weekStartsOn={1}` on the provider (or on the components).
