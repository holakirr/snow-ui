import { animationsDone, checkA11y, expect, test } from './fixtures'

test.describe('sign-in', () => {
  test('shows validation messages and wires them to the fields', async ({
    page,
  }) => {
    await page.goto('/sign-in')
    const email = page.getByLabel('Email')
    const password = page.getByLabel('Password', { exact: true })

    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(page.getByText('Enter your email.')).toBeVisible()
    await expect(page.getByText('Enter your password.')).toBeVisible()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription(/Enter your email\./)
    await expect(email).toBeFocused()
    await checkA11y(page)

    await email.fill('not-an-email')
    await password.fill('short')
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
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
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    const toast = page.getByRole('status').filter({ hasText: 'Signed in' })
    await expect(toast).toBeVisible()
    await expect(toast).toContainText('ada@example.com')
    await expect(page.getByText(/^Enter /)).toHaveCount(0)
  })
})

test.describe('settings', () => {
  test('both layouts share the profile and remember it after a reload', async ({
    page,
  }) => {
    await page.goto('/settings')
    await page
      .getByRole('textbox', { name: 'First Name', exact: true })
      .fill('Ada')
    await page.goto('/preferences')
    await expect(
      page.getByRole('tab', { name: 'Ada', exact: true }),
    ).toBeVisible()
    await page.getByRole('button', { name: /^Name Ada/ }).click()
    const dialog = page.getByRole('dialog')
    await dialog
      .getByRole('textbox', { name: 'Name', exact: true })
      .fill('Grace')
    await dialog
      .getByRole('button', { name: 'Save Changes', exact: true })
      .click()
    await expect(dialog).toBeHidden()
    await page.goto('/settings')
    await expect(
      page.getByRole('textbox', { name: 'First Name', exact: true }),
    ).toHaveValue('Grace')
    await page.reload()
    await expect(
      page.getByRole('textbox', { name: 'First Name', exact: true }),
    ).toHaveValue('Grace')
  })

  test('every preferences tab renders without axe violations', async ({
    page,
  }) => {
    await page.goto('/preferences')
    await checkA11y(page)
    for (const tab of [
      'Theme',
      'Time and language',
      'Notifications',
      'Privacy',
      'Payment',
      'Plugins',
    ]) {
      await page.getByRole('tab', { name: tab, exact: true }).click()
      await expect(
        page.getByRole('tabpanel', { name: tab, exact: true }),
      ).toBeVisible()
      await checkA11y(page)
    }
    await page.getByRole('tab', { name: 'Theme', exact: true }).click()
    await page.getByRole('radio', { name: 'Dark', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await animationsDone(page)
    for (const tab of [
      'ByeWind',
      'Theme',
      'Time and language',
      'Notifications',
      'Privacy',
      'Payment',
      'Plugins',
    ]) {
      await page.getByRole('tab', { name: tab, exact: true }).click()
      await checkA11y(page)
    }
  })

  test('notification preferences are shared and cancellation restores saved values', async ({
    page,
  }) => {
    await page.goto('/preferences?tab=notifications')
    await expect(
      page.getByRole('tab', { name: 'Notifications', exact: true }),
    ).toHaveAttribute('aria-selected', 'true')
    const notifications = page.getByRole('switch', {
      name: 'Email notifications',
      exact: true,
    })
    await notifications.click()
    await expect(notifications).not.toBeChecked()
    await page.goto('/settings')
    const email = page.getByRole('checkbox', {
      name: 'Notifications: Email',
      exact: true,
    })
    await expect(email).not.toBeChecked()
    await email.click()
    const section = page.getByRole('region', {
      name: 'Notifications',
      exact: true,
    })
    await section.getByRole('button', { name: 'Cancel', exact: true }).click()
    await expect(email).not.toBeChecked()
    await email.click()
    await section
      .getByRole('button', { name: 'Save Changes', exact: true })
      .click()
    await page.goto('/preferences?tab=notifications')
    await expect(
      page.getByRole('switch', { name: 'Email notifications', exact: true }),
    ).toBeChecked()
  })
})

test('the order table sorts, selects and pages', async ({ page }) => {
  await page.goto('/orders')
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
