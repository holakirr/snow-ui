'use client'

import type { ReactNode } from 'react'
import { type ChartConfig, seriesLabel } from './config'
import { toNumber } from './format'

export interface ChartTableProps {
  /** The table's caption: the chart's title. */
  caption?: ReactNode
  /** Names the table by other elements (the chart's visible heading) when there is no caption. */
  labelledBy?: string
  data: readonly object[]
  /** The field of a row that names it (the category axis). */
  categoryKey: string
  /** The header of the category column. */
  categoryLabel?: ReactNode
  /** The value columns, as data keys (labels come from the config). */
  series: readonly string[]
  config: ChartConfig
  formatValue: (value: number, key: string) => string
  formatCategory?: (value: unknown) => string
  /** Text for a missing value. */
  missing?: string
}

/**
 * The chart's data as a table, visually hidden: the text alternative of the
 * graphic for screen readers (WCAG 1.1.1, 1.3.1). Every value the chart
 * draws is a cell, with the category as the row header and the series as the
 * column headers.
 */
export const ChartTable = ({
  caption,
  labelledBy,
  data,
  categoryKey,
  categoryLabel,
  series,
  config,
  formatValue,
  formatCategory = String,
  missing = '–',
}: ChartTableProps) => (
  <table
    className="snow-chart-sr-only"
    data-slot="chart-table"
    aria-labelledby={caption == null ? labelledBy : undefined}
  >
    {caption != null && <caption>{caption}</caption>}
    <thead>
      <tr>
        <th scope="col">{categoryLabel ?? categoryKey}</th>
        {series.map((key) => (
          <th key={key} scope="col">
            {seriesLabel(config, key)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => {
        const record = row as Record<string, unknown>
        const category = formatCategory(record[categoryKey])
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: categories may repeat, and rows follow the data order
          <tr key={`${index}-${category}`}>
            <th scope="row">{category}</th>
            {series.map((key) => {
              const value = toNumber(record[key])
              return (
                <td key={key}>
                  {value === undefined ? missing : formatValue(value, key)}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
)
