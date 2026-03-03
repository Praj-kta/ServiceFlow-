
const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    const options = { method };
    if (body) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    console.log(`${name}: ${response.status} ${response.statusText}`);
    return response.ok;
  } catch (error) {
    console.error(`${name} Failed:`, error.message);
    return false;
  }
}

async function verify() {
  console.log('--- Starting Full API Verification ---');
  
  // 1. Provider Dashboard
  await testEndpoint('Provider Dashboard', `${BASE_URL}/provider/dashboard/test-provider`);
  
  // 2. User Dashboard
  await testEndpoint('User Dashboard', `${BASE_URL}/user/dashboard/test-user`);
  
  // 3. AI Smart Matching
  await testEndpoint('AI Smart Matching', `${BASE_URL}/ai/smart-matching`, 'POST', {});
  
  // 4. AI Vastu
  await testEndpoint('AI Vastu', `${BASE_URL}/ai/vastu-detection`, 'POST', {});
  
  // 5. Payment Request
  await testEndpoint('Create Payment', `${BASE_URL}/payments/request`, 'POST', {
    userId: '60d0fe4f5311236168a109ca', // Mock ID
    amount: 1000,
    status: 'pending'
  });
  
  // 6. Swagger Docs
  try {
    const res = await fetch('http://localhost:3000/api-docs/');
    console.log(`Swagger UI: ${res.status} ${res.statusText}`);
  } catch (e) {
    console.error('Swagger UI Failed:', e.message);
  }

  console.log('--- Verification Complete ---');
}

verify();
