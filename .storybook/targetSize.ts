/**
 * WCAG 2.5.8 Target Size (Minimum), checked on every story after its `play`
 * function (the `afterEach` in preview.tsx), in the Storybook tests: every
 * visible, enabled interactive element — links, native controls and the ARIA
 * widget roles — needs a pointer hit area of at least 24×24 CSS px.
 *
 * The check hit-tests the page (`elementFromPoint`) on a 24px disk — the
 * circle of WCAG's spacing rule, inscribed in the 24×24 square, so rounded
 * corners don't count against a 24px button — centred on the element or,
 * when something covers its centre, anywhere in its box. An invisible hit
 * area drawn by a pseudo-element (`hit-area`, the Tag close button's) counts,
 * and so do the element's label and a field shell that focuses its input on
 * pointer-down (HIT_AREA_OWNERS); anything else on top doesn't.
 *
 * Not checked: disabled, hidden and `inert` / `aria-hidden` elements (not
 * targets), and inline targets in a sentence (WCAG's "inline" exception: an
 * inline element whose parent has text of its own). The other exceptions
 * (spacing, equivalent, essential) need a judgement: list the element in
 * TARGET_SIZE_EXCEPTIONS (every story) or in a story's
 * `parameters.targetSize.exceptions`, with the reason.
 */

export interface TargetSizeException {
  /** A CSS selector for the elements the exception covers. */
  selector: string
  /** Why the target may be smaller: the WCAG exception that applies. */
  reason: string
}

/** `parameters.targetSize` of a story. */
export interface TargetSizeParameters {
  exceptions?: TargetSizeException[]
}

/** The minimum target size, in CSS px. */
const MIN_SIZE = 24

/**
 * Elements that receive the clicks of a text field: a hit on them counts for
 * it. The Input shell focuses its `<input>` on pointer-down (padding, icons).
 */
const HIT_AREA_OWNERS = ['[data-slot="input"]']

const INTERACTIVE = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  ...[
    'button',
    'link',
    'checkbox',
    'radio',
    'switch',
    'tab',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'slider',
    'spinbutton',
    'combobox',
    'treeitem',
  ].map((role) => `[role="${role}"]`),
  // A grid cell is a target when it takes focus itself; otherwise the
  // controls in it are (Calendar days, Scheduler slots).
  '[role="gridcell"][tabindex]',
].join(', ')

/** Exceptions for every story. */
export const TARGET_SIZE_EXCEPTIONS: TargetSizeException[] = [
  // `Link` renders `<a role="link">`: a text link, as tall as its line of
  // text (16–20px). In a sentence the inline exception applies; on its own,
  // the spacing exception (a 24px circle on it overlaps no other target).
  {
    selector: 'a[role="link"]',
    reason: 'text link: the inline or the spacing exception',
  },
  // TEMPORARY: the Toast close button (16–20px) and the Sidebar group and
  // menu actions (20px, the hit area turned off from `md` up) get their hit
  // areas in the layout / Sidebar / Toast branch, which owns those files.
  // Remove these two entries when it lands.
  {
    selector: '[toast-close]',
    reason: 'TEMPORARY: fixed in the layout/Sidebar/Toast branch',
  },
  {
    selector: '[data-sidebar="menu-action"], [data-sidebar="group-action"]',
    reason: 'TEMPORARY: fixed in the layout/Sidebar/Toast branch',
  },
]

const isDisabled = (element: Element) =>
  element.matches(
    ':disabled, [aria-disabled="true"], [data-disabled]:not([data-disabled="false"])',
  ) || element.closest('fieldset:disabled') !== null

const isHidden = (element: HTMLElement) => {
  const { width, height } = element.getBoundingClientRect()
  return (
    element.closest('[inert], [aria-hidden="true"]') !== null ||
    // Both option names: Chromium's current ones and the older aliases.
    !element.checkVisibility({
      opacityProperty: true,
      visibilityProperty: true,
      checkOpacity: true,
      checkVisibilityCSS: true,
    }) ||
    // Visually hidden (`sr-only`): not a pointer target.
    width * height <= 1 ||
    getComputedStyle(element).pointerEvents === 'none'
  )
}

/** An inline element in a line of text: WCAG's "inline" exception. */
const isInlineInText = (element: HTMLElement) =>
  getComputedStyle(element).display === 'inline' &&
  [...(element.parentElement?.childNodes ?? [])].some(
    (node) =>
      node !== element &&
      node.nodeType === Node.TEXT_NODE &&
      (node.textContent ?? '').trim() !== '',
  )

/**
 * Whether a click at (x, y) reaches `element`: itself, its content, its
 * label or a shell that forwards the click (HIT_AREA_OWNERS).
 */
const hits = (element: HTMLElement, x: number, y: number) => {
  const hit = element.ownerDocument.elementFromPoint(x, y)
  if (hit === null) return false
  if (hit === element || element.contains(hit)) return true
  if (hit.closest('label')?.control === element) return true
  // The shell counts for its text field, not for the buttons in it.
  const owner = hit.closest(HIT_AREA_OWNERS.join(', '))
  return (
    owner !== null &&
    element.matches('input, textarea') &&
    owner.contains(element)
  )
}

/** Points of a 24px disk around (x, y): the centre and 16 on its rim, 0.5px in. */
const disk = (x: number, y: number) => {
  const radius = MIN_SIZE / 2 - 0.5
  return [
    [x, y],
    ...Array.from({ length: 16 }, (_, i) => {
      const angle = (i * Math.PI) / 8
      return [x + radius * Math.cos(angle), y + radius * Math.sin(angle)]
    }),
  ]
}

/** Up to 12 offsets from 0 to `room`, at least 4px apart, both ends included. */
const offsets = (room: number) => {
  const step = Math.max(4, room / 10)
  const steps = Array.from({ length: Math.floor(room / step) + 1 }, (_, i) =>
    Math.min(i * step, room),
  )
  return steps.at(-1) === room ? steps : [...steps, room]
}

const describe = (element: HTMLElement) => {
  const role = element.getAttribute('role')
  const name =
    element.getAttribute('aria-label') ??
    element.getAttribute('title') ??
    element.textContent?.trim().slice(0, 40)
  const { width, height } = element.getBoundingClientRect()
  return `<${element.localName}${role ? ` role="${role}"` : ''}>${
    name ? ` "${name}"` : ''
  } (${Math.round(width * 10) / 10}×${Math.round(height * 10) / 10}px)`
}

/**
 * The interactive elements in `root` with no room for a 24px disk in their
 * hit area, described for an error message.
 */
export const findSmallTargets = (
  root: ParentNode,
  exceptions: TargetSizeException[] = [],
): string[] => {
  const excepted = exceptions.map(({ selector }) => selector).join(', ')
  const view = document.defaultView ?? window
  const failures: string[] = []

  for (const element of root.querySelectorAll<HTMLElement>(INTERACTIVE)) {
    if (
      isDisabled(element) ||
      isHidden(element) ||
      isInlineInText(element) ||
      (excepted && element.matches(excepted))
    ) {
      continue
    }
    element.scrollIntoView({ block: 'center', inline: 'center' })
    const { left, top, width, height } = element.getBoundingClientRect()
    const fits = ([cx, cy]: number[]) =>
      disk(cx, cy)
        // Only points in the viewport can be hit-tested.
        .filter(
          ([x, y]) =>
            x >= 0 && y >= 0 && x < view.innerWidth && y < view.innerHeight,
        )
        .every(([x, y]) => hits(element, x, y))
    // The centre first; then, for a box larger than the disk, a grid of
    // positions in it, edges included (a Scheduler slot under an event still
    // has room to click).
    const centres = [[left + width / 2, top + height / 2]]
    const free = [width - MIN_SIZE, height - MIN_SIZE]
    if (free.every((room) => room >= 0)) {
      for (const dy of offsets(free[1])) {
        for (const dx of offsets(free[0])) {
          centres.push([left + MIN_SIZE / 2 + dx, top + MIN_SIZE / 2 + dy])
        }
      }
    }
    if (!centres.some(fits)) failures.push(describe(element))
  }
  return failures
}
