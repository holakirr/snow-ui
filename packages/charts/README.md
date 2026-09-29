# @holakirr/snow-ui-charts

Charts in the [SnowUI design](https://snowui.byewind.com), built on [Recharts](https://recharts.github.io) 3: ready-made line, area, bar, donut and sparkline charts, and the composable parts to build your own. A companion package of [`@holakirr/snow-ui`](https://www.npmjs.com/package/@holakirr/snow-ui), whose design tokens it uses.

[Storybook](https://snow-ui.holakirr.com/?path=/docs/charts-chartcontainer--docs)

## Installation

```bash
bun add @holakirr/snow-ui-charts @holakirr/snow-ui react react-dom
```

Peer dependencies: `react` and `react-dom` 19, and `@holakirr/snow-ui` 5. `recharts` (and `react-is`, which Recharts needs) come with the package.

Load the SnowUI stylesheet (the tokens) and the charts' own stylesheet after it:

```tsx
import '@holakirr/snow-ui/index.css' // or '@holakirr/snow-ui/theme.css' in a Tailwind v4 project
import '@holakirr/snow-ui-charts/styles.css'
```

`styles.css` is plain CSS (under 2 kB compressed): the tooltip, the legend, the empty and loading states, the focus ring and the donut centre. Every rule is in the `components` cascade layer and reads the tokens of `@holakirr/snow-ui` (`var(--color-*)`, `var(--text-*)`, `var(--radius-*)`…), so it works with `index.css` and with `theme.css`, follows dark mode and [scoped themes](https://www.npmjs.com/package/@holakirr/snow-ui#scoped-themes), and your own CSS overrides it. In a Tailwind v4 stylesheet you can import it there too (`@import "@holakirr/snow-ui-charts/styles.css";`).

## Usage

```tsx
import { BarChart, LineChart } from '@holakirr/snow-ui-charts'

const revenue = [
  { month: 'Jan', current: 8000, previous: 6000 },
  { month: 'Feb', current: 16000, previous: 11000 },
  // …
]

<LineChart
  title="Revenue"
  description="The current week ends at $26K, the previous week at $29K."
  data={revenue}
  xKey="month"
  config={{
    current: { label: 'Current week', color: 'primary' },
    previous: { label: 'Previous week', color: 'cyan', dashed: true },
  }}
  valueFormatter={(value) => `$${value.toLocaleString('en-US')}`}
/>
```

| Component | For |
| --- | --- |
| `LineChart` | Trends: smooth 1px lines, `dashed` series, a dashed projection after `projectionFrom`, `fade`, `dots`. |
| `AreaChart` | A line chart filled with a gradient of each series' colour (`opacity`, 10% by default); `stacked`, as lines can be too. |
| `BarChart` | Amounts per category: grouped or `stacked`, `horizontal`, per-category colours (`colorBy="category"`), 28px bars with an 8px radius. |
| `DonutChart` | Shares of a whole: a 120px ring with a legend of percentages, `centerLabel` / `centerValue`. |
| `Sparkline` | A tiny trend line for KPI cards: plain SVG (about 2.3 kB with its data table), rendered on the server too. |
| `ChartContainer` | The frame of any Recharts chart: config → CSS variables, sizing, tooltip and legend context, accessibility. |
| `ChartTooltip`, `ChartTooltipContent` | The SnowUI tooltip (`dark`, the Figma chart tooltip, or `light` glass). |
| `ChartLegend`, `ChartLegendContent` | The SnowUI legend (a dot and a label, optional values). |

The cartesian charts share `grid`, `xAxis`, `yAxis`, `xTickFormatter`, `yTickFormatter`, `tickCount`, `domain`, `tooltip`, `legend`, `legendValues`, `animate` and the `ChartContainer` props (`title`, `description`, `height`, `loading`, `emptyMessage`, `valueFormatter`, `categoryFormatter`, `locale`, `dir`…).

### Config and colours

A `ChartConfig` names and colours the series:

```ts
const config = {
  desktop: { label: 'Desktop', color: 'primary' },
  mobile: { label: 'Mobile', color: 'mint', dashed: true },
} satisfies ChartConfig
```

`color` is a SnowUI token (`primary`, `black`, `black-80` … `black-10`, `purple`, `indigo`, `blue`, `cyan`, `mint`, `green`, `yellow`, `orange`, `red`) or any CSS colour; without one a series takes the palette (`chartPalette`). `ChartContainer` sets `--chart-<key>` custom properties from it, so charts follow the theme, and `seriesColor(key)` gives you `var(--chart-<key>)` for your own Recharts elements.

### Composable charts

```tsx
import { Bar, BarChart, XAxis } from '@holakirr/snow-ui-charts/recharts'
import { ChartContainer, ChartLegendContent, ChartTooltip, seriesColor } from '@holakirr/snow-ui-charts'

<ChartContainer
  config={config}
  title="Visitors"
  data={data}
  categoryKey="month"
  legend={<ChartLegendContent />}
>
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <Bar dataKey="desktop" fill={seriesColor('desktop')} radius={8} />
    <Bar dataKey="mobile" fill={seriesColor('mobile')} radius={8} />
    <ChartTooltip />
  </BarChart>
</ChartContainer>
```

Import the Recharts parts from `@holakirr/snow-ui-charts/recharts`: it re-exports the Recharts this package depends on (the whole API), so your parts and `ChartContainer` / `ChartTooltip` share one copy (Recharts keeps the chart size and the tooltip state per copy). Importing `recharts` directly works only when it resolves to that same copy, i.e. the same version, deduplicated by your package manager.

## Accessibility

- Every chart is a `<figure>` named by `title` (or `aria-label` / `aria-labelledby`, e.g. the card's heading) and described by `description`; a development warning flags a chart without a name. The name is given once: the table has no caption and the focusable plot is named "Data points" (`navigationLabel`).
- The data is also a visually hidden `<table>` (row and column headers, formatted values): the chart's text alternative for screen readers.
- Recharts' accessibility layer makes the chart focusable: Tab shows the first point, ← / → move between points (mirrored in right-to-left text), and the values are announced through a live region. The donut, whose legend already lists every value, is not a tab stop.
- Axis labels use `text-secondary` (Figma: Black/40%), like all secondary text of the library. The pastel secondary colours are below 3:1 on light backgrounds; every value is also text (table, tooltip, donut legend), so colour is never the only way to read the chart.
- Animations respect `prefers-reduced-motion`.

The plot is drawn once the web font of its text has loaded (Recharts measures labels only when it first draws), at most 3 seconds after mount; the figure then gets `data-chart-ready`, which screenshot tests can wait for.

## Localization and RTL

Numbers follow the `locale` prop, else the language of the nearest `SnowUIProvider` (`locale.code`), else `en-US`. Right-to-left charts (the `dir` prop, the provider's `dir`, or the element's computed direction) mirror their axes: categories run from right to left, the value axis is on the right, the tooltip opens to the left. `emptyMessage`, `loadingLabel` and `keyboardHint` are props for your translations.

## Why `@holakirr/snow-ui` is a peer dependency

The charts need its stylesheet (the tokens) and read the locale and direction of its `SnowUIProvider` through `useSnowUI()`. It is already installed for the stylesheet, so this adds no install; bundlers only include the provider's module from it (the package is side-effect free), and without a provider the charts fall back to `en-US` and the element's direction.

## License

[MIT](LICENSE)
