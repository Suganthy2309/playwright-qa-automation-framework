/**
 * Test data: static UI data and a factory for unique API booking data.
 */

const products = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
};

const customer = { firstName: 'Suganthy', lastName: 'Tester', postalCode: '20000' };

const errorMessages = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  firstNameRequired: 'Error: First Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
};

/** Formats a Date as YYYY-MM-DD. */
const isoDate = (date) => date.toISOString().slice(0, 10);

/** Builds a unique booking so parallel tests never share data. */
function buildBooking(overrides = {}) {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + 7);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + 3);

  return {
    firstname: 'QA',
    lastname: `Auto${unique}`,
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: isoDate(checkin), checkout: isoDate(checkout) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

module.exports = { products, customer, errorMessages, buildBooking };
