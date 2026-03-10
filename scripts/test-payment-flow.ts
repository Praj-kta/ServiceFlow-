// scripts/test-payment-flow.ts
// Script to validate booking -> payment -> QR generation flow.

async function run() {
  const baseUrl = 'http://localhost:8080/api';

  const fetchJson = async (url: string, options: any = {}) => {
    const res = await fetch(url, options);
    const text = await res.text();
    let body: any = null;
    try { body = JSON.parse(text); } catch { body = text; }
    return { status: res.status, body };
  };

  // 1) Login as provider
  const providerLogin = await fetchJson(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'provider@test.com', password: 'password123' })
  });
  console.log('provider login', providerLogin.status, providerLogin.body);
  if (providerLogin.status !== 200) return;
  const providerToken = providerLogin.body.token;

  // 2) Create a service
  const newService = await fetchJson(`${baseUrl}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${providerToken}` },
    body: JSON.stringify({ title: 'Test Service for Flow', description: 'Test', category: 'Testing', price: 500 })
  });
  console.log('service create', newService.status, newService.body);
  const serviceId = newService.body._id;

  // 3) Login as user
  const userLogin = await fetchJson(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@test.com', password: 'password123' })
  });
  console.log('user login', userLogin.status, userLogin.body);
  const userToken = userLogin.body.token;

  // 4) Create booking
  const bookingRes = await fetchJson(`${baseUrl}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ serviceId, date: new Date().toISOString(), notes: 'test booking' })
  });
  console.log('booking create', bookingRes.status, bookingRes.body);
  const bookingId = bookingRes.body._id;

  // 5) Provider confirms booking (this should create payment)
  const bookingConfirm = await fetchJson(`${baseUrl}/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${providerToken}` },
    body: JSON.stringify({ status: 'confirmed' })
  });
  console.log('booking confirm', bookingConfirm.status, bookingConfirm.body);

  // 6) Fetch payment history for user
  const payments = await fetchJson(`${baseUrl}/payments/history/${userLogin.body.user.id}`);
  console.log('payments', payments.status, payments.body);
}

run().catch(e => console.error(e));
