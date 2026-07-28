# Testing Guide

## Overview

This project uses Vitest for testing with industry-standard patterns including proper setup, teardown, and automatic cleanup.

## Official Documentation & Resources

- Vitest: https://vitest.dev/
- Vitest API Reference: https://vitest.dev/api/
- Testing Best Practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- Testing Pyramid: https://martinfowler.com/articles/practical-test-pyramid.html
- Playwright (E2E): https://playwright.dev/
- Cypress (E2E): https://www.cypress.io/
- k6 (Load Testing): https://k6.io/
- Pact (Contract Testing): https://docs.pact.io/

## Testing Strategy

### Current: Integration Tests (Real API Testing)

Status: IMPLEMENTED

What we're doing:
We test real API endpoints using real server and database.

How it works:
- Tests make real HTTP requests to http://localhost:3000
- Uses actual PostgreSQL database (via Prisma)
- Tests complete flow: Request to Server to Database to Response
- Automatic cleanup after each test

Why?
- Tests actual production behavior
- Catches real integration bugs
- Tests NextAuth authentication flows properly
- Higher confidence before deployment

Server Setup:
- Currently: http://localhost:3000 (development server must be running)
- Future: Can switch to staging.example.com or production API by changing BASE_URL

To change server URL:
Edit `__tests__/helpers/test-utils.js`:
```javascript
const BASE_URL = 'http://localhost:3000';  // Change this
```

---

### Future: Testing Pyramid Approach (TODO)

#### Phase 1: Integration Tests (CURRENT - 25% of tests)
Status: Implemented
- Auth endpoints (login, register)
- Real API + Real Database
- Located in `__tests__/auth/`

#### Phase 2: Unit Tests (TODO - Should be 70% of tests)
Status: Not yet implemented
Purpose: Test business logic in isolation (fast, no server/DB needed)

What to test:
- Password validation functions
- Email format validators
- Zod schema validation
- Utility functions (date formatting, price calculations)
- Business rules (discount logic, stock calculations)

How:
- Mock all external dependencies (database, APIs)
- Test pure functions only
- Very fast execution (milliseconds)

Example structure:
```
__tests__/unit/
├── utils/
│   ├── password.test.js       # Test hashPassword(), comparePassword()
│   └── validation.test.js     # Test Zod schemas
├── services/
│   ├── pricing.test.js        # Test discount calculations
│   └── inventory.test.js      # Test stock management logic
```

When to write:
- After implementing business logic functions
- For reusable utilities
- For complex calculations

---

#### Phase 3: E2E Tests (TODO - Should be 5% of tests)
Status: Not yet implemented
Purpose: Test complete user journeys with browser automation

What to test:
- Critical business flows only
- Multi-step user journeys
- Visual regression

Example flows:
1. Complete Purchase: Register → Login → Add to Cart → Checkout → Verify Order
2. Inventory Management: Login as Admin → Add Product → Update Stock → Verify
3. Order Processing: Create Order → Payment → Fulfillment → Delivery

Tools to use:
- Playwright (recommended) - Modern, fast, multi-browser - https://playwright.dev/
- Cypress - Alternative, developer-friendly - https://www.cypress.io/
- Real browser automation
- Screenshot comparison

Example structure:
```
__tests__/e2e/
├── checkout-flow.test.js
├── admin-product-management.test.js
└── order-lifecycle.test.js
```

---

#### Phase 4: Advanced Testing (TODO)

Performance/Load Testing:
- Test API under load (100+ concurrent users)
- Measure response times
- Test rate limiting and throttling
- Tools:
  - k6 - Modern load testing tool - https://k6.io/
  - Artillery - Modern performance testing - https://www.artillery.io/
  - Apache JMeter - Traditional load testing - https://jmeter.apache.org/

API Contract Testing:
- Verify API responses match documented schemas
- Ensure frontend-backend contract is maintained
- Generate contracts from Zod schemas
- Tools:
  - Pact - Consumer-driven contracts - https://docs.pact.io/
  - OpenAPI Spec - API documentation standard - https://swagger.io/specification/
  - Zod to OpenAPI - Generate OpenAPI from Zod - https://github.com/asteasolutions/zod-to-openapi

Security Testing:
- SQL injection attempts
- XSS attack prevention
- CSRF token validation
- Rate limiting
- Tools:
  - OWASP ZAP - Security scanner - https://www.zaproxy.org/
  - Burp Suite - Web security testing - https://portswigger.net/burp
  - Snyk - Dependency vulnerability scanning - https://snyk.io/

Accessibility Testing:
- Test ARIA labels
- Keyboard navigation
- Screen reader compatibility
- Tools:
  - axe-core - Accessibility testing engine - https://github.com/dequelabs/axe-core
  - Pa11y - Automated accessibility testing - https://pa11y.org/
  - WAVE - Web accessibility evaluation - https://wave.webaim.org/

## Standard Testing Patterns

Reference: Vitest API - Test Hooks - https://vitest.dev/api/#test-api

### Pattern 1: beforeEach (Fresh Data Per Test)
Use this for CRUD operations where each test needs isolated data:

```javascript
describe('User CRUD', () => {
  let testUser;

  beforeEach(async () => {
    // Create fresh user BEFORE EACH test
    testUser = await createTestUser();
  });

  afterEach(async () => {
    // Clean up AFTER EACH test
    await deleteTestUser(testUser.id);
  });

  it('should update user', async () => {
    // Use testUser - it's fresh for this test
  });
});
```

### Pattern 2: beforeAll (Shared Setup)
Use this for expensive operations (like authentication) that can be shared:

```javascript
describe('Protected Routes', () => {
  let authToken;

  beforeAll(async () => {
    // Login ONCE before all tests
    authToken = await loginAsAdmin();
  });

  afterAll(async () => {
    // Cleanup ONCE after all tests
    await cleanup();
  });

  it('should access protected route', async () => {
    // All tests share the same authToken
  });
});
```

## Running Tests

**Prerequisites**:
- Start the development server first: `npm run dev`
- Ensure PostgreSQL database is running

```bash
# Run all tests
npm test

# Run in watch mode (auto-rerun on changes)
npm run test:watch

# Run with interactive UI
npm run test:ui

# Run specific test file
npm test __tests__/auth/login.test.js

# Run specific test suite
npm test -- --grep "Registration API"
```

## Test Results Location

After running tests, results are saved to `docs/test-result/`:
- **test-results.json** - Machine-readable JSON
- **index.html** - Interactive HTML report
- **coverage/** - Code coverage (if enabled)

View HTML report:
```bash
open docs/test-result/index.html
```

## Test Structure

```
__tests__/
├── auth/                    # Integration tests (current)
│   ├── login.test.js       # Tests real login API endpoint
│   └── register.test.js    # Tests real register API endpoint
├── helpers/
│   └── test-utils.js       # HTTP helpers, DB setup/cleanup
└── (future structure)
    ├── unit/               # TODO: Unit tests (mocked)
    │   ├── utils/
    │   └── services/
    └── e2e/                # TODO: End-to-end tests
        └── flows/
```

### Current Tests (Integration)
- **What**: Test real API endpoints with real database
- **Server**: localhost:3000 (must be running)
- **Database**: Real PostgreSQL database
- **Cleanup**: Automatic via `afterEach`/`afterAll` hooks

## Available Test Helpers

Located in `__tests__/helpers/test-utils.js`:

### User Management
- `createTestUser(overrides)` - Create test user (returns user with plainPassword)
- `deleteTestUser(userId)` - Delete user by ID
- `deleteTestUserByEmail(email)` - Delete user by email
- `cleanupAllTestUsers()` - Delete all test users

### HTTP Helpers
- `makeRequest(endpoint, options)` - Make HTTP request to localhost:3000
- `registerUser(userData)` - Register new user via API
- `loginUser(email, password)` - Login user via API

### Cleanup
- `closePrisma()` - Close Prisma connection (use in afterAll)

Reference: Vitest Setup Files - https://vitest.dev/config/#setupfiles

## Writing New Integration Tests

**These tests make real HTTP requests to localhost API endpoints.**

### Steps:
1. Create test file in appropriate module folder (e.g., `__tests__/products/`)
2. Import test utilities from `helpers/test-utils.js`
3. Use `describe` and `it` blocks
4. Use `beforeEach`/`afterEach` for per-test setup/cleanup
5. Always clean up test data to avoid database pollution

### Template:
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestUser, deleteTestUser } from '../helpers/test-utils.js';

describe('Feature Name', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  afterEach(async () => {
    await deleteTestUser(testUser.id);
  });

  it('should do something', async () => {
    // Your test code
    expect(testUser).toBeDefined();
  });
});
```

## Best Practices

1. **Isolation** - Each test should be independent
2. **Cleanup** - Always clean up test data in afterEach/afterAll
3. **Fresh Data** - Use beforeEach for fresh data per test
4. **Descriptive Names** - Use clear test descriptions
5. **Test Both Paths** - Test success and failure cases
6. **No Manual Cleanup** - Don't manually delete data in tests; use afterEach

## Common Mistakes to Avoid

BAD - Don't manually create users in each test:
```javascript
it('test 1', async () => {
  const user = await createUser(); // BAD: Repetitive
  // test code
  await deleteUser(user.id); // BAD: Manual cleanup
});
```

GOOD - Use beforeEach instead:
```javascript
beforeEach(async () => {
  testUser = await createUser(); // GOOD: Automatic
});

afterEach(async () => {
  await deleteUser(testUser.id); // GOOD: Automatic cleanup
});
```

BAD - Don't skip cleanup:
```javascript
it('should create user', async () => {
  const user = await createUser();
  // BAD: No cleanup - pollutes database
});
```

GOOD - Always cleanup:
```javascript
afterEach(async () => {
  await deleteUser(testUser.id); // GOOD: Cleanup guaranteed
});
```

---

## Testing Pyramid & Roadmap

Learn more: The Testing Pyramid - Martin Fowler - https://martinfowler.com/articles/practical-test-pyramid.html

```
     /\
    /E2E\       TODO: Critical user flows (5%)
   /------\     - Complete checkout process
  /Integration\ Current: API endpoint tests (25%)
 /--------------\ - Auth, Products, Orders APIs
/                \
    Unit Tests    TODO: Business logic (70%)
                  - Validation, utilities, services
```

### Implementation Roadmap

**Phase 1: Integration Tests** ✅ (Current)
- Test real API endpoints
- Test auth flows (register, login)
- Real database operations
- Automatic cleanup

**Phase 2: Unit Tests** (TODO)
- Validation logic tests (Zod schemas)
- Password hashing utilities
- Business rule functions
- No database/server needed (mocked)

**Phase 3: E2E Tests** (TODO)
- Browser automation (Playwright)
- Complete user journeys
- Multi-step workflows
- Visual regression testing

**Phase 4: Advanced Testing** (TODO)
- Performance/load testing
- API contract testing
- Security testing
- Accessibility testing

---

## Configuration

### Changing Test Server URL

To test against a different server (staging/production), update `BASE_URL` in:

**File**: `__tests__/helpers/test-utils.js`
```javascript
const BASE_URL = 'http://localhost:3000';  // Current
// const BASE_URL = 'https://staging.example.com';  // Staging
// const BASE_URL = 'https://api.example.com';  // Production
```

Note: When testing against staging/production:
- Ensure you have proper test data cleanup
- Use separate test database/environment
- Be careful with rate limiting

---

## Additional Learning Resources

### Testing Philosophy
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Write Tests. Not Too Many. Mostly Integration.](https://kentcdodds.com/blog/write-tests)
- [Static vs Unit vs Integration vs E2E Testing](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)

### Vitest Specific
- [Vitest Examples](https://github.com/vitest-dev/vitest/tree/main/examples)
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)

### API Testing
- [Supertest Documentation](https://github.com/ladjs/supertest) - HTTP assertions
- [REST API Testing Best Practices](https://www.freecodecamp.org/news/rest-api-testing-tutorial/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

### Advanced Topics
- [Test Doubles (Mocks, Stubs, Spies)](https://martinfowler.com/bliki/TestDouble.html)
- [F.I.R.S.T Principles](https://github.com/ghsukumar/SFDC_Best_Practices/wiki/F.I.R.S.T-Principles-of-Unit-Testing) - Fast, Independent, Repeatable, Self-validating, Timely
