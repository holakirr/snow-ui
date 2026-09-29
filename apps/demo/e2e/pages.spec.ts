import { chartsReady, checkA11y, expect, test, useTheme } from './fixtures'

const pages = [
  { path: '/dashboard', heading: 'Overview' },
  { path: '/settings', heading: 'Settings' },
  { path: '/sign-in', heading: 'Sign in' },
] as const

test('/ redirects to the dashboard', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Overview')
})

for (const { path, heading } of pages) {
  test.describe(path, () => {
    for (const theme of ['light', 'dark'] as const) {
      test(`renders without errors or axe violations (${theme})`, async ({
        page,
      }) => {
        await useTheme(page, theme)
        await page.goto(path)
        await expect(
          page.getByRole('heading', { level: 1, name: heading }),
        ).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        if (path === '/dashboard') await chartsReady(page)
        await checkA11y(page)
      })
    }
  })
}

test('the dashboard shows every block of the kit', async ({ page }) => {
  await page.goto('/dashboard')
  for (const name of ['Views', 'Visits', 'New Users', 'Active Users']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible()
  }
  for (const name of [
    'Total Users',
    'Traffic by Device',
    'Traffic by Location',
    'Marketing & SEO',
  ]) {
    await expect(page.getByRole('figure', { name })).toBeVisible()
  }
  await expect(page.getByRole('progressbar', { name: /Google/ })).toBeVisible()
  const panel = page.getByRole('complementary', {
    name: 'Notifications and activity',
  })
  for (const name of ['Notifications', 'Activities', 'Contacts']) {
    await expect(panel.getByRole('heading', { name })).toBeVisible()
  }
  // The bell hides and shows the panel.
  const bell = page.getByRole('button', { name: 'Show notifications panel' })
  await expect(bell).toHaveAttribute('aria-expanded', 'true')
  await bell.click()
  await expect(panel).toBeHidden()
  await bell.click()
  await expect(panel).toBeVisible()
})

test('the sidebar collapses and stays collapsed after a reload', async ({
  page,
}) => {
  await page.goto('/dashboard')
  const nav = page.getByRole('navigation', { name: 'Dashboards' })
  await expect(nav).toBeInViewport()
  await page.getByRole('button', { name: 'Toggle Sidebar' }).click()
  await expect(nav).not.toBeInViewport()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(nav).not.toBeInViewport()
  await page.getByRole('button', { name: 'Toggle Sidebar' }).click()
  await expect(nav).toBeInViewport()
})
