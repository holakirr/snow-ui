/*
 * Shared by Progress and ProgressCircle. Internal: not exported from the
 * package.
 */

/** Props both progress indicators take on top of their element's. */
export type ProgressValueProps = {
  /**
   * The progress, from 0 to `max`; values outside are clamped. `null` (or
   * no value) makes the indicator indeterminate: it shows that something is
   * happening without saying how much is done.
   */
  value?: number | null

  /**
   * The value of a finished task.
   * @default 100
   */
  max?: number

  /**
   * The text read out for the value (`aria-valuetext`).
   * @default messages.progress.value: a percentage, "40%"
   */
  getValueLabel?: (value: number, max: number) => string
}

/**
 * `max` if it is a positive number (else 100) and `value` clamped to
 * 0…max: Radix Progress logs an error and shows an out-of-range value as
 * indeterminate. `fraction` is the share done, 0 when indeterminate.
 */
export const normalizeProgress = (
  value: number | null | undefined,
  max: number | undefined,
) => {
  const safeMax =
    max !== undefined && Number.isFinite(max) && max > 0 ? max : 100
  const current =
    value == null || Number.isNaN(value)
      ? null
      : Math.min(safeMax, Math.max(0, value))

  return {
    max: safeMax,
    value: current,
    fraction: current === null ? 0 : current / safeMax,
  }
}
