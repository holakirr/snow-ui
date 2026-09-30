/**
 * Helpers for Storybook play functions that check real computed colours
 * (Chromium, with the compiled Tailwind CSS). Not part of the package.
 */

/** The computed `color` of an element with `className`, inside `container`. */
export const colorOf = (className: string, container: HTMLElement): string => {
  const probe = container.ownerDocument.createElement('span')
  probe.className = className
  container.appendChild(probe)
  const { color } = getComputedStyle(probe)
  probe.remove()
  return color
}

/** The computed `color` of `element` once its CSS transitions have ended. */
export const settledColor = async (element: HTMLElement): Promise<string> => {
  await Promise.all(element.getAnimations().map(({ finished }) => finished))
  return getComputedStyle(element).color
}

/**
 * Whether `element` has an inset ring (Tailwind `inset-ring-*`, a stroke) of
 * `width` in the colour of `colorClass` (e.g. `text-control-border-invalid`),
 * once its CSS transitions have ended. The colour is resolved next to the
 * element, in its theme and contrast scopes.
 */
export const hasInsetRing = async (
  element: Element,
  colorClass: string,
  width: string,
): Promise<boolean> => {
  await Promise.all(element.getAnimations().map(({ finished }) => finished))
  const color = colorOf(
    colorClass,
    element.parentElement ?? element.ownerDocument.body,
  )
  return getComputedStyle(element).boxShadow.includes(
    `${color} 0px 0px 0px ${width} inset`,
  )
}

/**
 * Whether `element` gets the "more" contrast level: its nearest
 * `data-contrast` scope, else the OS preference (`prefers-contrast: more`),
 * as the theme's contrast scopes decide.
 */
export const hasMoreContrast = (element: Element): boolean => {
  const scope = element
    .closest('[data-contrast="more"], [data-contrast="standard"]')
    ?.getAttribute('data-contrast')
  if (scope === 'more') return true
  if (scope === 'standard') return false
  return (
    element.ownerDocument.defaultView?.matchMedia('(prefers-contrast: more)')
      .matches ?? false
  )
}
