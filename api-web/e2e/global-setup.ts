import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright E2E tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test global setup...');

  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3001';

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for server to be ready
    console.log('⏳ Waiting for dev server to be ready...');
    let retries = 30;
    while (retries > 0) {
      try {
        await page.goto(baseURL, { timeout: 5000 });
        console.log('✅ Dev server is ready');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw new Error('Dev server failed to start');
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Check if test users exist by attempting login
    console.log('🔐 Checking test user credentials...');
    const loginResponse = await page.request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'customer@demo.com',
        password: 'Customer@123',
      },
    });

    if (loginResponse.ok()) {
      console.log('✅ Test users are ready');
    } else {
      console.warn('⚠️  Test user login failed - tests may need to register users');
    }

    console.log('✅ Global setup complete\n');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
