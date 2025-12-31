import { test, expect } from '@playwright/test';

const URL = 'http://localhost:5173/';

test('has title', async ({ page }) => {
  await page.goto(URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Simple BlogPage/);
});
