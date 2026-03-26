// Registration API Tests
const BASE_URL = 'http://localhost:3000';

async function testRegisterAPI() {
  const results = [];

  console.log('\n========== REGISTER API TESTS ==========\n');

  // Test 1: Successful Registration
  console.log('Test 1: Successful User Registration');
  try {
    const email = `newuser${Date.now()}@example.com`;
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'SecurePass@123',
        name: 'John Doe',
      }),
    });

    const data = await response.json();
    const passed = response.status === 201;

    results.push({
      test: 'Successful User Registration',
      passed,
      request: {
        method: 'POST',
        endpoint: '/api/auth/register',
        body: { email, password: 'SecurePass@123', name: 'John Doe' }
      },
      response: {
        status: response.status,
        body: data
      }
    });

    console.log(passed ? '✓ PASS' : '✗ FAIL');
    console.log(`Response: ${JSON.stringify(data, null, 2)}\n`);
  } catch (error) {
    console.log('✗ ERROR:', error.message, '\n');
  }

  // Test 2: Duplicate Email
  console.log('Test 2: Reject Duplicate Email');
  try {
    const email = 'duplicate@test.com';

    // First registration
    await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Pass@123', name: 'User One' }),
    });

    // Attempt duplicate
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Pass@123', name: 'User Two' }),
    });

    const data = await response.json();
    const passed = response.status === 400;

    results.push({
      test: 'Reject Duplicate Email',
      passed,
      request: {
        method: 'POST',
        endpoint: '/api/auth/register',
        body: { email, password: 'Pass@123', name: 'User Two' }
      },
      response: {
        status: response.status,
        body: data
      }
    });

    console.log(passed ? '✓ PASS' : '✗ FAIL');
    console.log(`Response: ${JSON.stringify(data, null, 2)}\n`);
  } catch (error) {
    console.log('✗ ERROR:', error.message, '\n');
  }

  // Test 3: Missing Required Fields
  console.log('Test 3: Reject Missing Fields');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }), // missing password & name
    });

    const data = await response.json();
    const passed = response.status >= 400;

    results.push({
      test: 'Reject Missing Fields',
      passed,
      request: {
        method: 'POST',
        endpoint: '/api/auth/register',
        body: { email: 'test@example.com' }
      },
      response: {
        status: response.status,
        body: data
      }
    });

    console.log(passed ? '✓ PASS' : '✗ FAIL');
    console.log(`Response: ${JSON.stringify(data, null, 2)}\n`);
  } catch (error) {
    console.log('✗ ERROR:', error.message, '\n');
  }

  return results;
}

module.exports = { testRegisterAPI };
