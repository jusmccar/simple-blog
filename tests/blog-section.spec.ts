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

test('users can see a post by clicking on it', async ({ page }) => {
  await page.goto(URL);

  // Get main section.
  const main = page.locator('main');

  // Get all links in main section.
  const links = main.getByRole('link');

  await expect(links).toHaveCount(3);

  await expect(links.nth(0)).toHaveText('5 Mouth-Watering Recipes You Need to Try This Week');

  await links.nth(0).click();

  const h2 = page.locator('h2');

  await expect(h2).toHaveText('5 Mouth-Watering Recipes You Need to Try This Week');
});
