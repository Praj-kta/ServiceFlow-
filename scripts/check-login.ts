// scripts/check-login.ts
// Simple script to verify the /api/auth/login endpoint.

async function main() {
  const url = 'http://localhost:8080/api/auth/login';
  const body = { email: 'user@test.com', password: 'password123' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('status', res.status, res.statusText);
    const text = await res.text();
    console.log('body:', text);
  } catch (err) {
    console.error('fetch error', err);
  }
}

main();
