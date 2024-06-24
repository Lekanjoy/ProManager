import { test, expect } from '@playwright/test';

test('has title and CTA text', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/ProManager/);
  // Expects page to have a link button with Try Now text on default .
  await expect(page.getByRole('link', { name: 'Try Now ⚡' })).toBeVisible();
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Get Started' }).click();

    // Wait for the navigation to the login page
    await page.waitForURL('/');

  // Expects page to route to login after clicking 'Get Started' if not authenticated
  await expect(page).toHaveURL('/login');

});

test('try now link', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Try Now ⚡' }).click();

  // Expects page to route to login
  await expect(page).toHaveURL('/login');

});
