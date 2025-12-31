import { test, expect } from '@playwright/test';

const URL = 'http://localhost:5173/';

test('has title', async ({ page }) => {
  await page.goto(URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Simple BlogPage/);
});

test('has correct heading', async ({ page }) => {
  await page.goto(URL);

  const h1 = page.locator('h1');

  // Expect h1 to be the correct string.
  await expect(h1).toHaveText('Simple Blog Created by React');
});
