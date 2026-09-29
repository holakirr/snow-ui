'use client'

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import { ChartTable } from './ChartTable'
import { type ChartColor, resolveChartColor } from './colors'
import type { ChartConfig } from './config'
import {
  type ChartDirection,
  useChartDirection,
  useChartLocale,
} from './context'
import { warnOnce } from './env'
import {
  type ChartValueFormatter,
  formatCategory,
  formatNumber,
  toNumber,
} from './format'

export interface SparklineProps
  extends Omit<
    ComponentPropsWithoutRef<'figure'>,
    'color' | 'title' | 'children' | 'dir'
  > {
  /** The values, oldest first: numbers (`null` for a gap), or rows with a `dataKey` field. */
  data: readonly (number | null)[] | readonly object[]
  /** The field of a row with its value (for rows). @default 'value' */
  dataKey?: string
  /** The field of a row that names it, for the data table (for rows). */
  categoryKey?: string
  /** The accessible name: what the trend is, e.g. "Views, last 7 days". */
  title?: string
  /** A short summary for screen readers ("up 40% this week"). */
  description?: ReactNode
  /** A SnowUI colour token or any CSS colour. @default 'primary' */
  color?: ChartColor
  /** Fills the area under the line with a gradient of its colour. @default false */
  area?: boolean
  /** A dashed line. @default false */
  dashed?: boolean
  /** Line width in px (it doesn't scale with the chart). @default 1.5 */
  strokeWidth?: number
  /** A smooth (monotone, default) or straight line. */
  curve?: 'smooth' | 'linear'
  /** @default 32 */
  height?: number | string
  /** @default '100%' */
  width?: number | string
  /** The values as a visually hidden table, like the other charts. @default true */
  table?: boolean
  /** Header of the table's first column. @default 'Point' */
  categoryLabel?: ReactNode
  /** Header of the table's value column. @default 'Value' */
  valueLabel?: string
  /** Formats the values in the table. Defaults to the locale's number format. */
  valueFormatter?: ChartValueFormatter
  /** BCP 47 language tag for numbers. Defaults to the `SnowUIProvider`'s, else `en-US`. */
  locale?: string
  /**
   * Right-to-left sparklines run from right to left. Defaults to the
   * provider's `dir`, else the element's computed direction (read before
   * paint).
   */
  dir?: ChartDirection
  ref?: Ref<HTMLElement>
}

type Point = [x: number, y: number]

/** Coordinates are rounded to 2 decimals in the 100 × 100 viewBox. */
const round = (value: number) => Math.round(value * 100) / 100
const xy = ([x, y]: Point) => `${round(x)},${round(y)}`
const sign = (value: number) => (value < 0 ? -1 : 1)

/**
 * A path through the points: straight, or a monotone cubic curve (the same
 * curve as the other charts, d3's `curveMonotoneX`), which never overshoots.
 */
export const sparklinePath = (points: readonly Point[], smooth: boolean) => {
  const first = points[0]
  if (!first) return ''
  let path = `M${xy(first)}`
  const n = points.length
  // A lone point: a zero-length segment, drawn as a dot by the round cap.
  if (n === 1) return `${path}h0`
  if (!smooth || n === 2) {
    for (const point of points.slice(1)) path += `L${xy(point)}`
    return path
  }
  const x = (i: number) => (points[i] as Point)[0]
  const y = (i: number) => (points[i] as Point)[1]
  const secants = points
    .slice(1)
    .map((point, i) => (point[1] - y(i)) / (point[0] - x(i)))
  const tangents: number[] = []
  for (let i = 1; i < n - 1; i++) {
    const s0 = secants[i - 1] as number
    const s1 = secants[i] as number
    const h0 = x(i) - x(i - 1)
    const h1 = x(i + 1) - x(i)
    const p = (s0 * h1 + s1 * h0) / (h0 + h1)
    tangents[i] =
      (sign(s0) + sign(s1)) *
        Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
  }
  tangents[0] = (3 * (secants[0] as number) - (tangents[1] as number)) / 2
  tangents[n - 1] =
    (3 * (secants[n - 2] as number) - (tangents[n - 2] as number)) / 2
  for (let i = 0; i < n - 1; i++) {
    const dx = (x(i + 1) - x(i)) / 3
    path += `C${xy([x(i) + dx, y(i) + dx * (tangents[i] as number)])} ${xy([
      x(i + 1) - dx,
      y(i + 1) - dx * (tangents[i + 1] as number),
    ])} ${xy(points[i + 1] as Point)}`
  }
  return path
}

/**
 * The runs of consecutive values as points in a 100 × 100 box: x spreads the
 * values evenly, y maps the smallest value to the bottom and the largest to
 * the top (a flat series sits in the middle). `null` values split the runs.
 */
export const sparklineSegments = (values: readonly (number | null)[]) => {
  const numbers = values.filter((value): value is number => value !== null)
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  const n = values.length
  const segments: Point[][] = []
  let run: Point[] = []
  values.forEach((value, i) => {
    if (value === null) {
      if (run.length) segments.push(run)
      run = []
      return
    }
    run.push([
      n > 1 ? (i * 100) / (n - 1) : 50,
      max > min ? 100 - ((value - min) / (max - min)) * 100 : 50,
    ])
  })
  if (run.length) segments.push(run)
  return segments
}

const px = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

/**
 * A tiny line (or area) chart without axes, gridlines or tooltip, for KPI
 * cards: the trend next to a number. Plain SVG, rendered on the server too,
 * as wide as its container (the line keeps its width when stretched). Like
 * the other charts it is a named `<figure>` with the values in a visually
 * hidden table; in right-to-left text it runs from right to left.
 *
 * @example
 * <Sparkline title="Views, last 7 days" data={[12, 18, 15, 22, 30, 26, 34]} color="indigo" />
 */
export const Sparkline = ({
  data,
  dataKey = 'value',
  categoryKey,
  title,
  description,
  color = 'primary',
  area = false,
  dashed = false,
  strokeWidth = 1.5,
  curve = 'smooth',
  height = 32,
  width = '100%',
  table = true,
  categoryLabel = 'Point',
  valueLabel = 'Value',
  valueFormatter,
  locale: localeProp,
  dir: dirProp,
  className,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SparklineProps) => {
  const id = useId()
  const gradientId = `snow-sparkline-${id.replace(/[^\w-]/g, '')}`
  // As useChartLocale, without the chart context (it keeps this module small).
  const rootRef = useRef<HTMLElement | null>(null)
  const dir = useChartDirection(rootRef, dirProp)
  const locale = useChartLocale(localeProp)

  const values = useMemo(
    () =>
      // Numbers and row values alike: NaN, Infinity and non-numbers are gaps.
      data.map(
        (row) =>
          toNumber(
            typeof row === 'object' && row !== null
              ? (row as Record<string, unknown>)[dataKey]
              : row,
          ) ?? null,
      ),
    [data, dataKey],
  )
  const segments = useMemo(() => sparklineSegments(values), [values])

  useEffect(() => {
    if (!title && !ariaLabel && !ariaLabelledBy) {
      warnOnce(
        'A Sparkline needs an accessible name: pass `title`, `aria-label` or `aria-labelledby`.',
      )
    }
  }, [title, ariaLabel, ariaLabelledBy])

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const stroke = resolveChartColor(color)
  const smooth = curve !== 'linear'
  const descriptionId = `${id}-description`
  const describedBy =
    [description != null ? descriptionId : undefined, ariaDescribedBy]
      .filter(Boolean)
      .join(' ') || undefined
  const config: ChartConfig = { value: { label: valueLabel } }

  return (
    <figure
      ref={setRef}
      className={['snow-chart-sparkline', className].filter(Boolean).join(' ')}
      style={{ height: px(height), width: px(width), ...style }}
      data-slot="sparkline"
      data-dir={dir}
      dir={dirProp}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : title)}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        aria-hidden
        focusable="false"
        // Mirrored in JS, not with CSS `:dir(rtl)`, which CSS minifiers
        // (Lightning CSS) rewrite to `:lang()` lists.
        style={dir === 'rtl' ? { transform: 'scaleX(-1)' } : undefined}
      >
        {area && (
          <>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0"
                  style={{ stopColor: stroke, stopOpacity: 0.2 }}
                />
                <stop
                  offset="1"
                  style={{ stopColor: stroke, stopOpacity: 0 }}
                />
              </linearGradient>
            </defs>
            {segments.map((segment) => (
              <path
                key={`area-${segment[0]?.[0]}`}
                d={`${sparklinePath(segment, smooth)}L${round(
                  (segment[segment.length - 1] as Point)[0],
                )},100L${round((segment[0] as Point)[0])},100Z`}
                fill={`url(#${gradientId})`}
              />
            ))}
          </>
        )}
        {segments.map((segment) => (
          <path
            key={`line-${segment[0]?.[0]}`}
            d={sparklinePath(segment, smooth)}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashed ? '2 4' : undefined}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {description != null && (
        <div id={descriptionId} className="snow-chart-sr-only">
          {description}
        </div>
      )}
      {table && (
        <ChartTable
          data={data.map((row, index) => ({
            point:
              categoryKey && typeof row === 'object' && row !== null
                ? (row as Record<string, unknown>)[categoryKey]
                : index + 1,
            value: values[index],
          }))}
          categoryKey="point"
          categoryLabel={categoryLabel}
          series={['value']}
          config={config}
          formatValue={
            valueFormatter ?? ((value) => formatNumber(value, locale))
          }
          formatCategory={(value) => formatCategory(value, locale)}
        />
      )}
    </figure>
  )
}
