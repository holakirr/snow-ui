'use client'

import { useDirection } from '@radix-ui/react-direction'
import * as SliderPrimitive from '@radix-ui/react-slider'
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { isDevelopment } from '../../utils/env'
import { twMerge } from '../../utils/tw-merge'
import { type Messages, useMessages } from '../SnowUIProvider'
import { sliderValueText } from '../SnowUIProvider/messages'

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Accessible names of the thumbs, in order. Without them, a single thumb
   * is named by `aria-label` (or `label`) and the thumbs of a range by
   * `messages.slider`: "<aria-label>, minimum" / "…, maximum" (or
   * "…, 2 of 3").
   */
  thumbLabels?: string[]
  /**
   * The text inside a single-value slider, at its start (the Figma "Text").
   * It also names the thumb when there is no `aria-label`, like
   * `aria-label` does. A range has no room for it, so there it only names
   * the thumbs ("<label>, minimum" / "…, maximum").
   */
  label?: string
  /**
   * Shows the value: inside a single-value slider, at its end, or at both
   * ends of a range. It is `valueFormatter`'s text, which the thumbs also
   * read out (`aria-valuetext`).
   * @default false
   */
  showValue?: boolean
  /**
   * Formats a value for `showValue` and for the thumbs' `aria-valuetext`.
   * Defaults to `messages.slider.value`: its position between `min` and
   * `max` in percent, "28%".
   */
  valueFormatter?: (value: number) => string
}

/**
 * The accessible name of a thumb (the element with `role="slider"`): Radix
 * leaves `aria-label` on the root, which has no role, so the thumb had no
 * name.
 */
const thumbLabel = (
  messages: Messages['slider'],
  label: string | undefined,
  index: number,
  count: number,
): string | undefined => {
  if (!label || count === 1) return label
  if (count === 2) {
    return index === 0 ? messages.minimum(label) : messages.maximum(label)
  }
  return messages.thumb(label, index + 1, count)
}

/** A value's position between `min` and `max`, in percent (as Radix). */
const percentOf = (value: number, min: number, max: number): number =>
  max > min
    ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
    : 0

/*
 * The Figma "Active" state of the single-value bar (the handle line, the
 * darker value): while the pointer is over it or drags it, and while its
 * thumb has keyboard focus. Not while disabled (`!`: the disabled rule wins
 * over the group states whatever their order in the stylesheet).
 */
const activeLine =
  'opacity-0 transition-opacity motion-reduce:transition-none group-hover/slider:opacity-100 group-active/slider:opacity-100 group-has-focus-visible/slider:opacity-100 group-data-disabled/slider:opacity-0!'

/**
 * One layer of the bar's content: the label, the value and the handle line,
 * in the colours for the empty track (`track`) or for the fill (`fill`).
 * The fill layer is clipped to the fill, so text the fill's end crosses is
 * split between the two colours. Hidden from assistive technology: the
 * thumb has the name and the value.
 */
const BarLayer: FC<{
  tone: 'track' | 'fill'
  label?: string
  value?: string
  percent: number
  fromLeft: boolean
  clip?: string
}> = ({ tone, label, value, percent, fromLeft, clip }) => {
  const fill = tone === 'fill'
  return (
    <span
      aria-hidden
      className={twMerge(
        'pointer-events-none absolute inset-0 flex items-center gap-2 px-2 text-12',
        // Forced colours (Windows High Contrast) drop the fill's background:
        // the fill is Highlight there, its layer HighlightText.
        fill && 'forced-colors:forced-color-adjust-none',
      )}
      style={clip ? { clipPath: clip } : undefined}
    >
      {label ? (
        // Figma: Static White on the fill; the per-mode `white` keeps it
        // readable on the dark-mode fill, which is white.
        <span
          className={twMerge(
            'truncate',
            fill
              ? 'text-white forced-colors:text-[HighlightText]'
              : 'text-black',
          )}
        >
          {label}
        </span>
      ) : null}
      {value ? (
        <span
          className={twMerge(
            'ms-auto shrink-0 tabular-nums',
            fill && 'forced-colors:text-[HighlightText]!',
            // Figma: Black/20% (Black/40% active) and White/40% on the fill,
            // 1.6:1 and 3.66:1; text needs 4.5:1 (WCAG 1.4.3).
            fill
              ? 'text-white/60 group-hover/slider:text-white-80 group-active/slider:text-white-80 group-has-focus-visible/slider:text-white-80 group-data-disabled/slider:text-white/60!'
              : 'text-secondary group-hover/slider:text-black-80 group-active/slider:text-black-80 group-has-focus-visible/slider:text-black-80 group-data-disabled/slider:text-secondary!',
          )}
        >
          {value}
        </span>
      ) : null}
      {/* The Figma handle: a 2×8px line 4px inside the fill's end, or 4px
          from the start while there is no fill. */}
      <span
        className={twMerge(
          'absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full',
          fill
            ? 'bg-white forced-colors:bg-[HighlightText]'
            : 'bg-black forced-colors:forced-color-adjust-none forced-colors:bg-[CanvasText]',
          activeLine,
        )}
        style={{
          [fromLeft ? 'left' : 'right']: `max(3px, calc(${percent}% - 5px))`,
        }}
      />
    </span>
  )
}

/**
 * The single-value bar (Figma "Slider2"): the Black/4% track, the black
 * fill (Radix's Range, rounded at both ends) and the two content layers.
 * The last layer draws the invalid stroke and, with more contrast, the
 * bar's `control-border` boundary, over the fill; with forced colours, a
 * border (the bar's Black/4% background is dropped there).
 */
const BarTrack: FC<{
  label?: string
  value?: string
  percent: number
  fromLeft: boolean
}> = ({ label, value, percent, fromLeft }) => {
  const layer = { label, value, percent, fromLeft }
  return (
    <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-8 bg-black-4">
      <BarLayer tone="track" {...layer} />
      <SliderPrimitive.Range className="absolute inset-y-0 rounded-8 bg-black forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none" />
      <BarLayer
        tone="fill"
        {...layer}
        clip={
          fromLeft
            ? `inset(0 ${100 - percent}% 0 0 round var(--radius-8))`
            : `inset(0 0 0 ${100 - percent}% round var(--radius-8))`
        }
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-8 inset-ring-control-border contrast-more:inset-ring group-data-invalid/slider:inset-ring group-data-invalid/slider:inset-ring-control-border-invalid forced-colors:border"
      />
    </SliderPrimitive.Track>
  )
}

/**
 * The values of a range shown at its ends, each as wide as the widest of
 * `min` and `max`, so the track doesn't move while the values change.
 */
const RangeValue: FC<{
  children: ReactNode
  sizes: string[]
  align: 'start' | 'end'
}> = ({ children, sizes, align }) => (
  <span
    aria-hidden
    className={twMerge(
      'grid shrink-0 text-14 text-black tabular-nums *:col-start-1 *:row-start-1',
      align === 'end' ? 'justify-items-end' : 'justify-items-start',
    )}
  >
    <span>{children}</span>
    {sizes.map((size, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: the min and max texts
      <span key={index} className="invisible">
        {size}
      </span>
    ))}
  </span>
)

/**
 * Radix Slider in the Figma kit's two looks. One value: the "Slider2" bar,
 * a 32px Black/4% bar that fills with black up to the value, with an
 * optional `label` inside at its start and the value (`showValue`) at its
 * end; its Active state (hover, drag, keyboard focus) shows a 2×8px handle
 * line at the fill's end and darkens the value. Two or more values: the
 * "SliderBar" range, a thin track with a black range between 24px round
 * thumbs, and the values at its ends with `showValue`.
 *
 * Keyboard and pointer input follow the `dir` of `SnowUIProvider`: in
 * right-to-left text the minimum is on the right. `aria-label`,
 * `aria-labelledby`, `aria-describedby` and `aria-invalid` go to the thumbs
 * (the elements with `role="slider"`), so a `FormControl` around it
 * describes them; an invalid slider gets a red stroke (the bar) or red
 * thumb borders (a range).
 */
const Slider: FC<SliderProps> = ({
  className,
  thumbLabels,
  label,
  showValue = false,
  valueFormatter,
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  inverted = false,
  dir,
  disabled,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}) => {
  const messages = useMessages()
  const direction = useDirection(dir)
  // The values, for the parts Radix doesn't draw (the texts, the handle
  // line, the fill's clip). Radix gets them as a controlled value, so both
  // change in the same render; `defaultValue` makes them the slider's own.
  const [ownValues, setOwnValues] = useState(() => defaultValue ?? [min])
  const values = valueProp ?? ownValues
  const handleValueChange = (next: number[]) => {
    if (valueProp === undefined) setOwnValues(next)
    onValueChange?.(next)
  }
  // Radix always gets a controlled value now, so the warning it gave for a
  // slider that switches between controlled and uncontrolled is ours.
  const controlled = valueProp !== undefined
  const wasControlled = useRef(controlled)
  useEffect(() => {
    if (wasControlled.current !== controlled && isDevelopment()) {
      const [from, to] = controlled
        ? ['uncontrolled', 'controlled']
        : ['controlled', 'uncontrolled']
      console.warn(
        `Slider is changing from ${from} to ${to}. Pass \`value\` for the slider's whole life, or \`defaultValue\` only.`,
      )
    }
    wasControlled.current = controlled
  }, [controlled])

  const invalid = ariaInvalid === true || ariaInvalid === 'true'
  const range = values.length > 1
  // As Radix: the minimum is on the left in left-to-right text, unless
  // `inverted` (and the other way round in right-to-left text).
  const fromLeft = (direction === 'ltr') !== inverted
  const format =
    valueFormatter ??
    ((value: number) =>
      (messages.slider.value ?? sliderValueText)(value, min, max))
  // The thumbs read out the text the slider shows.
  const valueText = (value: number) =>
    showValue || valueFormatter ? format(value) : undefined
  const name = ariaLabel ?? label

  const thumbs = values.map((value, index) => (
    <SliderPrimitive.Thumb
      // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are positional
      key={index}
      aria-label={
        thumbLabels?.[index] ??
        thumbLabel(messages.slider, name, index, values.length)
      }
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      // Radix sets it only on the role-less root.
      aria-disabled={disabled || undefined}
      aria-valuetext={valueText(value)}
      className={
        range
          ? // Figma "SliderBar": a 24px static white thumb with "Drop shadow
            // 2", like the Switch thumb. With more contrast it gets a
            // `control-border-strong` border (it is 1:1 on white).
            'relative block size-6 cursor-grab rounded-full bg-static-white shadow-2 transition-colors focus-ring hit-area active:cursor-grabbing contrast-more:not-aria-invalid:border contrast-more:not-aria-invalid:border-control-border-strong aria-invalid:border aria-invalid:border-control-border-invalid data-disabled:cursor-not-allowed forced-colors:border'
          : // The bar's thumb is invisible: a 1px-wide, full-height target at
            // the value, with a 24px hit area (`hit-area`, WCAG 2.5.8). The
            // bar shows the handle line and the focus ring for it.
            'relative block h-8 w-px cursor-grab outline-none hit-area active:cursor-grabbing data-disabled:cursor-not-allowed'
      }
    />
  ))

  // A range with its values has them beside the track, outside the Radix
  // root: Radix maps the pointer and places the thumbs over the whole root.
  const wrapped = range && showValue

  const root = (
    <SliderPrimitive.Root
      className={twMerge(
        'group/slider relative flex w-full touch-none select-none items-center',
        range
          ? twMerge(
              'h-6 cursor-pointer data-disabled:cursor-not-allowed',
              wrapped ? 'min-w-0 grow' : 'data-disabled:opacity-40',
            )
          : // Figma "Slider2": 32px high, an 8px radius. The focus-ring look
            // goes on the bar while its thumb has keyboard focus.
            'h-8 cursor-pointer rounded-8 has-focus-visible:ring-4 has-focus-visible:ring-focus has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black-80 data-disabled:cursor-not-allowed data-disabled:opacity-40',
        !wrapped && className,
      )}
      data-invalid={invalid || undefined}
      value={values}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      inverted={inverted}
      dir={dir}
      disabled={disabled}
      {...props}
    >
      {range ? (
        // Figma "SliderBar": a 3px Black/4% track and a black range between
        // the thumbs. With more contrast the track is `control-border`; with
        // forced colours GrayText and Highlight, and the thumbs get a border.
        <SliderPrimitive.Track className="relative h-[3px] grow overflow-hidden rounded-full bg-black-4 contrast-more:bg-control-border forced-colors:bg-[GrayText] forced-colors:forced-color-adjust-none">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-black forced-colors:bg-[Highlight]" />
        </SliderPrimitive.Track>
      ) : (
        <BarTrack
          label={label}
          value={showValue ? format(values[0] ?? min) : undefined}
          percent={percentOf(values[0] ?? min, min, max)}
          fromLeft={fromLeft}
        />
      )}
      {thumbs}
    </SliderPrimitive.Root>
  )

  if (!wrapped) return root
  const sizes = [format(min), format(max)]
  // The value by each end of the track: the first value by the minimum,
  // which is on the right in right-to-left text or with `inverted`.
  const first = format(values[0] ?? min)
  const last = format(values[values.length - 1] ?? max)
  return (
    <div
      className={twMerge(
        'flex w-full items-center gap-3 data-disabled:opacity-40',
        className,
      )}
      data-disabled={disabled ? '' : undefined}
      // Radix sets `dir` on its root; the texts beside it follow it too.
      dir={direction}
    >
      <RangeValue sizes={sizes} align="end">
        {inverted ? last : first}
      </RangeValue>
      {root}
      <RangeValue sizes={sizes} align="start">
        {inverted ? first : last}
      </RangeValue>
    </div>
  )
}
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
