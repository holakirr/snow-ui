'use client'

import { type RefObject, useLayoutEffect, useState } from 'react'

/** How long a chart waits for its font before it draws with what it has. */
const FONT_TIMEOUT = 3000

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
 * False on the server and in the first render in the browser, so hydration
 * matches; true right away where there is no Font Loading API (jsdom).
 */
export const useFontsReady = (
  ref: RefObject<HTMLElement | null>,
  sample: string,
): boolean => {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (ready) return
    const element = ref.current
    const fonts = element?.ownerDocument.fonts
    if (!element || typeof fonts?.load !== 'function') {
      setReady(true)
      return
    }
    let active = true
    const done = () => {
      if (active) setReady(true)
    }
    const timer = setTimeout(done, FONT_TIMEOUT)
    const { fontStyle, fontWeight, fontFamily } = getComputedStyle(element)
    try {
      fonts
        .load(`${fontStyle} ${fontWeight} 12px ${fontFamily}`, sample)
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
  }, [ready, ref, sample])

  return ready
}
