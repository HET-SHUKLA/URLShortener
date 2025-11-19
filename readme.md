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

2. `.env.sample`
    - For sample `.env` keys, To clone and run

3. `docker-compose.yml`
    - 


## PR Checklist
request/response types defined

zod validation on input

no raw SQL in controllers

no secret literals in code

added tests for new behavior