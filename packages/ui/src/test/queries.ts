import { type ByRoleMatcher, screen, within } from '@testing-library/react'

// Role queries over a whole calendar, table or scheduler are slow in jsdom.
// For each element that may have the role, testing-library computes its
// implicit role (`matches` against ~100 selectors), given a `name` its
// accessible name (the styles of the nodes in it), and for each match that
// nothing hides it (the styles of it and its ancestors), and jsdom drops its
// selector and style caches on every DOM change. So the first such query
// after a click or a render takes ~60–260 ms over a month of day buttons,
// Table A's cells or the Scheduler's ~100 hour cells, and tests that click
// and query a few times went past Vitest's 5 s timeout under coverage on a
// busy CI runner. The helpers below (and some tests' own) query a small part
// of the page instead: the element found gets the same role, name and
// visibility checks, and its uniqueness is checked in the part queried.

// `element`, checked by `getByRole(role, { name })` within its parent.
const byRole = (
  element: HTMLElement,
  role: ByRoleMatcher,
  name: string | RegExp,
) => {
  const found = within(element.parentElement as HTMLElement).getByRole(role, {
    name,
  })
  if (found !== element) {
    throw new Error(`The ${role} named ${name} isn't the element found`)
  }
  return found
}

/**
 * `screen.getByRole(role, { name })` for an element named by a label of its
 * own (`aria-label`, `aria-labelledby`, a `<label>`), such as a calendar's
 * day buttons: the only element with that label (or it throws), checked by
 * the same role query within its parent.
 */
export const getByRoleAndLabel = (role: ByRoleMatcher, name: string | RegExp) =>
  byRole(screen.getByLabelText(name), role, name)

/**
 * `within(container).getByRole(role, { name })` for an element named by its
 * text, such as the 60 buttons of a time picker's minutes: the only element
 * in `container` with that text (or it throws), checked by the same role
 * query within its parent.
 */
export const getByRoleAndText = (
  container: HTMLElement,
  role: ByRoleMatcher,
  name: string,
) => byRole(within(container).getByText(name), role, name)

/**
 * A button of a calendar's month navigation (Previous, the month or the
 * years shown, Next), by role and name within the navigation landmark, which
 * must be the only one on the page. With several months, the landmark holds
 * Previous and the first month's switcher only: Next and the later months'
 * switchers are outside it.
 */
export const getNavButton = (name: string | RegExp) =>
  within(screen.getByRole('navigation')).getByRole('button', { name })
