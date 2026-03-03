
const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    const options = { method, headers: {} };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    console.log(`${name}: ${response.status} ${response.statusText}`);
    return { ok: response.ok, data };
  } catch (error) {
    console.error(`${name} Failed:`, error.message);
    return { ok: false };
  }
}

async function verify() {
  console.log('--- Starting Phase 2 API Verification ---');
  
  // 1. User Features
  await testEndpoint('User Favorites', `${BASE_URL}/user/favorites/test-user`);
  await testEndpoint('User Transactions', `${BASE_URL}/user/transactions/test-user`);
  
  // 2. AI Chat
  await testEndpoint('AI Chat', `${BASE_URL}/ai/chat`, 'POST', { message: 'find a plumber' });
  
  // 3. Contracts
  await testEndpoint('Create Contract', `${BASE_URL}/contracts`, 'POST', {
    serviceType: 'new-home-construction',
    bhk: '2 BHK',
    mobile: '1234567890'
  });
  
  // 4. Reviews
  const reviewRes = await testEndpoint('Submit Review', `${BASE_URL}/reviews`, 'POST', {
    userId: 'u1',
    providerId: 'p1',
    rating: 5,
    comment: 'Great service!'
  });
  
  if (reviewRes.ok) {
    await testEndpoint('Get Reviews', `${BASE_URL}/reviews/s1`);
  }

  // 5. Service CRUD (Create then Update then Delete)
  const serviceRes = await testEndpoint('Create Service', `${BASE_URL}/services`, 'POST', {
    title: 'Test Service',
    price: 500,
    category: 'Test'
  });
  
  if (serviceRes.ok && serviceRes.data._id) {
    const id = serviceRes.data._id;
    await testEndpoint('Update Service', `${BASE_URL}/services/${id}`, 'PUT', { price: 600 });
    await testEndpoint('Delete Service', `${BASE_URL}/services/${id}`, 'DELETE');
  }

  console.log('--- Phase 2 Verification Complete ---');
}

verify();
