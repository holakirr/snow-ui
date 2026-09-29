'use client'

import { type RefObject, useLayoutEffect, useState } from 'react'

/** How long a chart waits for its font before it draws with what it has. */
const FONT_TIMEOUT = 3000

export type FontsState = {
  /** The plot can be drawn: the font of its first text has loaded (or timed out). */
  ready: boolean
  /** The font of the current text has loaded too (the chart is final). */
  settled: boolean
  /**
   * Changes when a font for new text arrived after the plot was drawn: key the
   * plot with it so Recharts measures again.
   */
  key: number
}

/**
 * Whether the web font of the chart's text has loaded.
 *
 * Recharts measures text when it first draws (the value axis' `width="auto"`
 * fits its widest tick label; overlapping labels are skipped) and doesn't
 * measure again when a web font arrives. A chart drawn with the fallback font
 * keeps the fallback widths, so the plot sits a few pixels off, and where it
 * sits depends on which won the race. So the plot is drawn once the element's
 * font has loaded for the text it shows (`document.fonts.load` with a sample
 * of it), or after 3 seconds.
 *
 * When the text changes later (new categories, another locale), the font is
 * checked again for the new sample. If it needs faces that aren't loaded yet,
 * they're loaded and `key` changes, so the plot is measured again; text the
 * loaded faces already cover changes nothing.
 *
 * Not ready on the server and in the first render in the browser, so
 * hydration matches; ready right away where there is no Font Loading API
 * (jsdom).
 */
export const useFontsReady = (
  ref: RefObject<HTMLElement | null>,
  sample: string,
): FontsState => {
  // The sample whose font has loaded (null until the first one has).
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useLayoutEffect(() => {
    if (loadedFor === sample) return
    const element = ref.current
    const fonts = element?.ownerDocument.fonts
    if (!element || typeof fonts?.load !== 'function') {
      setLoadedFor(sample)
      return
    }
    const { fontStyle, fontWeight, fontFamily } = getComputedStyle(element)
    const font = `${fontStyle} ${fontWeight} 12px ${fontFamily}`
    const drawn = loadedFor !== null
    try {
      // Already covered by loaded faces: nothing to wait for or re-measure.
      if (drawn && fonts.check?.(font, sample)) {
        setLoadedFor(sample)
        return
      }
    } catch {
      // An unparsable font shorthand: fall through to load (which settles).
    }
    let active = true
    const done = () => {
      if (!active) return
      setLoadedFor(sample)
      if (drawn) setKey((value) => value + 1)
    }
    const timer = setTimeout(done, FONT_TIMEOUT)
    try {
      fonts
        .load(font, sample)
        .then(() => fonts.ready)
        .then(done, done)
    } catch {
      // An unparsable font shorthand: draw with what there is.
      done()
    }
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [loadedFor, ref, sample])

  return { ready: loadedFor !== null, settled: loadedFor === sample, key }
}
