import { animationsDone, checkA11y, expect, test } from './fixtures'

test('the theme menu switches and remembers the theme', async ({ page }) => {
  await page.goto('/dashboard')
  const html = page.locator('html')
  await expect(html).not.toHaveAttribute('data-theme')

  await page.getByRole('button', { name: /^Theme: / }).click()
  await page.getByRole('menuitemradio', { name: 'Dark' }).click()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(51, 51, 51)',
  )

  // Applied before the first paint on the next load.
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: 'Theme: Dark' })).toBeVisible()

  await page.getByRole('button', { name: 'Theme: Dark' }).click()
  await page.getByRole('menuitemradio', { name: 'System' }).click()
  await expect(html).not.toHaveAttribute('data-theme')
})

test('the direction toggle renders the app right to left', async ({ page }) => {
  await page.goto('/dashboard')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('dir', 'ltr')

  const toggle = page.getByRole('button', { name: 'Right to left' })
  await toggle.click()
  await expect(html).toHaveAttribute('dir', 'rtl')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  // The sidebar moves to the right edge.
  const nav = page.getByRole('navigation', { name: 'Dashboards' })
  const box = await nav.boundingBox()
  expect(box?.x ?? 0).toBeGreaterThan(1000)

  // The cookie keeps it, rendered by the server.
  await page.reload()
  await expect(html).toHaveAttribute('dir', 'rtl')
  await checkA11y(page)

  await page.getByRole('button', { name: 'Right to left' }).click()
  await expect(html).toHaveAttribute('dir', 'ltr')
})

test('the language menu translates the app and the components', async ({
  page,
}) => {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Language: English' }).click()
  await page.getByRole('menuitemradio', { name: 'Русский' }).click()

  const html = page.locator('html')
  await expect(html).toHaveAttribute('lang', 'ru')
  // Server Components re-render in Russian…
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Обзор')
  // …and the SnowUI messages follow (SidebarTrigger, Pagination).
  await expect(
    page.getByRole('button', { name: 'Показать или скрыть боковую панель' }),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Навигация по страницам' }),
  ).toBeVisible()
  // Numbers use the Russian format.
  await expect(page.getByText('7 265')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Обзор')
  await checkA11y(page)

  await page.getByRole('button', { name: 'Язык: Русский' }).click()
  await page.getByRole('menuitemradio', { name: 'English' }).click()
  await expect(html).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Overview')
})

test('⌘K / Ctrl+K opens the command palette, which navigates', async ({
  page,
}) => {
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('ControlOrMeta+k')
  const dialog = page.getByRole('dialog', { name: 'Search' })
  await expect(dialog).toBeVisible()
  // axe measures contrast: let the overlay finish fading in.
  await animationsDone(page)
  await checkA11y(page)

  await page.keyboard.type('settings')
  await expect(dialog.getByRole('option')).toHaveCount(1)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings')
  await expect(dialog).toBeHidden()

  // The header trigger opens it too; Escape closes it.
  await page.getByRole('button', { name: /^Search/ }).click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
