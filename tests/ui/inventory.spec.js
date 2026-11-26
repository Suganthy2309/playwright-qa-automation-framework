const { test, expect } = require('../../src/fixtures/test');
const { products } = require('../../src/data/testData');

// These tests start already logged in (storageState from the setup project).
test.describe('Products & cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('products can be sorted by price low to high @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    const expected = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(expected);
  });

  test('products can be sorted by name Z to A @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getNames();
    const expected = [...names].sort().reverse();
    expect(names).toEqual(expected);
  });

  test('adding and removing items updates the cart badge @smoke', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('cart keeps the selected items after navigation @regression', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.boltTShirt.name);
    await inventoryPage.addToCart(products.fleeceJacket.name);

    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart\.html/);
    expect(await cartPage.getItemNames()).toEqual([products.boltTShirt.name, products.fleeceJacket.name]);

    // Leave the cart and return: items must persist
    await cartPage.continueShoppingButton.click();
    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});
