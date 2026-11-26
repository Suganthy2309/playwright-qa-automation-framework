/**
 * Central place for environment configuration.
 * Values come from the .env file (locally) or GitHub Actions secrets/variables (CI).
 * Safe public defaults are used for the demo applications, so the suite
 * also runs without a .env file.
 */
const path = require('path');

const env = {
  UI_BASE_URL: process.env.UI_BASE_URL || 'https://www.saucedemo.com',
  API_BASE_URL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',

  STANDARD_USER: process.env.STANDARD_USER || 'standard_user',
  LOCKED_USER: process.env.LOCKED_USER || 'locked_out_user',
  UI_PASSWORD: process.env.UI_PASSWORD || 'secret_sauce',

  API_USERNAME: process.env.API_USERNAME || 'admin',
  API_PASSWORD: process.env.API_PASSWORD || 'password123',

  STORAGE_STATE: path.resolve(__dirname, '../../.auth/standard-user.json'),
};

module.exports = env;
