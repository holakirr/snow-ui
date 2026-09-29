import AxeBuilder from '@axe-core/playwright'
import { test as base, expect, type Page } from '@playwright/test'

/**
 * `test` with a console guard: every test fails if the page logs a console
 * error or throws (hydration mismatches, React warnings, failed requests…).
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      page.on('pageerror', (error) => errors.push(error.message))
      await use(errors)
      expect(errors, 'console errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

/** WCAG 2.2 A/AA rules, the level the library targets. */
export const checkA11y = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const summary = results.violations.map(
    ({ id, impact, nodes }) =>
      `${id} (${impact}): ${nodes.map((node) => node.target.join(' ')).join(', ')}`,
  )
  expect(summary, 'axe violations').toEqual([])
}

/** Waits for the CSS animations under `root` (overlays fading in) to end. */
export const animationsDone = async (page: Page, selector = 'body') => {
  await page
    .locator(selector)
    .evaluate((element) =>
      Promise.all(
        element
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished.catch(() => undefined)),
      ),
    )
}

/** Pins the theme before the page loads (what the theme menu stores). */
export const useTheme = async (page: Page, theme: 'light' | 'dark') => {
  await page.addInitScript((value) => {
    window.localStorage.setItem('snow-demo-theme', value)
  }, theme)
}

/** Waits until every chart on the page has drawn (fonts loaded). */
export const chartsReady = async (page: Page) => {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.querySelectorAll('figure[data-chart-ready]').length ===
          document.querySelectorAll('figure[data-slot="chart"]').length,
      ),
    )
    .toBe(true)
}
