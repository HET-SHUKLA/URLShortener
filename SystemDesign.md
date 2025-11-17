# **SYSTEM DESIGN - URL Shortener**

## **1. Problem Statement**

A scalable URL-shortening service that converts long URLs into short, manageable links.

The system must provide fast redirects, user accounts, analytics tracking, custom aliases, and link expiration.

It should be able to serve high traffic bursts (10k concurrent requests) reliably while staying simple enough for rapid feature development.

It should be able to provide full analysis of the shorten link.

**Non-Goals**

- No full-scale marketing/SEO features
- No multi-region replication initially

## **2. Functional Requirements**

* Create short URL from long URL
* Redirect short URL → long URL
* Custom alias support
* Link expiration
* User authentication & dashboard
* Basic analytics (click count, last accessed)
* Admin panel (optional)

---

## **3. Non-Functional Requirements**

* **Performance**:

  * Redirect latency < 50ms (p95)
  * Handle 10k concurrent requests (burst)
* **Scalability**: horizontally scalable stateless backend
* **Reliability**: graceful degradation if Redis or DB fails
* **Security**: validated URLs, rate limiting, JWT-based auth
* **Observability**: logs, metrics, traces
* **Cost**: must run on free/low-cost tiers


## **4. High-Level Architecture**

(You will draw this in app.eraser.io — include the following components)

**Components:**

* Client (Web + future mobile apps)
* CDN / Edge cache (for cached redirects)
* Load Balancer
* Backend Service (Node.js, Fastify)
* Redis (cache + rate limiter)
* PostgreSQL (primary DB)
* Queue + Workers (BullMQ)
* Metrics (Prometheus + Grafana)
* Logging (structured JSON)
* Error tracking (Sentry)

**Request Flow (Redirect):**
Client → CDN (cache hit → 302)
→ App Server → Redis (cache hit → 302)
→ Postgres (cache miss) → store in Redis → 302 response


## **5. Detailed Component Design**

### **5.1 Load Balancer**

**Responsibilities:**

* Distribute traffic across backend instances
* Terminate HTTPS
* Enforce IP-level rate limiting (basic)

**Scaling:**
Horizontally scaled backend instances behind the LB.

---

### **5.2 Backend Application Service**

* Built using Node.js + TypeScript + Fastify
* Stateless (all state in DB/cache)
* Follows layered architecture:

  * Controller → Service → Repository
* Uses Prisma for DB queries
* Uses Redis for caching hot keys
* Uses zod for input validation

---
### **5.3 Cache Layer (Redis)**

**Cached Keys:**

* `url:<shortId>` → `{ longUrl, expiresAt }`
* TTL = based on expiration or default 30 days

**Cache Strategy:**

* Cache on write
* Cache on first lookup (read-through)
* Delete when URLs expire
* Serve degraded mode if Redis down
---
### **5.4 Primary Database (PostgreSQL)**

**Responsibility:**
Truth source for URLs, users, analytics metadata.

**Scaling:**

* Primary + optional read replicas (future)
* Connection pooling via pgBouncer

**Indexing:**

* Unique index: `short_id`
* Index on: `owner_id`, `expires_at`

**Backup Plan:**
Daily backups (automated by provider)

---
### **5.5 Background Workers**

**Technologies:** BullMQ + Redis

**Tasks:**

* Increment click counters
* Cleanup expired URLs
* Compile daily analytics
* Retry failed jobs with exponential backoff

**Dead-letter Queue:**
Failed tasks moved to `queue:dead` after max retries

---

### **5.6 CDN / Edge**

**Responsibilities:**

* Cache Landing page for instant webpage load
* Cache 302 redirect responses for popular links
* Reduce latency by serving from edge
* TTL configurable (default: 10 minutes)

---

### **5.7 Observability**

**Logging:**

* Structured JSON logs (Pino/Winston)
* Logged per request: urlId, latency, cacheHit, error

**Metrics:**

* Request count
* Redirect latency
* Cache hit rate
* Error rate
* Worker queue depth

**Tracing:**

* OpenTelemetry for full request traces


## **6. Database Design**

### **6.1 Tables**

### **Table: users**

| Field           | Type      | Required | Default    | Note            |
|-----------------|-----------|----------|------------|-----------------|
| id              | uuid pk   | Yes      | -          | Primary key     |
| email           | text      | Yes      | -          | Unique Index    |
| isEmailVerified | boolean   | Yes      | False      |                 |
| emailVerifiedAt | timestamp | No       | null       |                 |
| createdAt       | timestamp | Yes      | Date.now() |                 |
| updatedAt       | timestamp | Yes      | Date.now() |                 |
| deletedAt       | timestamp | No       | null       | For soft delete |

---

### **Table: user_auth**

| Field           | Type                 | Required | Default    | Note                                    |
|-----------------|----------------------|----------|------------|-----------------------------------------|
| id              | uuid pk              | Yes      | -          |     Primary Key                     |
| email           | text                 | Yes      | -          |  Unique Index            |
| authProvider   | enum [Email, Google] | Yes      | -          |                                         |
| password        | password hash       | No       | -          | Not for providers like google           |
| createdAt       | timestamp            | Yes      | Date.now() |                                         |
| updatedAt       | timestamp            | Yes      | Date.now() |                                         |
| lastSignInAt | timestamp            | Yes      | Date.now() |                                         |
| meta            | jsonb                | No       | -          | For storing details like refresh tokens |

---

### **Table: urls**

| Field              | Type                                | Required | Default             | Note                                                |
|--------------------|-------------------------------------|----------|---------------------|-----------------------------------------------------|
| id                 | bigserial                           | Yes      | -                   | Primary Key                                         |
| shortId            | text                                | Yes      | -                   | Unique, Indexed                                     |
| longUrl            | text                                | Yes      | -                   | Validated URL                                       |
| ownerId            | uuid fk                             | No       | -                   | Fk users.id. (User can create URLs without sign in) |
| protectionMethod   | enum [None, Password, OTP, Approve] | Yes      | None                | Protect URL redirecting                             |
| protectedPassword  | password hash                      | No       | -                   | Passoword for password method                       |
| isUrlSFW           | boolean                             | Yes      | True                | User consent for NSFW URLs                          |
| isAnalyticsEnable  | boolean                             | Yes      | True                |                                                     |
| expiresAt          | timestamp                           | Yes      | Date.now() + 5 days | For guest users 5 Days                              |
| renewAt            | timestamp                           | Yes      | Date.now()          | Need renew after 6 mos                              |
| totalClicks        | bigInt                                | Yes      | 0                   | Total click to shorten URL                          |
| totalSuccessClicks | text                                | Yes      | 0                   | Total clicks after main page                        |
| createdAt          | timestamp                           | Yes      | Date.now()          |                                                     |
| updatedAt          | timestamp                           | Yes      | Date.now()          |                                                     |
| meta               | jsonb                               | No      | null                | OTPs etc.                                           |

---

### **Table: url_analytics (aggregated by worker)**

| Field      | Type                             | Required | Default    | Note                     |
|------------|----------------------------------|----------|------------|--------------------------|
| clickId    | uuid pk                          | Yes      | -          | Unique, Indexed, PK      |
| urlId      | fk                               | Yes      | -          | urls.urlId               |
| isSuccess  | boolean                          | Yes      | False      | If user did not redirect |
| ipAddress  |hashed IP                             | Yes      | -          | ipAddress of click       |
| methodUsed | enum [None,Password,OTP,Approve] | Yes      | None       |                          |
| createdAt  | timestamp                        | Yes      | Date.now() |                          |
| meta       | jsonb                            | No       | -          |                          |

---

### **6.2 Important**
- Data in `users` and `user_auth` should be added using Transaction only.

---

### **6.3 Indexing Strategy**

* `short_id UNIQUE`
* `expires_at INDEX`
* `owner_id INDEX`

---

### **6.4 Partitioning Plan (Future)**

* Partition `url_analytics` by month
* Potentially shard `urls` by shortId prefix when millions of entries

---

## **7. API Structure**

### **POST /api/v1/shorten**

Creates a new short URL.

**Request**

```json
{
  "longUrl": "https://example.com",
  "customAlias": "wizard",
  "expiresAt": "2025-01-01"
}
```

**Response**

```json
{
  "shortId": "wizard",
  "shortUrl": "https://yourdomain.com/wizard"
}
```

**Errors:**

* 400 invalid URL
* 409 alias exists
* 401 unauthorized
* 429 rate-limited

---

### **GET /:shortId**

Redirects to original URL.

Flow:

1. Check CDN
2. Check Redis
3. Check Postgres
4. Push click event to queue
5. Return 302

---

### **GET /api/v1/url/:shortId**

Returns metadata.

---

### **Auth**

* POST /api/v1/register
* POST /api/v1/login
* POST /api/v1/refresh

---

## **8. Scaling Strategy**

* Horizontal scaling of backend via containers
* Redis caching for 90%+ of traffic
* CDN edge caching for popular URLs
* Queue system to offload heavy tasks
* Read replicas (later)
* Reduce DB writes during high load
* Rate limiting & IP throttling

---

## **9. Failure Modes & Recovery**

| Failure           | Handling                                      |
| ----------------- | --------------------------------------------- |
| Redis down        | fallback to DB, reduced performance           |
| DB down           | serve cached items only, error on new shorten |
| Queue backed up   | autoscale workers                             |
| CDN serving stale | TTL-based cleanup                             |
| App crash         | auto-restart through container orchestrator   |

---

## **10. Security Design**

* Validate URLs fully
* Guard against SSRF
* JWT + refresh tokens
* Parameterized queries (via Prisma)
* Rate limiting (IP + user-based)
* Brute-force detection
* HTTPS enforced
* CORS locked down
* Secrets in environment variables

---

## **11. Tools & Tech Stack**

### **Backend**

* Node.js 20
* Fastify
* TypeScript
* Prisma
* PostgreSQL
* Redis
* BullMQ

### **Frontend**

* Next.js + TypeScript

### **Infra**

* Docker, Docker Compose
* GitHub Actions
* Vercel / Render / Fly.io
* Prometheus + Grafana
* Sentry
* OpenTelemetry

---

## **12. Development Workflow**

* GitHub Flow branching
* PR must pass: tests, lints, types
* Every feature includes unit tests
* E2E tests for redirect flow
* Dockerized Postgres/Redis for local dev
* Automated deploy on main branch

---

## **13. Future Enhancements**

* Custom domains
* Team accounts
* Detailed analytics
* Bot/spam detection
* Multi-region deployment
* Edge-function redirects (global)
* QR code generator

---

## **14. Appendix**

* Architecture diagram (from app.eraser.io)
* Sequence diagrams
* Load testing results
* ER diagram

---

If you want, I can also create:

* A **sample architecture diagram** layout you can copy
* A **Docker Compose file**
* A **Prisma schema**
* Or a **README.md** that matches this document

Just tell me what you want next.
