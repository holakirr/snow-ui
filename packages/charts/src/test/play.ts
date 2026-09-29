import { expect, waitFor, within } from 'storybook/test'

/** The chart's focusable surface (Recharts' accessibility layer). */
export const chartSurface = async (canvasElement: HTMLElement) => {
  const surface = await waitFor(() => {
    const element = canvasElement.querySelector<SVGSVGElement>(
      'svg.recharts-surface[role="application"]',
    )
    expect(element).not.toBeNull()
    return element as SVGSVGElement
  })
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
  })

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
