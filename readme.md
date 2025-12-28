> docker compose exec --user root server /bin/sh -lc "npm ci"

# URL Shortener

Write the short 2-page system design doc now (5–6 bullets).

Implement a type-safe MVP: Next.js + TS API + Prisma + Postgres. Basic redirect + tests. ✔️

Add Redis cache for redirect hot path + background queue for clicks. ✔️

Add CI, Dockerfile, staging deploy. ✔️

Add monitoring (Sentry + Prometheus) and run load tests. Fix bottlenecks. ✔️

Implement CDN/edge caching for redirect responses. ✔️

Harden security (rate limits, input validation, WAF rules). ✔️

---
## File Structure
```plaintext
project-root/
  .env
  .env.example
  docker-compose.yml
  Dockerfile
  package.json
  tsconfig.json
  prisma/
    schema.prisma
    migrations/
  src/
    app.ts            // build Fastify app
    server.ts         // start server

    config/
      index.ts        // loads env, exports config object

    db/
      prisma.ts       // PrismaClient singleton
      redis.ts        // Redis client setup

    modules/
      auth/
        auth.controller.ts
        auth.service.ts
        auth.repository.ts
        auth.routes.ts
        auth.types.ts
        auth.validators.ts
      users/
        users.controller.ts
        users.service.ts
        users.repository.ts
        users.routes.ts
        users.types.ts
        users.validators.ts
      urls/
        urls.controller.ts
        urls.service.ts
        urls.repository.ts
        urls.routes.ts
        urls.types.ts
        urls.validators.ts
      analytics/
        analytics.controller.ts
        analytics.service.ts
        analytics.repository.ts
        analytics.routes.ts
        analytics.types.ts
      notifications/
        notifications.service.ts
        notifications.repository.ts
        notifications.types.ts

    middleware/
      auth.middleware.ts
      error.middleware.ts
      rateLimit.middleware.ts
      logging.middleware.ts

    lib/
      logger.ts        // pino/winston
      crypto.ts        // hashing, tokens
      shortid.ts       // short id generator
      validation.ts    // zod helpers
      errors.ts        // app-level Error classes

    jobs/
      index.ts         // job runner entry
      clickAggregator.job.ts
      cleanupExpiredUrls.job.ts
      notificationDispatcher.job.ts

    tests/
      unit/
      integration/
      e2e/
```

### Details

1. `.env`
    - For sensitive data and API Keys.
    - It will be ignored while commiting and pushing
    - We can have `.env.prod`, `.env.example` etc.

2. `.env.sample`
    - For sample `.env` keys, To clone and run

3. `docker-compose.yml`
    - For running multiple services.
    - There would be `compose.prod.yml` for production.

4. `Dockerfle`
    - To build and run application in Docker

5. `tsconfig.json`
    - For typescript confitguration

6. `package.json`
    - For packages

7. `prisma/schema.prisma`
    - For database schema.

8. `Migrations`
    - For all the prisma schema migration
  


## PR Checklist
request/response types defined

zod validation on input

no raw SQL in controllers

no secret literals in code

added tests for new behavior

# Steps

Good. Enough architecture foreplay — time to ship.

Here’s the **order you should follow** and the **rules you must not break** if you want minimum pain later.

---

## 0️⃣ Before anything: lock the basics

**Do this first** (no coding logic yet):

1. **Make sure this works without errors:**

   * `docker compose up -d`
   * `ENV_FILE=.env.local npx prisma migrate dev --name init`
   * `npx prisma generate`

2. Confirm:

   * Postgres is up.
   * Prisma client is generated under `src/generated/prisma` (or wherever you configured).

If that’s broken, **don’t** write app code yet. Fix infra first.

---

## 1️⃣ Step 1: Get a bare server running

Goal: a thin HTTP server + health check, nothing else.

* Create:

  * `src/app.ts` – build Fastify/Express app (no routes yet)
  * `src/server.ts` – import `app`, listen on `PORT`

* Add **one route only**:

  * `GET /health` → returns `{ status: "ok" }`

* Wire:

  * basic logger (console is fine for now)
  * global error handler (catch unhandled errors → 500 JSON)

**Don’t touch Prisma or Redis in this step.**
You want: `curl localhost:3000/health` working, clean logs, no nonsense.

---

## 2️⃣ Step 2: Config + env sanity

Before you touch business logic, nail config:

* Create `src/config/env.ts` (or `config/index.ts`).

* Use `process.env` + Zod (or at least strict checks) to load:

  * `PORT`
  * `DATABASE_URL` or `DB_*` pieces
  * `JWT_SECRET`
  * `NODE_ENV`

* Export a **typed** `config` object.

Rules:

* **Never** use `process.env` directly in controllers/services.
  Only access via `config`.
* Crash early if required env is missing.

This prevents subtle “works locally, dies in prod” disasters.

---

## 3️⃣ Step 3: Prisma wiring (one query, nothing more)

Goal: prove DB + Prisma works end-to-end.

* Create `src/db/prisma.ts` with:

  * PrismaClient instance
  * basic connection log
* In `GET /health`, make a **tiny** query:

  * e.g. `await prisma.$queryRaw\`SELECT 1`;`
  * or `await prisma.user.count()` (if you want)

If that works, your stack (HTTP + config + Prisma + Docker) is real.

Only then proceed.

---

## 4️⃣ Step 4: Decide **first vertical slice**: Auth + User

You’ll move faster by building **one thin vertical slice** instead of scattered features.

Start with **auth / user**:

**Create folder:**

```text
src/modules/auth/
  auth.routes.ts
  auth.controller.ts
  auth.service.ts
  auth.repository.ts
  auth.validators.ts
  auth.types.ts

src/modules/users/
  users.repository.ts   // maybe no controller yet
  users.types.ts
```

### Implement *minimum* features:

1. `POST /auth/register`

   * Validates body (email + password).
   * Creates `User` + `UserAuth` (email/password).
   * Returns minimal user DTO + token.

2. `POST /auth/login`

   * Validates body.
   * Verifies password.
   * Returns token + simple user data.

That’s it. No Google, no refresh tokens yet. Get this rock solid first.

---

## 5️⃣ Step 5: Rules for each layer (non-negotiable)

### Controller (`*.controller.ts`)

* Only:

  * parse HTTP request (params, query, body)
  * call validator
  * call service
  * map result → HTTP response
* **No Prisma** calls.
* **No raw business logic** (no hashing, no JWT, no DB decisions).

### Service (`*.service.ts`)

* Contains business logic:

  * sign-up flow
  * login flow
  * renew URL logic
* Calls:

  * `auth.repository`
  * `users.repository`
  * utilities (`lib/password`, `lib/jwt`)
* Responsible for transactions, if needed.

### Repository (`*.repository.ts`)

* Only DB access:

  * Prisma client usage
  * queries, joins, paging, etc.
* Returns **domain data**, not HTTP structures.

### Validators (`*.validators.ts`)

* Use zod (or similar).
* Convert `unknown` input → typed DTO or throw.
* **Never** talk to DB here.

### Types (`*.types.ts`)

* DTOs:

  * `RegisterRequest`
  * `LoginResponse`
  * `CreateUrlRequest`
* Keep them decoupled from Prisma types.

If you break these boundaries, you’ll create headaches later.

---

## 6️⃣ Step 6: Add URL shortening vertical slice

Once auth works and you can register/login:

Create `src/modules/urls/` and implement:

1. `POST /urls`

   * Authenticated.
   * Body: `longUrl`, `protectionMethod`, maybe `expiresAt` override.
   * Validates URL.
   * Service:

     * generate shortId
     * set expiresAt (guest vs user)
     * create Url row
   * Returns short URL info.

2. `GET /:shortId`

   * Public.
   * Query DB (or later cache).
   * Respect protection rules (just basic for now).
   * Return redirect (302) with longUrl (in controller, or pass to a framework handler).

Don’t add analytics, jobs, Redis yet. Get basic redirect flow correct.

---

## 7️⃣ Step 7: Only then add Redis / analytics / jobs

After basic auth + URL flow works:

* Add Redis connection (`src/db/redis.ts`).
* Cache `shortId → longUrl` in `urls.service`.
* Add barebones analytics:

  * When redirect happens, fire-and-forget job logging click (no queue initially).
* Later upgrade to Redis queue when you’re comfortable.

Do not start with Redis first. You’ll just slow yourself down.

---

## 8️⃣ While coding: things you must watch for

### 1. Statelessness

* Never store important state in memory (`Map`, `Set`) that is needed across requests.
* Session/rate-limit/anything persistent → Redis or DB.

### 2. Input validation everywhere

* Every public handler must validate input.
* You **never** trust `req.body` directly.
* For each route:

  * define `zod` schema
  * parse and use typed result, not `any`.

### 3. Error handling discipline

* Define error classes at app-level (`AppError`, `ValidationError`, `AuthError`).
* Global error handler maps:

  * validation → 400
  * auth → 401/403
  * not found → 404
  * unknown → 500
* Don’t `console.log` everywhere; centralize logging in one place.

### 4. Don’t leak Prisma models across the app

* Repositories return plain objects or DTOs.
* Don’t let controllers touch Prisma types directly; it couples everything.

### 5. Small PR mindset (even if you’re solo)

Treat features as mini-PRs:

* Step 1: route + validator + stub service → compile passes.
* Step 2: fill service logic → compile passes.
* Step 3: fill repository → compile passes.
* Step 4: test happy path manually (`curl` / Postman).

Avoid giant changes in one go.

---

## 9️⃣ Order of execution (do this, in this order)

1. ✅ Health route + basic Fastify/Express app.
2. ✅ Env/config and Prisma DB connectivity.
3. ✅ `auth.register` + `auth.login` vertical slice (modules, services, repos, validators).
4. ✅ URL create + redirect vertical slice.
5. ✅ Add Redis + simple caching to `GET /:shortId`.
6. ✅ Add basic analytics job (logging to `url_analytics`).
7. ✅ Refine/extend: Google auth, better analytics, background jobs, rate-limiting.

---

You’re ready. Don’t over-plan any further — you have more than enough structure.

Start with **auth** and **urls** exactly as above.
When you hit a concrete block (not a theoretical “what if”), bring it back and we’ll fix that precisely.
