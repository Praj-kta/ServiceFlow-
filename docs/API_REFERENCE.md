# ServiceFlow API Reference 📚

This document summarizes the current API surface in the ServiceFlow project and shows how to generate API clients from the OpenAPI spec.

---

## Quick facts ✅
- Base URL (dev): `/api`
- Swagger UI: `/api-docs` (served from `server/index.ts`)
- JWT support declared in Swagger components (`bearerAuth`) but **no auth middleware is enforced** in current routes — tokens are issued on login/register, but routes are currently public unless you add auth checks.

---

## Endpoints

### Auth 🔐
- POST `/api/auth/register`
  - Body: { name, email, password, role?, phone?, address? }
  - Response: 201 { token, user }
- POST `/api/auth/login`
  - Body: { email, password }
  - Response: 200 { token, user }

### Services 🛠️
- GET `/api/services`
  - Response: 200 [Service]
- GET `/api/services/:id`
  - Params: id (string)
  - Response: 200 Service | 404
- POST `/api/services`
  - Body: Service (title, description, category, price, providerId?, image?)
  - Response: 201 Service
- PUT `/api/services/:id`
  - Body: Service
  - Response: 200 Service | 404
- DELETE `/api/services/:id`
  - Response: 200 message | 404

### Bookings 📅
- POST `/api/bookings`
  - Body: Booking (userId, serviceId, date, notes?)
  - Response: 201 Booking
- GET `/api/bookings/user/:userId`
  - Params: userId
  - Response: 200 [Booking]
- PUT `/api/bookings/:id/status`
  - Body: { status } (pending|confirmed|completed|cancelled)
  - Response: 200 Booking | 404

### Provider (dashboard, jobs) 👷
- GET `/api/provider/dashboard/:providerId`
  - Response: 200 { stats }
- GET `/api/provider/jobs/:providerId`
  - Response: 200 [job objects]

### User (dashboard, profile, favorites, transactions) 👤
- GET `/api/user/dashboard/:userId`
  - Response: 200 { totals }
- GET `/api/user/profile/:id`
  - Response: 200 { profile }
- PUT `/api/user/profile/:id`
  - Body: profile fields to update
  - Response: 200 message
- GET `/api/user/favorites/:userId`
  - Response: 200 [favorites]
- GET `/api/user/transactions/:userId`
  - Response: 200 [transactions]

### Payments 💳
- POST `/api/payments/request`
  - Body: Payment (userId, amount, bookingId?, providerId?, method?, breakdown?)
  - Response: 201 Payment
- GET `/api/payments/history/:userId`
  - Response: 200 [Payment]

### AI (mock endpoints) 🤖
- POST `/api/ai/smart-matching`
  - Response: 200 { matches: [{providerId, name, score}] }
- POST `/api/ai/vastu-detection`
  - Body: image/input
  - Response: 200 { score, issues, recommendations }
- POST `/api/ai/chat`
  - Body: { message }
  - Response: 200 { reply, suggestions, timestamp }

### Contracts 🧾
- POST `/api/contracts`
  - Body: Contract (serviceType, specificTask, schedules, contactName, mobile, ...) 
  - Response: 201 Contract

### Reviews ⭐
- POST `/api/reviews`
  - Body: Review (userId, providerId, rating, comment, serviceId?)
  - Response: 201 Review
- GET `/api/reviews/:serviceId`
  - Params: serviceId
  - Response: 200 [Review]

### Root & utilities
- GET `/api` → { message: "ServiceFlow API is running" }
- GET `/api/ping` → { message }
- GET `/api/demo` → demo response
- Swagger UI at `/api-docs` (auto-generated from JSDoc comments in `server/routes`)

---

## Models (summary) 🔧
- User: { id, name, email, role (user|provider|admin), phone, address, providerProfile }
- Service: { id, title, description, category, price, providerId, image }
- Booking: { id, userId, serviceId, status, date, notes }
- Payment: { id, bookingId, userId, providerId, amount, currency, status, method, transactionId, breakdown }
- Contract: { id, serviceType, specificTask, bhk, floors, area, projectType, scheduledDate, contactName, mobile, status }
- Review: { id, bookingId, userId, providerId, serviceId, rating, comment }

> See `server/models/*.ts` for full Mongoose schemas and `server/swagger.ts` for OpenAPI schema definitions.

---

## Notes & Recommendations ⚠️
- Authentication: Tokens are issued by `/auth` but there is currently no middleware that enforces JWT checks on protected routes. Add an `auth` middleware to protect write/update endpoints as needed.
- Validation: Request payloads are not validated (no Zod/Joi). Consider adding validation for request bodies.
- Tests: Add endpoint tests (Vitest) for core flows (auth, booking creation, payment flow).

---

## How to generate API clients & docs (next steps) 💡
1. Use the existing Swagger UI at `/api-docs` to review the OpenAPI spec interactively.
2. Export the OpenAPI JSON and run a generator (example using openapi-generator):

```bash
# Install once
npm install @openapitools/openapi-generator-cli -g

# Generate TypeScript Fetch client (example)
openapi-generator-cli generate -i http://localhost:3000/api-docs/swagger.json -g typescript-fetch -o ./generated/api-client
```

3. Or write a small script that writes the `swaggerSpec` to disk (`server/swagger.ts` exports `swaggerSpec`). I can add that script if you want (e.g., `scripts/export-swagger.ts`).

---

## Want me to do this for you? 🔧
- I can generate an `openapi.json` file in the repo and add a `package.json` script (`pnpm run export:openapi`) to produce it.
- I can also add a `docs/openapi.yaml` or run an OpenAPI codegen step to produce a TypeScript client.

Tell me which of the above you'd like next (export spec file, add generator script, or generate a client).