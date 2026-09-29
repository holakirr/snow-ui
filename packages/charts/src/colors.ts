/**
 * The SnowUI colour tokens a series can use by name. They are the CSS
 * variables of `@holakirr/snow-ui`'s stylesheet (`var(--color-<name>)`), so
 * they follow the theme: `primary` is black in light mode and indigo in dark
 * mode, `black-*` flip to white, the secondary colours stay the same.
 */
export const chartColorTokens = [
  'primary',
  'black',
  'black-80',
  'black-40',
  'black-20',
  'black-10',
  'purple',
  'indigo',
  'blue',
  'cyan',
  'mint',
  'green',
  'yellow',
  'orange',
  'red',
] as const

/** A SnowUI colour token (see `chartColorTokens`). */
export type ChartColorToken = (typeof chartColorTokens)[number]

/**
 * A series colour: a SnowUI token name (`'indigo'`, `'primary'`) or any CSS
 * colour (`'#7dbbff'`, `'var(--brand)'`, `'rgb(0 0 0 / 0.4)'`).
 */
export type ChartColor = ChartColorToken | (string & {})

/**
 * The order series take colours in when their config sets none: Primary
 * first, then the secondary palette as the SnowUI dashboards use it (Traffic
 * by Location: Primary, Blue, Green, Cyan).
 */
export const chartPalette: readonly ChartColorToken[] = [
  'primary',
  'blue',
  'green',
  'cyan',
  'purple',
  'mint',
  'indigo',
  'orange',
  'yellow',
  'red',
]

const tokens = new Set<string>(chartColorTokens)

/** A token name as its CSS variable; any other colour as it is. */
export const resolveChartColor = (color: ChartColor): string =>
  tokens.has(color) ? `var(--color-${color})` : color

/** The palette colour of the series at `index` (it wraps around). */
export const paletteColor = (index: number): ChartColorToken =>
  chartPalette[
    ((index % chartPalette.length) + chartPalette.length) % chartPalette.length
  ] as ChartColorToken
