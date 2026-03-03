// scripts/test-api.ts
import mongoose from 'mongoose';

const API_URL = 'http://localhost:3000/api';

async function testApi() {
  try {
    console.log('--- Starting API Verification ---');

    // 1. Health Check
    console.log('Testing Health Check...');
    try {
      const pingRes = await fetch(`${API_URL}/ping`);
      const pingData = await pingRes.json();
      console.log('Ping:', pingData);
    } catch (e) {
      console.error('Ping Failed:', e);
      return;
    }

    // 2. Register
    console.log('Testing Registration...');
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    let userId = '';
    let token = '';

    try {
      const regRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email,
          password,
          role: 'user'
        })
      });
      
      if (!regRes.ok) throw await regRes.text();
      const regData = await regRes.json();
      console.log('Registration Success:', regData.user.email);
    } catch (e) {
      console.error('Registration Failed:', e);
    }

    // 3. Login
    console.log('Testing Login...');
    try {
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginRes.ok) throw await loginRes.text();
      const loginData = await loginRes.json();
      console.log('Login Success');
      token = loginData.token;
      userId = loginData.user.id;
    } catch (e) {
      console.error('Login Failed:', e);
      return;
    }

    // 4. Create Service
    console.log('Testing Create Service...');
    let serviceId = '';
    try {
        const serviceRes = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Test Service',
                description: 'A test service',
                category: 'Testing',
                price: 100
            })
        });

        if (!serviceRes.ok) throw await serviceRes.text();
        const serviceData = await serviceRes.json();
        console.log('Create Service Success:', serviceData.title);
        serviceId = serviceData._id;
    } catch (e) {
        console.error('Create Service Failed:', e);
    }

    // 5. Create Booking
    console.log('Testing Create Booking...');
    if (serviceId && userId) {
        try {
            const bookingRes = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    serviceId,
                    date: new Date(),
                    notes: 'Test booking'
                })
            });

            if (!bookingRes.ok) throw await bookingRes.text();
            const bookingData = await bookingRes.json();
            console.log('Create Booking Success:', bookingData._id);
        } catch (e) {
            console.error('Create Booking Failed:', e);
        }
    }

    console.log('--- Verification Complete ---');

  } catch (err) {
    console.error('Test Failed:', err);
  }
}

testApi();
