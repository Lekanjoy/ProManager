import { test, expect } from '@playwright/test';

test('teams/users should be able to signup', async ({ page }) => {
  await page.goto('/signup');

  await page.getByPlaceholder('My Team').click();
  await page.getByPlaceholder('My Team').fill('Team Signup Test');
  await page.getByPlaceholder('Description of your team').click();
  await page.getByPlaceholder('Description of your team').fill('testing registration');
  await page.getByPlaceholder('team@example.com').click();
  await page.getByPlaceholder('team@example.com').fill('team+test13@gmail.com');
  await page.getByPlaceholder('••••••••').click();
  await page.getByPlaceholder('••••••••').fill('12345678');
  await page.getByRole('button', { name: 'Create Team Account' }).click();

   // Wait for the navigation to the Login page
   await page.waitForURL('/login'); 

   // Expects page to route to login after succesful registration
   await expect(page).toHaveURL("/login?message=Check%20your%20email%20to%20continue%20sign%20in%20process");
  await expect(page.getByText('Check your email to continue')).toBeVisible();
})

test('users should be able to login and admin should be able to create task and add comment', async ({page}) => {
  // Ensure the environment variables are loaded
  const testEmail = process.env.NEXT_PUBLIC_TEST_EMAIL;
  const testPassword = process.env.NEXT_PUBLIC_TEST_PASSWORD;

  if (!testEmail || !testPassword) {
    throw new Error('Environment variables NEXT_PUBLIC_TEST_EMAIL and NEXT_PUBLIC_TEST_PASSWORD must be set.');
  }

    await page.goto('/login');

    // Should throw an errow with wrong credentials
    await page.getByPlaceholder('you@example.com').click();
    await page.getByPlaceholder('you@example.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').click();
    await page.getByPlaceholder('••••••••').fill('11111111');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid login credentials')).toBeVisible();


  // Expects page to route to Dashboard after inputting correct credentials
    await page.getByPlaceholder('you@example.com').click();
    await page.getByPlaceholder('you@example.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').click();
    await page.getByPlaceholder('••••••••').fill(testPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for the navigation to the dashboard page
    await page.waitForURL('/dashboard'); 

  // Check that the URL is correct and initial data is fetched first
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Playwright E2E')).toBeVisible();


  // Click icon to add a new task
    await page.getByRole('img', { name: 'Add Task Icon' }).click();
    await expect(page.getByTestId('addTaskModal')).toBeVisible();
    await page.getByPlaceholder('Enter Title').click();
    await page.getByPlaceholder('Enter Title').fill('E2E Task');
    await page.getByPlaceholder('Enter Text').click();
    await page.getByPlaceholder('Enter Text').fill('Test task');
    await page.locator('select').selectOption('High');
    await page.getByRole('button', { name: 'Add Task' }).click();


  // Wait for the overlay to become hidden (not visible)
  const overlayLocator = page.locator('[data-testid="addTaskModal-overlay"]');
  await overlayLocator.waitFor({ state: 'hidden' });



  // Wait for the new task card to appear and click it to show details
    const taskCard = page.locator('[data-testid="taskCard"]');
    await taskCard.waitFor({ state: 'visible' });
    await taskCard.click();

  // Wait for the card details to appear
    const cardDetails = page.locator('[data-testid="cardDetails"]');
    await cardDetails.waitFor({ state: 'visible' });
    await expect(cardDetails).toContainText('E2E Task');
    
  // Check if send button to add comment is visible by default and add a new comment
    await expect(page.getByRole('button', { name: 'Send' })).toBeHidden(); //Send button to add comment should be hidden when not typing
    await page.getByPlaceholder('Add a comment...').click();
    await page.getByPlaceholder('Add a comment...').fill('e2e comment');
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible(); //Send button to add comment should be visible when there is a value in comment input
    await page.getByRole('button', { name: 'Send' }).click();

  // Wait for the new comment to appear
    const comment = page.locator('[data-testid="comment"]');
    await comment.waitFor({ state: 'visible' });
    await expect(comment).toContainText('e2e comment');

  // Card Details dialog should close after clicking the X(close) button
    await page.getByText('X').click();
    await expect(page.getByTestId('cardDetails')).toBeHidden();
})