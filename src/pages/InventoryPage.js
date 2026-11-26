const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async open() {
    await this.goto('/inventory.html');
  }

  /** Returns the inventory card (locator) for a product name. */
  item(productName) {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName) {
    await this.item(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName) {
    await this.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option) {
    // option values: 'az' | 'za' | 'lohi' | 'hilo'
    await this.sortDropdown.selectOption(option);
  }

  async getNames() {
    return this.itemNames.allTextContents();
  }

  async getPrices() {
    const prices = await this.itemPrices.allTextContents();
    return prices.map((p) => Number(p.replace('$', '')));
  }
}

module.exports = { InventoryPage };
