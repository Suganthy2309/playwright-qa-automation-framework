const { test, expect } = require('../../src/fixtures/test');
const { errorMessages } = require('../../src/data/testData');
const env = require('../../src/utils/env');

// Login tests must start logged out, so they ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('valid user can log in and see the products page @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(env.STANDARD_USER, env.UI_PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked-out user is blocked with a clear message @regression', async ({ page, loginPage }) => {
    await loginPage.login(env.LOCKED_USER, env.UI_PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(errorMessages.lockedOut);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // Data-driven negative tests
  const invalidLogins = [
    { title: 'empty username', username: '', password: 'secret_sauce', error: errorMessages.usernameRequired },
    { title: 'empty password', username: 'standard_user', password: '', error: errorMessages.passwordRequired },
    { title: 'wrong password', username: 'standard_user', password: 'wrong_pass', error: errorMessages.invalidCredentials },
    { title: 'unknown user', username: 'no_such_user', password: 'secret_sauce', error: errorMessages.invalidCredentials },
  ];

  for (const data of invalidLogins) {
    test(`shows an error for ${data.title} @regression`, async ({ loginPage }) => {
      await loginPage.login(data.username, data.password);
      await expect(loginPage.errorMessage).toHaveText(data.error);
    });
  }

  test('user can log out and protected pages are no longer accessible @regression', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(env.STANDARD_USER, env.UI_PASSWORD);
    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();

    await page.goto('/inventory.html');
    await expect(loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
