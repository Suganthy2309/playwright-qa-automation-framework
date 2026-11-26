/**
 * Logs in once with the standard user and saves the browser session
 * (cookies + local storage) to .auth/. UI projects reuse it via storageState,
 * so most tests skip the login screen and run faster.
 */
const { test: setup, expect } = require('../../src/fixtures/test');
const env = require('../../src/utils/env');

setup('authenticate as standard user', async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.login(env.STANDARD_USER, env.UI_PASSWORD);

  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: env.STORAGE_STATE });
});
