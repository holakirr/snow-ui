---
"@holakirr/snow-ui-charts": minor
---

New package: charts in the SnowUI design, built on [Recharts](https://recharts.github.io) 3.

- **Ready-made charts:** `LineChart` (smooth lines, dashed series, a dashed projection after `projectionFrom`), `AreaChart` (gradient fills, stacking), `BarChart` (grouped or stacked, horizontal, per-category colours, 28px bars with an 8px radius), `DonutChart` (the "Traffic by Location" ring with a legend of shares and a centre label) and `Sparkline` (for KPI cards).
- **Composable parts:** `ChartContainer`, `ChartTooltip` / `ChartTooltipContent` and `ChartLegend` / `ChartLegendContent` around your own Recharts charts. A `ChartConfig` names each series and gives it a SnowUI colour token (`primary`, `indigo`, `cyan`…) as a CSS custom property, so charts follow dark mode and scoped themes.
- **Accessible:** every chart is a named `<figure>` with a visually hidden data table, keyboard navigation between data points (← / →) announced through a live region, and a development warning when it has no name.
- **Localized:** numbers follow the `SnowUIProvider` locale (or the `locale` prop); in right-to-left text the axes mirror.

Import `@holakirr/snow-ui-charts/styles.css` after the `@holakirr/snow-ui` stylesheet (`index.css` or `theme.css`), whose tokens the charts use.
