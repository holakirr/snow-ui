'use client'

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type Ref,
  useEffect,
  useMemo,
} from 'react'
import { Area, ComposedChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import { type ChartColor, resolveChartColor } from './colors'
import { warnOnce } from './env'
import { toNumber } from './format'
import { useSvgId } from './shared'

export interface SparklineProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'color' | 'title' | 'children'
  > {
  /** The values, oldest first: numbers, or rows with a `dataKey` field. */
  data: readonly number[] | readonly object[]
  /** The field of a row with its value (for rows). @default 'value' */
  dataKey?: string
  /**
   * The accessible name: what the trend is, e.g. "Views, last 7 days". A
   * sparkline is an image (`role="img"`); put the numbers next to it.
   */
  title?: string
  /** A SnowUI colour token or any CSS colour. @default 'primary' */
  color?: ChartColor
  /** Fills the area under the line with a gradient of its colour. @default false */
  area?: boolean
  /** A dashed line. @default false */
  dashed?: boolean
  /** Line width in px. @default 1.5 */
  strokeWidth?: number
  /** A smooth (default) or straight line. */
  curve?: 'smooth' | 'linear'
  /** @default 32 */
  height?: number | string
  /** @default '100%' */
  width?: number | string
  ref?: Ref<HTMLDivElement>
}

const px = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

/**
 * A tiny line (or area) chart without axes, gridlines or tooltip, for KPI
 * cards: the trend next to a number. It is an image with an accessible name
 * (`title`); the value it illustrates should be text beside it.
 *
 * @example
 * <Sparkline title="Views, last 7 days" data={[12, 18, 15, 22, 30, 26, 34]} color="indigo" />
 */
export const Sparkline = ({
  data,
  dataKey = 'value',
  title,
  color = 'primary',
  area = false,
  dashed = false,
  strokeWidth = 1.5,
  curve = 'smooth',
  height = 32,
  width = '100%',
  className,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SparklineProps) => {
  const gradientId = useSvgId()
  const rows = useMemo(
    () =>
      data.map((row) =>
        typeof row === 'number'
          ? { value: row }
          : {
              value:
                toNumber((row as Record<string, unknown>)[dataKey]) ?? null,
            },
      ),
    [data, dataKey],
  )

  useEffect(() => {
    if (!title && !ariaLabel && !ariaLabelledBy) {
      warnOnce(
        'A Sparkline needs an accessible name: pass `title`, `aria-label` or `aria-labelledby`.',
      )
    }
  }, [title, ariaLabel, ariaLabelledBy])

  const stroke = resolveChartColor(color)
  const common = {
    dataKey: 'value',
    type: curve === 'linear' ? ('linear' as const) : ('monotone' as const),
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeDasharray: dashed ? '2 4' : undefined,
    dot: false,
    activeDot: false,
    isAnimationActive: false,
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : title)}
      aria-labelledby={ariaLabelledBy}
      className={['snow-chart-sparkline', className].filter(Boolean).join(' ')}
      style={
        { height: px(height), width: px(width), ...style } as CSSProperties
      }
      data-slot="sparkline"
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={rows}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
          accessibilityLayer={false}
          aria-hidden
        >
          <YAxis hide domain={['dataMin', 'dataMax']} />
          {area ? (
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
              <Area {...common} fill={`url(#${gradientId})`} fillOpacity={1} />
            </>
          ) : (
            <Line {...common} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
