import { checkA11y, expect, test } from './fixtures'

test.describe('sign-in', () => {
  test('shows validation messages and wires them to the fields', async ({
    page,
  }) => {
    await page.goto('/sign-in')
    const email = page.getByLabel('Email')
    const password = page.getByLabel('Password', { exact: true })

    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(page.getByText('Enter your email.')).toBeVisible()
    await expect(page.getByText('Enter your password.')).toBeVisible()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription(/Enter your email\./)
    await expect(email).toBeFocused()
    await checkA11y(page)

    await email.fill('not-an-email')
    await password.fill('short')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(
      page.getByText('Enter a valid email, like you@example.com.'),
    ).toBeVisible()
    await expect(
      page.getByText('The password must be at least 8 characters.'),
    ).toBeVisible()
  })

  test('a valid submission shows a toast', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel('Email').fill('ada@example.com')
    const password = page.getByLabel('Password', { exact: true })
    await password.fill('correct horse')
    const show = page.getByRole('button', { name: 'Show password' })
    await show.click()
    await expect(password).toHaveAttribute('type', 'text')
    await expect(show).toHaveAttribute('aria-pressed', 'true')
    await expect(
      page.getByRole('checkbox', { name: 'Remember me' }),
    ).toBeChecked()

    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    const toast = page.getByRole('status').filter({ hasText: 'Signed in' })
    await expect(toast).toBeVisible()
    await expect(toast).toContainText('ada@example.com')
    await expect(page.getByText(/^Enter /)).toHaveCount(0)
  })
})

test.describe('settings', () => {
  test('the profile form validates and saves', async ({ page }) => {
    await page.goto('/settings')
    const name = page.getByLabel('Full name')
    await name.fill('')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Enter your name.')).toBeVisible()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toBeFocused()

    await name.fill('Ada Lovelace')
    await page.getByRole('combobox', { name: 'Country' }).click()
    await page.getByRole('option', { name: 'Canada' }).click()
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(
      page.getByRole('status').filter({ hasText: 'Changes saved' }),
    ).toBeVisible()
  })

  test('every tab renders its form without axe violations', async ({
    page,
  }) => {
    await page.goto('/settings')
    for (const tab of ['Account', 'Notifications', 'Appearance']) {
      await page.getByRole('tab', { name: tab }).click()
      await expect(
        page.getByRole('main').getByRole('tabpanel', { name: tab }),
      ).toBeVisible()
      await checkA11y(page)
    }
    // Appearance applies at once.
    await page.getByRole('radio', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('radio', { name: 'Compact' })).toBeDisabled()
  })

  test('?tab= opens a tab; the slider and switch work', async ({ page }) => {
    await page.goto('/settings?tab=notifications')
    await expect(
      page.getByRole('tab', { name: 'Notifications' }),
    ).toHaveAttribute('aria-selected', 'true')
    const slider = page.getByRole('slider', { name: 'Emails per week' })
    await slider.focus()
    await page.keyboard.press('ArrowRight')
    await expect(slider).toHaveAttribute('aria-valuenow', '4')
    await expect(page.getByText('At most 4 emails a week')).toBeVisible()
    const push = page.getByRole('switch', { name: 'Push notifications' })
    await push.click()
    await expect(push).toBeChecked()
  })
})

test('the order table sorts, selects and pages', async ({ page }) => {
  await page.goto('/dashboard')
  const table = page.getByRole('table', { name: 'Order List' })
  const idHeader = table.getByRole('columnheader', { name: /Order ID/ })
  const firstId = () => table.getByRole('row').nth(1).getByRole('cell').nth(1)

  await expect(idHeader).toHaveAttribute('aria-sort', 'none')
  await idHeader.getByRole('button').click()
  await expect(idHeader).toHaveAttribute('aria-sort', 'ascending')
  await expect(firstId()).toHaveText('#CM9801')
  await idHeader.getByRole('button').click()
  await expect(idHeader).toHaveAttribute('aria-sort', 'descending')
  await expect(firstId()).toHaveText('#CM9824')

  const selectAll = table.getByRole('checkbox', {
    name: 'Select all orders on this page',
  })
  await selectAll.click()
  await expect(selectAll).toBeChecked()
  // #CM9804 (page 4 now) was selected already.
  await expect(page.getByText('7 orders selected')).toBeVisible()

  await page.getByRole('link', { name: 'Go to next page' }).click()
  await expect(firstId()).toHaveText('#CM9818')
  await expect(selectAll).not.toBeChecked()
  await expect(page.getByRole('link', { name: '2' })).toHaveAttribute(
    'aria-current',
    'page',
  )

  await page.getByRole('searchbox', { name: 'Filter orders' }).fill('Rejected')
  await expect(table.getByRole('row')).toHaveCount(4)
})
