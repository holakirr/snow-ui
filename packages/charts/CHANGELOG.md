# @holakirr/snow-ui-charts

## 0.2.0

### Minor Changes

- [#176](https://github.com/holakirr/snow-ui/pull/176) [`c800cf8`](https://github.com/holakirr/snow-ui/commit/c800cf897a670f404d2ba3cfece4416def8555c0) Thanks [@holakirr](https://github.com/holakirr)! - The charts' built-in strings come from `SnowUIProvider`: `messages.charts` (`empty`, `loading`, `keyboardHint`, `navigation`, `value`, `point`, added in `@holakirr/snow-ui` 5.1) translate the empty and loading states, the keyboard hint, the name of the focusable plot and the table headers of `DonutChart` and `Sparkline`. The props (`emptyMessage`, `loadingLabel`, `keyboardHint`, `navigationLabel`, `valueLabel`, `categoryLabel`) still win, a `null` one included (`emptyMessage={null}` keeps the empty state blank, as in 0.1), and with `@holakirr/snow-ui` 5.0 the English strings are used as before. `LineChart`, `AreaChart` and `BarChart` now take `navigationLabel` (it was only on `ChartContainer`).

### Patch Changes

- [#193](https://github.com/holakirr/snow-ui/pull/193) [`50d43d9`](https://github.com/holakirr/snow-ui/commit/50d43d964f804ad4d43c095a66bdd9676c372c4d) Thanks [@holakirr](https://github.com/holakirr)! - DonutChart follows the Figma dashboards more closely: a slice coloured `primary` shades from black at the top to grey at the bottom, as in "Traffic by Location" (flat in the dark theme).

## 0.1.0

### Minor Changes

- [#167](https://github.com/holakirr/snow-ui/pull/167) [`deea1d4`](https://github.com/holakirr/snow-ui/commit/deea1d4a7266dc80fbdcc9c087ab98b6a8329fd3) Thanks [@holakirr](https://github.com/holakirr)! - New package: charts in the SnowUI design, built on [Recharts](https://recharts.github.io) 3.

  - **Ready-made charts:** `LineChart` (smooth lines, dashed series, a dashed projection after `projectionFrom`, stacking), `AreaChart` (gradient fills, stacking), `BarChart` (grouped or stacked, horizontal, per-category colours, 28px bars with an 8px radius), `DonutChart` (the "Traffic by Location" ring with a legend of shares and a centre label) and `Sparkline` (for KPI cards: plain SVG, about 2 kB, rendered on the server too).
  - **Composable parts:** `ChartContainer`, `ChartTooltip` / `ChartTooltipContent` and `ChartLegend` / `ChartLegendContent` around your own Recharts charts, whose primitives you import from `@holakirr/snow-ui-charts/recharts` (the package's own Recharts, so everything shares one copy). A `ChartConfig` names each series and gives it a SnowUI colour token (`primary`, `indigo`, `cyan`…) as a CSS custom property, so charts follow dark mode and scoped themes.
  - **Accessible:** every chart is a named `<figure>` with a visually hidden data table and a development warning when it has no name; the line, area and bar charts also move between data points with ← / →, announced through a live region (the donut and the sparkline, whose values are text beside them, are not tab stops).
  - **Localized:** numbers and dates follow the `SnowUIProvider` locale (or the `locale` prop); in right-to-left text the axes mirror and the figure takes the direction.

  Import `@holakirr/snow-ui-charts/styles.css` after the `@holakirr/snow-ui` stylesheet (`index.css` or `theme.css`), whose tokens the charts use.
