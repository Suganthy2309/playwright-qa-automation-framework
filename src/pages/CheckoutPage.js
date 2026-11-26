const { BasePage } = require('./BasePage');

/** Covers checkout step one (customer info), step two (overview) and completion. */
class CheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // Step one — customer information
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    // Step two — overview
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    // Complete
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Reads "Item total: $39.98" style labels and returns numbers. */
  async getSummary() {
    const toNumber = (text) => Number(text.replace(/[^0-9.]/g, ''));
    const prices = (await this.itemPrices.allTextContents()).map(toNumber);
    return {
      prices,
      subtotal: toNumber(await this.subtotalLabel.textContent()),
      tax: toNumber(await this.taxLabel.textContent()),
      total: toNumber(await this.totalLabel.textContent()),
    };
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };
