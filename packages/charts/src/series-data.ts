import type { ChartConfig } from './config'
import { toNumber } from './format'

/**
 * Fields the line and area charts add to a copy of each row. They start with
 * `__snow_`, so the tooltip knows to show the series' original value instead.
 */
const PREFIX = '__snow_'
export const stackedKey = (key: string) => `${PREFIX}stack__${key}`
export const rangeKey = (key: string) => `${PREFIX}range__${key}`
export const solidKey = (key: string) => `${PREFIX}solid__${key}`
export const projectionKey = (key: string) => `${PREFIX}projection__${key}`

/** Whether a data key is one of the charts' own derived fields. */
export const isDerivedKey = (key: unknown): boolean =>
  typeof key === 'string' && key.startsWith(PREFIX)

export interface SeriesDataOptions {
  keys: readonly string[]
  config: ChartConfig
  xKey: string
  /** The category from which non-dashed series are drawn dashed. */
  projectionFrom?: string | number
  /** Stack the series: each drawn on top of the previous ones. */
  stacked?: boolean
  /** Areas: also give each stacked series its `[bottom, top]` range to fill. */
  range?: boolean
}

export interface SeriesData {
  rows: Record<string, unknown>[]
  /**
   * The data keys of each series: its line (`solid`, plus `projection` when
   * it turns dashed) and, for areas, the value or range its fill covers.
   */
  dataKeys: Record<string, { solid: string; projection?: string; fill: string }>
}

/**
 * The rows the line and area charts draw, computed from the data once:
 *
 * - `stacked`: each series' value is added to the sum of the series before
 *   it (its top; areas also get the `[bottom, top]` range to fill). The sums
 *   are computed here, not by Recharts' `stackId`, so lines stack too and a
 *   projection's two copies of the junction point don't add up twice.
 * - `projectionFrom`: a non-dashed series is split into a solid copy up to
 *   the category and a dashed copy from it; both carry the (stacked) value
 *   at the category itself, so the lines meet.
 *
 * Missing values stay gaps (`null`) and count as 0 in the stack below.
 */
export const seriesData = (
  data: readonly object[],
  {
    keys,
    config,
    xKey,
    projectionFrom,
    stacked = false,
    range = false,
  }: SeriesDataOptions,
): SeriesData => {
  const junction =
    projectionFrom === undefined
      ? -1
      : data.findIndex(
          (row) => (row as Record<string, unknown>)[xKey] === projectionFrom,
        )
  const splits = (key: string) => junction >= 0 && !config[key]?.dashed

  const dataKeys: SeriesData['dataKeys'] = {}
  for (const key of keys) {
    const source = stacked ? stackedKey(key) : key
    const fill = stacked && range ? rangeKey(key) : key
    dataKeys[key] = splits(key)
      ? { solid: solidKey(key), projection: projectionKey(key), fill }
      : { solid: source, fill }
  }
  if (!stacked && junction < 0) {
    return { rows: data as Record<string, unknown>[], dataKeys }
  }

  const rows = data.map((row, index) => {
    const record: Record<string, unknown> = {
      ...(row as Record<string, unknown>),
    }
    let bottom = 0
    for (const key of keys) {
      let value: unknown = record[key]
      if (stacked) {
        const number = toNumber(value)
        const top = bottom + (number ?? 0)
        value = number === undefined ? null : top
        record[stackedKey(key)] = value
        if (range) {
          record[rangeKey(key)] = number === undefined ? null : [bottom, top]
        }
        bottom = top
      }
      if (splits(key)) {
        record[solidKey(key)] = index <= junction ? value : null
        record[projectionKey(key)] = index >= junction ? value : null
      }
    }
    return record
  })
  return { rows, dataKeys }
}
