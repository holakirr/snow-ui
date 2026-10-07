import { chartsReady, checkA11y, expect, test, useTheme } from './fixtures'

const pages = [
  { path: '/dashboard', heading: 'Overview' },
  { path: '/settings', heading: 'Settings' },
  { path: '/preferences', heading: 'Settings' },
  { path: '/orders', heading: 'Order List' },
  { path: '/sign-in', heading: 'Sign In' },
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

test('the dashboard shows every block of the kit', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/dashboard')
  // The source artwork must occupy the plot, rather than an empty responsive wrapper.
  const sourcePlot = page
    .getByRole('figure', { name: 'Total Users', exact: true })
    .getByRole('img', { name: 'Total Users', exact: true })
  await expect(sourcePlot).toBeVisible()
  const plotBounds = await sourcePlot.boundingBox()
  expect(plotBounds?.width).toBe(614)
  expect(plotBounds?.height).toBe(246)
  await chartsReady(page)
  const nativeLines = page
    .getByRole('figure', { name: 'Total Users', exact: true })
    .locator('.recharts-line-curve')
  for (const line of await nativeLines.all())
    await expect(line).toHaveCSS('stroke', 'rgba(0, 0, 0, 0)')
  const deviceBars = page
    .getByRole('figure', { name: 'Traffic by Device' })
    .locator('.recharts-bar-rectangle')
  await expect(deviceBars).toHaveCount(6)
  expect((await deviceBars.nth(0).boundingBox())?.height).toBeCloseTo(84, 1)
  expect((await deviceBars.nth(3).boundingBox())?.height).toBeCloseTo(168, 1)
  const marketingBars = page
    .getByRole('figure', { name: 'Marketing & SEO' })
    .locator('.recharts-bar-rectangle')
  await expect(marketingBars).toHaveCount(12)
  expect((await marketingBars.nth(0).boundingBox())?.height).toBeCloseTo(168, 1)
  expect((await marketingBars.nth(1).boundingBox())?.height).toBeCloseTo(84, 1)
  expect((await marketingBars.nth(0).boundingBox())?.width).toBe(28)
  await testInfo.attach('dashboard-design-review', {
    body: await page.screenshot({
      path: testInfo.outputPath('design-review.png'),
      fullPage: true,
      animations: 'disabled',
    }),
    contentType: 'image/png',
  })
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

// Check actual navigation and data changes, rather than only the control labels.
test('dashboard metric tabs and period selector work', async ({ page }) => {
  await page.goto('/dashboard')
  await page.getByRole('tab', { name: 'Total Projects', exact: true }).click()
  await expect(
    page.getByRole('figure', { name: 'Total Projects', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('tab', { name: 'Operating Status', exact: true })
    .press('ArrowLeft')
  await page.getByRole('tab', { name: 'Operating Status', exact: true }).click()
  await expect(
    page.getByRole('figure', { name: 'Operating Status', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Period: Today', exact: true }).click()
  await page
    .getByRole('menuitemradio', { name: 'This week', exact: true })
    .click()
  await expect(page).toHaveURL(/period=week/)
  await expect(
    page.getByRole('heading', { name: 'Views', exact: true }).locator('..'),
  ).toContainText('50,855')
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Period: This week', exact: true }),
  ).toBeVisible()
})

test('the demo stays within a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/dashboard', '/settings', '/preferences', '/sign-in']) {
    await page.goto(path)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390)
  }
  await page.goto('/preferences')
  for (const name of [
    'Theme',
    'Time and language',
    'Notifications',
    'Privacy',
    'Payment',
    'Plugins',
  ]) {
    await page.getByRole('tab', { name, exact: true }).click()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390)
  }
})

test('account cards and sign-in composition match the source frames', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await page.goto('/settings')
  const cards = page.locator('main section[aria-labelledby] > div')
  await expect(cards).toHaveCount(6)
  for (const [index, height] of [556, 272, 268, 276, 316, 192].entries()) {
    const bounds = await cards.nth(index).boundingBox()
    expect(bounds?.width).toBe(892)
    expect(bounds?.height).toBe(height)
    if (index === 0) expect(bounds?.y).toBe(144)
  }
  expect(await page.locator('main footer').boundingBox()).toMatchObject({
    x: 212,
    y: 2164,
    width: 948,
    height: 56,
  })
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    2220,
  )
  await testInfo.attach('account-design-review', {
    body: await page.screenshot({
      path: testInfo.outputPath('design-review.png'),
      fullPage: true,
      animations: 'disabled',
    }),
    contentType: 'image/png',
  })
  await page.goto('/sign-in')
  expect((await page.locator('header').boundingBox())?.height).toBe(60)
  const form = page.getByRole('heading', { level: 1 }).locator('..')
  const card = form.locator('..')
  const bounds = await card.boundingBox()
  expect(bounds).toMatchObject({ x: 380, y: 184, width: 680, height: 656 })
  await testInfo.attach('sign-in-design-review', {
    body: await page.screenshot({
      path: testInfo.outputPath('sign-in-design-review.png'),
      animations: 'disabled',
    }),
    contentType: 'image/png',
  })
})
