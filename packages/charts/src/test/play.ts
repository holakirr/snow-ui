import { expect, waitFor, within } from 'storybook/test'

/**
 * Charts draw once their font has loaded (see fonts.ts): give them time.
 *
 * Recharts then animates the marks in with JavaScript (requestAnimationFrame),
 * not CSS, so `animationsEnded` doesn't see those animations; the play
 * functions don't need them to end. The bars are drawn from the animation's
 * first frames, the pie sectors once its 400 ms `animationBegin` has passed.
 * CDP `Animation.setPlaybackRate` doesn't slow these animations down, it
 * stalls them: it slows the frames' timestamps but not `performance.now()`,
 * which Recharts times them from, so they never start. To slow a chart story
 * down, throttle the CPU (`Emulation.setCPUThrottlingRate`) instead.
 */
export const DRAWN = { timeout: 5000 }

/** The chart's focusable surface (Recharts' accessibility layer). */
export const chartSurface = async (canvasElement: HTMLElement) => {
  const surface = await waitFor(() => {
    const element = canvasElement.querySelector<SVGSVGElement>(
      'svg.recharts-surface[role="application"]',
    )
    expect(element).not.toBeNull()
    return element as SVGSVGElement
  }, DRAWN)
  return surface
}

/** The visible tooltip's text, once it is shown. */
export const visibleTooltip = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const wrapper = canvasElement.querySelector<HTMLElement>(
      '.recharts-tooltip-wrapper',
    )
    expect(wrapper).not.toBeNull()
    expect(getComputedStyle(wrapper as HTMLElement).visibility).toBe('visible')
    const tooltip = within(wrapper as HTMLElement).getByText(
      (_, element) => element?.getAttribute('data-slot') === 'chart-tooltip',
    )
    return tooltip
  }, DRAWN)

/**
 * Moves the pointer over an element of the chart (a bar, a point): Recharts
 * reads the pointer position from mousemove events on its wrapper.
 */
export const hoverChartAt = (canvasElement: HTMLElement, target: Element) => {
  const wrapper = canvasElement.querySelector('.recharts-wrapper')
  if (!wrapper) throw new Error('No chart')
  const rect = target.getBoundingClientRect()
  // Recharts ignores the pointer outside the plot area: an axis label only
  // gives the x position.
  const surface = wrapper.getBoundingClientRect()
  const insideY =
    rect.top > surface.top && rect.bottom < surface.bottom - 40
      ? rect.top + rect.height / 2
      : surface.top + surface.height / 2
  const init = {
    bubbles: true,
    clientX: rect.left + rect.width / 2,
    clientY: insideY,
  }
  // On the element itself: pie sectors listen for it (item tooltips); the
  // events bubble to the wrapper, which tracks the pointer (axis tooltips).
  // React derives onMouseEnter from mouseover.
  target.dispatchEvent(new MouseEvent('mouseover', init))
  target.dispatchEvent(new MouseEvent('mousemove', init))
}

/** Moves the pointer out of the chart. */
export const leaveChart = (canvasElement: HTMLElement) => {
  const wrapper = canvasElement.querySelector('.recharts-wrapper')
  // React derives onMouseLeave from mouseout to an element outside.
  wrapper?.dispatchEvent(
    new MouseEvent('mouseout', {
      bubbles: true,
      relatedTarget: canvasElement.ownerDocument.body,
    }),
  )
}

/**
 * Ends a story's interaction: blurs the chart and moves the pointer out, and
 * waits until every tooltip is hidden.
 */
export const endInteraction = async (canvasElement: HTMLElement) => {
  const active = canvasElement.ownerDocument.activeElement
  if (active && canvasElement.contains(active)) (active as HTMLElement).blur()
  leaveChart(canvasElement)
  await waitFor(() => {
    for (const wrapper of canvasElement.querySelectorAll<HTMLElement>(
      '.recharts-tooltip-wrapper',
    )) {
      expect(getComputedStyle(wrapper).visibility).toBe('hidden')
    }
  }, DRAWN)
}
