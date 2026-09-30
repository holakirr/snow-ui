import { expect } from 'storybook/test'

/**
 * Waits for the CSS animations running on `element` and inside it to end,
 * such as an overlay's exit animation: Radix keeps a closed overlay in the
 * DOM until its `animationend`, and only then removes it.
 *
 * Waiting for the removal alone raced `waitFor`'s 1 s timeout against the
 * animation: a busy test runner may not render the animation's frames in
 * time, so the Tooltip "Default" story failed in CI with the closed tooltip
 * still in the DOM (`expected document not to contain element`). The
 * animations' `finished` promises have no such deadline (the test's own
 * timeout still applies), and after them `waitFor` only waits for React to
 * commit the removal. Infinite animations (spinners) are left out, and an
 * animation cancelled on the way (the overlay opened again) counts as ended.
 */
export const animationsEnded = async (element: Element) => {
  await Promise.allSettled(
    element
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          animation.effect?.getComputedTiming().endTime !== Infinity,
      )
      .map((animation) => animation.finished),
  )
}

/**
 * Checks that each of `overlays` (the content of a Radix Tooltip, Popover,
 * Dialog, Select, Menu or Toast) closed at once (`data-state="closed"`), and
 * waits for their exit animations to end (see `animationsEnded`). Follow it
 * with the story's `waitFor` of the removal.
 */
export const expectClosed = async (...overlays: Element[]) => {
  for (const overlay of overlays) {
    await expect(overlay).toHaveAttribute('data-state', 'closed')
  }
  await Promise.all(overlays.map(animationsEnded))
}
