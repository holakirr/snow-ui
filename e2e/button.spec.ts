import { expect, test } from '@playwright/test'
import { BUTTON_VARIANTS, SIZES } from '../src/constants'
import { THEMES } from './constants'
import { getStoryUrl } from './utils'

const type = 'components'
const component = 'button'
const stories = [
  ...Object.values(BUTTON_VARIANTS),
  ...Object.values(SIZES),
  'as-link',
  'with-left-content',
  'with-right-content',
  'with-left-and-right-content',
]
const diff = 1

test.describe('Button Component', () => {
  for (const theme of THEMES) {
    for (const variant of stories) {
      test(`should render ${variant} button in ${theme} correctly`, async ({
        page,
      }) => {
        await page.goto(
          getStoryUrl({
            theme,
            type,
            component,
            variant,
          }),
        )

        const button = page.getByRole('button', { name: component })

        await expect(button).toBeVisible()
        await expect(button).toHaveScreenshot(`${theme}-${variant}.png`, {
          maxDiffPixels: diff,
        })
      })
    }

    test(`should render with children in ${theme} correctly`, async ({
      page,
    }) => {
      const variant = 'with-children'

      await page.goto(
        getStoryUrl({
          theme,
          type,
          component,
          variant,
        }),
      )

      const button = page.getByTitle('Button')

      await expect(button).toBeVisible()
      await expect(button).toContainText(variant)
      await expect(button).toHaveScreenshot(`${theme}-${variant}.png`, {
        maxDiffPixels: diff,
      })
    })

    test(`should render all variants in ${theme} correctly`, async ({
      page,
    }) => {
      const variant = 'all-variants'

      await page.goto(
        getStoryUrl({
          theme,
          type,
          component,
          variant,
        }),
      )

      const buttons = page.getByTitle('Buttons all variants')

      await expect(buttons).toBeVisible()
      await expect(buttons).not.toBeEmpty()
      await expect(buttons).toHaveScreenshot(`${theme}-${variant}.png`, {
        maxDiffPixels: diff,
      })
    })

    test(`should render all sizes in ${theme} correctly`, async ({ page }) => {
      const variant = 'all-sizes'

      await page.goto(
        getStoryUrl({
          theme,
          type,
          component,
          variant,
        }),
      )

      const buttons = page.getByTitle('Buttons all sizes')

      await expect(buttons).toBeVisible()
      await expect(buttons).not.toBeEmpty()
      await expect(buttons).toHaveScreenshot(`${theme}-${variant}.png`, {
        maxDiffPixels: diff,
      })
    })

    test(`should render icon button in ${theme} correctly`, async ({
      page,
    }) => {
      const variant = 'icon-button'

      await page.goto(
        getStoryUrl({
          theme,
          type,
          component,
          variant,
        }),
      )

      const button = page.getByTitle('Icon button')

      await expect(button).toBeVisible()
      await expect(button).toHaveScreenshot(`${theme}-${variant}.png`, {
        maxDiffPixels: diff,
      })
    })
  }
})
