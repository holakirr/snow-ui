---
"@holakirr/snow-ui-charts": minor
---

The charts' built-in strings come from `SnowUIProvider`: `messages.charts` (`empty`, `loading`, `keyboardHint`, `navigation`, `value`, `point`, added in `@holakirr/snow-ui` 5.1) translate the empty and loading states, the keyboard hint, the name of the focusable plot and the table headers of `DonutChart` and `Sparkline`. The props (`emptyMessage`, `loadingLabel`, `keyboardHint`, `navigationLabel`, `valueLabel`, `categoryLabel`) still win, and with `@holakirr/snow-ui` 5.0 the English strings are used as before. `LineChart`, `AreaChart` and `BarChart` now take `navigationLabel` (it was only on `ChartContainer`).
