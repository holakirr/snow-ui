'use client'

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import { ResponsiveContainer } from 'recharts'
import { ChartTable } from './ChartTable'
import { type ChartConfig, chartConfigStyle } from './config'
import {
  ChartContextProvider,
  type ChartContextValue,
  type ChartDirection,
  createFormatValue,
  useChartDirection,
  useChartLocale,
} from './context'
import { warnOnce } from './env'
import type { ChartValueFormatter } from './format'

/** Where a chart's legend goes: above, below or beside (after) the plot. */
export type ChartLegendPosition = 'top' | 'bottom' | 'end'

export interface ChartContainerProps
  extends Omit<
    ComponentPropsWithoutRef<'figure'>,
    'title' | 'children' | 'dir'
  > {
  /** The series: labels, colours (SnowUI tokens), icons. */
  config: ChartConfig
  /** A Recharts chart (`<LineChart>`, `<BarChart>`…). It fills the plot area. */
  children?: ReactNode
  /**
   * The chart's accessible name, also the caption of its data table. Required
   * unless you pass `aria-label` or `aria-labelledby` (e.g. the id of the
   * card's visible heading).
   */
  title?: string
  /** A short summary of what the chart shows (the trend, the takeaway) for screen readers. */
  description?: ReactNode
  /** Height of the plot area (px or any CSS length). @default 240 */
  height?: number | string
  /** Width of the plot area. @default '100%' */
  width?: number | string
  /** Shows a loading placeholder instead of the chart (and `aria-busy`). */
  loading?: boolean
  /** Shows `emptyMessage` instead of the chart. */
  empty?: boolean
  /** @default 'No data' */
  emptyMessage?: ReactNode
  /** Announced while `loading`. @default 'Loading chart' */
  loadingLabel?: string
  /**
   * How to move between data points with the keyboard, for screen readers
   * (the chart's description). `false` for charts without keyboard
   * navigation.
   * @default 'Use the left and right arrow keys to move between data points.'
   */
  keyboardHint?: string | false
  /** The rows of the data table (usually the chart's `data`). */
  data?: readonly object[]
  /** The field of a row that names it: the category (x) axis key. */
  categoryKey?: string
  /** Header of the table's category column. Defaults to `categoryKey`. */
  categoryLabel?: ReactNode
  /** The table's value columns. Defaults to the config keys found in `data`. */
  tableSeries?: readonly string[]
  /**
   * Renders the data as a visually hidden table, the text alternative of the
   * chart. On by default when `data` and `categoryKey` are set.
   */
  table?: boolean
  /** Formats values in the tooltip, the legend and the table. Defaults to the locale's number format. */
  valueFormatter?: ChartValueFormatter
  /** Formats categories (x values) in the tooltip and the table. */
  categoryFormatter?: (value: unknown) => string
  /**
   * BCP 47 language tag for numbers. Defaults to the `SnowUIProvider`
   * locale's language, else `en-US`.
   */
  locale?: string
  /**
   * Text direction. Defaults to the `SnowUIProvider`'s, else the element's
   * computed direction. Right-to-left charts mirror their axes.
   */
  dir?: ChartDirection
  /** A legend (usually `<ChartLegendContent />`), outside the plot area. */
  legend?: ReactNode
  /** @default 'top' */
  legendPosition?: ChartLegendPosition
  /** Content drawn over the plot, e.g. a donut's centre label. */
  overlay?: ReactNode
  ref?: Ref<HTMLElement>
}

const px = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

/** Placeholder bar heights of the loading state (a bar-chart silhouette). */
const SKELETON = [45, 70, 55, 90, 35, 75]

/**
 * The frame of every chart: it sets the series colours as CSS custom
 * properties (`--chart-<key>`), sizes the plot (responsive width), provides
 * the locale, direction and formatters to the tooltip and legend, and makes
 * the chart accessible: a `<figure>` named by `title`, the keyboard hint, a
 * live region for keyboard navigation and a visually hidden data table.
 *
 * @example
 * <ChartContainer config={config} title="Visitors" data={data} categoryKey="month">
 *   <BarChart data={data}>
 *     <XAxis dataKey="month" />
 *     <Bar dataKey="desktop" fill={seriesColor('desktop')} />
 *     <ChartTooltip content={<ChartTooltipContent />} />
 *   </BarChart>
 * </ChartContainer>
 */
export const ChartContainer = ({
  config,
  children,
  title,
  description,
  height = 240,
  width = '100%',
  loading = false,
  empty = false,
  emptyMessage = 'No data',
  loadingLabel = 'Loading chart',
  keyboardHint = 'Use the left and right arrow keys to move between data points.',
  data,
  categoryKey,
  categoryLabel,
  tableSeries,
  table = true,
  valueFormatter,
  categoryFormatter = String,
  locale: localeProp,
  dir: dirProp,
  legend,
  legendPosition = 'top',
  overlay,
  className,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ChartContainerProps) => {
  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const hintId = `${id}-hint`
  const rootRef = useRef<HTMLElement | null>(null)
  const locale = useChartLocale(localeProp)
  const dir = useChartDirection(rootRef, dirProp)
  // The live region's text is set on the element itself: announcing the
  // point the keyboard moved to must not re-render the chart.
  const liveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!title && !ariaLabel && !ariaLabelledBy) {
      warnOnce(
        'A chart needs an accessible name: pass `title`, `aria-label` or `aria-labelledby`.',
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

  const announce = useCallback((text: string) => {
    const root = rootRef.current
    const live = liveRef.current
    if (live && root?.contains(root.ownerDocument.activeElement)) {
      live.textContent = text
    }
  }, [])

  const context = useMemo<ChartContextValue>(
    () => ({
      config,
      locale,
      dir,
      formatValue: createFormatValue(locale, valueFormatter),
      formatCategory: categoryFormatter,
      announce,
    }),
    [config, locale, dir, valueFormatter, categoryFormatter, announce],
  )

  const nameProps = ariaLabelledBy
    ? { 'aria-labelledby': ariaLabelledBy }
    : ariaLabel
      ? { 'aria-label': ariaLabel }
      : title
        ? { 'aria-labelledby': titleId }
        : {}
  const describedBy =
    [description != null ? descriptionId : undefined, ariaDescribedBy]
      .filter(Boolean)
      .join(' ') || undefined

  const series =
    tableSeries ??
    Object.keys(config).filter((key) =>
      data?.some((row) => key in (row as Record<string, unknown>)),
    )
  const showTable =
    table && !loading && !empty && data != null && categoryKey != null

  // The chart's own <svg> (Recharts' accessibility layer makes it a
  // focusable `application`) gets the name and the keyboard hint.
  const interactive = keyboardHint !== false
  const chart =
    isValidElement(children) &&
    !(children.props as Record<string, unknown>)['aria-hidden']
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          ...nameProps,
          'aria-describedby':
            [describedBy, interactive ? hintId : undefined]
              .filter(Boolean)
              .join(' ') || undefined,
        })
      : children

  const plotStyle: CSSProperties = { height: px(height), width: px(width) }

  const legendNode = legend != null && !loading && !empty ? legend : undefined

  return (
    <ChartContextProvider value={context}>
      <figure
        ref={setRef}
        className={['snow-chart', className].filter(Boolean).join(' ')}
        style={{ ...chartConfigStyle(config), ...style }}
        data-slot="chart"
        data-dir={dir}
        data-legend={legendNode ? legendPosition : undefined}
        aria-busy={loading || undefined}
        aria-describedby={describedBy}
        {...nameProps}
        {...props}
      >
        {title && !ariaLabelledBy && !ariaLabel && (
          <figcaption id={titleId} className="snow-chart-sr-only">
            {title}
          </figcaption>
        )}
        {description != null && (
          <div id={descriptionId} className="snow-chart-sr-only">
            {description}
          </div>
        )}
        {interactive && !loading && !empty && (
          <p id={hintId} className="snow-chart-sr-only">
            {keyboardHint}
          </p>
        )}
        {legendPosition === 'top' && legendNode}
        <div
          className="snow-chart__plot"
          style={plotStyle}
          data-slot="chart-plot"
        >
          {loading ? (
            <div className="snow-chart__skeleton" aria-hidden>
              {SKELETON.map((value, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder bars
                  key={index}
                  className="snow-chart__skeleton-bar"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          ) : empty ? (
            <p className="snow-chart__state">{emptyMessage}</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                {chart}
              </ResponsiveContainer>
              {overlay}
            </>
          )}
        </div>
        {legendPosition !== 'top' && legendNode}
        {showTable && (
          <ChartTable
            caption={ariaLabelledBy ? undefined : (title ?? ariaLabel)}
            labelledBy={ariaLabelledBy}
            data={data}
            categoryKey={categoryKey}
            categoryLabel={categoryLabel}
            series={series}
            config={config}
            formatValue={context.formatValue}
            formatCategory={categoryFormatter}
          />
        )}
        {loading ? (
          <div
            key="loading"
            className="snow-chart-sr-only"
            role="status"
            aria-live="polite"
          >
            {loadingLabel}
          </div>
        ) : (
          <div
            key="live"
            ref={liveRef}
            className="snow-chart-sr-only"
            role="status"
            aria-live="polite"
          />
        )}
      </figure>
    </ChartContextProvider>
  )
}
