import { test, expect } from '@playwright/test'

test('can add and toggle a task', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('New task').click()
  await page.getByLabel('New task').fill('Playwright Task')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Playwright Task')).toBeVisible()
  const checkbox = page.getByRole('checkbox', { name: /playwright task/i })
  await checkbox.click()
  await expect(checkbox).toBeChecked()
})
