# Playwright QA Automation Framework

[![Playwright Tests](https://github.com/Suganthy2309/playwright-qa-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/Suganthy2309/playwright-qa-automation-framework/actions/workflows/playwright.yml)

An end-to-end **UI and API test automation framework** built with **Playwright and JavaScript**.
It shows how I design maintainable automation: Page Object Model, custom fixtures, reusable login sessions,
data-driven tests, environment configuration, CI/CD with GitHub Actions and Docker execution.

> **Note:** My professional automation work was built in private client repositories that are confidential.
> This is a personal portfolio project that uses the same design approach against public demo applications.

| Area | Application under test |
|------|------------------------|
| UI   | [SauceDemo](https://www.saucedemo.com) — e-commerce web app (login, products, cart, checkout) |
| API  | [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) — REST booking API (auth + CRUD) |

---

## Tech stack

- **Playwright Test** (JavaScript, Node.js 20+)
- **Page Object Model** for UI pages
- **Custom fixtures** for page objects, API client, auth token and test data with automatic cleanup
- **APIRequestContext** for API testing
- **storageState** to log in once and reuse the session
- **dotenv** for environment configuration
- **GitHub Actions** CI (API job + UI browser matrix, nightly schedule, report artifacts)
- **Docker** (official Playwright image)
- Reports: HTML, JUnit XML, traces, screenshots and videos on failure

## What is covered — 39 tests

**UI (Chromium + Firefox)**
- Login: valid login, locked-out user, data-driven negative logins, logout and access to protected pages
- Products: sorting by price and name, add/remove items, cart badge, cart persistence
- Checkout: full end-to-end order, **item total / 8% tax / total calculation check**, required-field validation

**API**
- Health check, token generation, invalid credentials
- Create, read, search, full update (PUT), partial update (PATCH) and delete a booking
- Negative test: update without a token returns **403**
- Persistence checks: every change is verified with a follow-up GET request

Tests are tagged **`@smoke`** (fast, critical paths) and **`@regression`** (full coverage).

## Project structure

```
playwright-qa-automation-framework/
├── .github/workflows/playwright.yml   # CI pipeline
├── src/
│   ├── api/BookingClient.js           # API client (APIRequestContext wrapper)
│   ├── data/testData.js               # Static test data + booking data factory
│   ├── fixtures/test.js               # Custom fixtures (pages, API client, token, cleanup)
│   ├── pages/                         # Page Object Model
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   └── utils/env.js                   # Environment configuration
├── tests/
│   ├── setup/auth.setup.js            # Logs in once, saves storageState
│   ├── ui/                            # login, inventory, checkout specs
│   └── api/booking.spec.js            # Booking API specs
├── playwright.config.js
├── Dockerfile
└── .env.example
```

## Getting started

```bash
git clone https://github.com/Suganthy2309/playwright-qa-automation-framework.git
cd playwright-qa-automation-framework
npm ci
npx playwright install --with-deps
cp .env.example .env        # optional — safe defaults are built in
```

## Running tests

| Command | What it runs |
|---------|--------------|
| `npm test` | Everything (UI in Chromium + Firefox, and API) |
| `npm run test:smoke` | Only `@smoke` tests |
| `npm run test:regression` | Only `@regression` tests |
| `npm run test:api` | API tests only |
| `npm run test:ui` | UI tests only |
| `npm run test:headed` | UI tests in a visible Chromium browser |
| `npm run test:debug` | Step through tests with the Playwright Inspector |
| `npm run report` | Open the last HTML report |

### Run in Docker

```bash
npm run docker:build
npm run docker:test
```

## CI/CD — GitHub Actions

The workflow runs on every push and pull request to `main`, on a weekday nightly schedule and manually from the Actions tab.

- **API job** runs the API suite (no browser needed).
- **UI job** runs in a matrix of **Chromium** and **Firefox** in parallel.
- In CI, failed tests are **retried up to 2 times**; a trace is recorded on the first retry.
- HTML reports, traces, screenshots and videos are uploaded as **artifacts** for failure analysis.

## Design decisions

- **Page objects hold locators and actions only; assertions stay in the tests**, so tests read like test cases.
- **Locators use `data-test` attributes and roles** (`getByTestId`, `getByRole`) instead of fragile CSS paths, plus Playwright's web-first assertions and auto-waiting — no hard-coded waits.
- **Login once with `storageState`**: the setup project logs in and saves the session, so UI tests skip the login screen.
- **Fixtures handle test data**: `createdBooking` creates a unique booking before a test and deletes it afterwards, so tests are independent and safe to run in parallel.
- **No secrets in code**: configuration comes from `.env` locally or GitHub secrets/variables in CI.

## Author

**Suganthy Shanmugavel** — QA Engineer
[LinkedIn](https://www.linkedin.com/in/suganthy-shanmugavel-18111b2ab) · [GitHub](https://github.com/Suganthy2309)
