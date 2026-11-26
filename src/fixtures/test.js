/**
 * Custom fixtures.
 * Tests import { test, expect } from here instead of '@playwright/test',
 * so page objects, the API client and an auth token are ready to use
 * without repeating setup code in every spec.
 */
const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { BookingClient } = require('../api/BookingClient');
const { buildBooking } = require('../data/testData');
const env = require('../utils/env');

const test = base.test.extend({
  // ---------- UI page objects ----------
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // ---------- API ----------
  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  authToken: async ({ bookingClient }, use) => {
    const { token } = await bookingClient.createToken(env.API_USERNAME, env.API_PASSWORD);
    await use(token);
  },

  /** Creates a booking before the test and deletes it afterwards (test data cleanup). */
  createdBooking: async ({ bookingClient, authToken }, use) => {
    const payload = buildBooking();
    const response = await bookingClient.createBooking(payload);
    const { bookingid } = await response.json();
    await use({ id: bookingid, payload });
    await bookingClient.deleteBooking(bookingid, authToken);
  },
});

module.exports = { test, expect: base.expect };
