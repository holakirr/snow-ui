/**
 * Brings `element` to its final layout before a play function measures it:
 * waits for the fonts its text is set in, and finishes the CSS transitions
 * and animations running on it and inside it (an overlay opening, which
 * scales up from its centre). Then `getBoundingClientRect()` measures the
 * layout, not a frame of the transition.
 *
 * Waiting for a transition to play out is not reliable: a busy test runner
 * may not render frames for longer than `waitFor`'s timeout, so the Dialog
 * "RTL" story failed in CI with both edges still at the centre of a dialog
 * scaled to 0 (`expected 600 to be less than 600`). Infinite animations
 * (spinners) keep running.
 */
export const settleLayout = async (element: Element) => {
  await element.ownerDocument.fonts.ready
  for (const animation of element.getAnimations({ subtree: true })) {
    if (animation.effect?.getComputedTiming().endTime !== Infinity) {
      animation.finish()
    }
  }
}
