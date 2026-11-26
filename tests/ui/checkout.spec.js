const { test, expect } = require('../../src/fixtures/test');
const { products, customer, errorMessages } = require('../../src/data/testData');

const TAX_RATE = 0.08; // SauceDemo applies 8% tax
const round2 = (n) => Math.round(n * 100) / 100;

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('user can complete an order end to end @smoke', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo(customer);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.cartBadge).toBeHidden();
  });

  test('order summary calculates item total, tax and total correctly @regression', async ({ inventoryPage, cartPage, checkoutPage }) => {
    const selected = [products.backpack, products.bikeLight, products.fleeceJacket];
    for (const product of selected) {
      await inventoryPage.addToCart(product.name);
    }
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomerInfo(customer);

    const summary = await checkoutPage.getSummary();
    const expectedSubtotal = round2(selected.reduce((sum, p) => sum + p.price, 0));
    const expectedTax = round2(expectedSubtotal * TAX_RATE);

    expect(summary.prices).toEqual(selected.map((p) => p.price));
    expect(summary.subtotal).toBe(expectedSubtotal);
    expect(summary.tax).toBe(expectedTax);
    expect(summary.total).toBe(round2(expectedSubtotal + expectedTax));
  });

  test('checkout requires customer details @regression', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo({ firstName: '', lastName: 'Tester', postalCode: '20000' });
    await expect(checkoutPage.errorMessage).toHaveText(errorMessages.firstNameRequired);

    await checkoutPage.fillCustomerInfo({ firstName: 'Suganthy', lastName: 'Tester', postalCode: '' });
    await expect(checkoutPage.errorMessage).toHaveText(errorMessages.postalCodeRequired);
  });
});
