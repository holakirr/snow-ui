/**
 * `@holakirr/snow-ui-charts/recharts`: Recharts itself, the copy this package
 * depends on. Import the primitives of your composable charts (`BarChart`,
 * `XAxis`, `Bar`…) from here, so they share one Recharts with
 * `ChartContainer` and `ChartTooltip`: the chart size context and the tooltip
 * store are per copy, and parts from two copies don't see each other.
 * Importing `recharts` directly works only when your package manager
 * resolves it to this same copy (the same version, deduplicated).
 *
 * No 'use client' here: a client boundary can't `export *`, and Recharts
 * has none either; import it from client components, as you would Recharts.
 */
export * from 'recharts'
