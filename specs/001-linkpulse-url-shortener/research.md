# Research: LinkPulse URL Shortener Platform

## Decision: Upgrade the scaffold to strict TypeScript instead of continuing in JavaScript

**Rationale**: The feature requires strict mode, maintainable architecture, typed contracts, and portfolio-grade quality. TypeScript gives better service/repository contracts, safer request/response shapes, and stronger refactoring support for authentication, analytics, and dashboard flows.

**Alternatives considered**:

- Keep JavaScript and add JSDoc: lower migration effort but weaker demonstration of modern backend engineering.
- Rewrite into another backend language: unnecessary because the existing scaffold already uses the expected Node ecosystem and has Docker, Prisma, and tests started.

## Decision: Keep Express and layer it cleanly

**Rationale**: The current API already uses Express. A clean route/controller/service/repository split satisfies the architecture goal without introducing framework churn. Routes should only wire HTTP concerns; controllers parse request context and call services; services own business rules; repositories own persistence.

**Alternatives considered**:

- NestJS: strong structure but higher migration weight for a portfolio project that already has Express.
- Fastify: faster defaults, but not necessary for the current feature scope and would add migration cost.

## Decision: Use PostgreSQL as source of truth and Redis as redirect cache

**Rationale**: PostgreSQL handles durable normalized data for users, links, refresh sessions, and click events. Redis is appropriate for hot short-code lookups and can reduce redirect latency while the database remains authoritative.

**Alternatives considered**:

- PostgreSQL only: simpler but weaker for demonstrating low-latency redirect design and cache invalidation.
- Redis as primary link storage: faster reads but poor fit for durable ownership, analytics, and relational queries.

## Decision: Record analytics asynchronously from the redirect path where possible

**Rationale**: Visitors should not wait on non-critical analytics enrichment. The redirect flow should validate link availability, increment counters safely, enqueue or fire non-blocking event recording, and redirect even if metadata enrichment is partially unavailable.

**Alternatives considered**:

- Fully synchronous analytics writes: simpler correctness model but increases redirect latency and couples visits to analytics availability.
- External queue service: production-like, but outside the current portfolio scope unless Redis-backed jobs are added later.

## Decision: Store refresh sessions as revocable hashed tokens

**Rationale**: Access tokens should be short lived, while refresh tokens need revocation and reuse detection. Storing hashed refresh tokens reduces damage if the database is exposed.

**Alternatives considered**:

- Long-lived access tokens only: simpler but weaker security.
- Server-only cookie sessions: valid for web-only apps, but JWT plus refresh sessions aligns with the requested API portfolio scope.

## Decision: Treat URL safety as a first-class business rule

**Rationale**: A public shortener can become an open redirect or internal-network probe if it accepts unsafe destinations. The service should only accept public `http` and `https` URLs, reject local/private hosts, normalize inputs, and return clear validation errors.

**Alternatives considered**:

- Only syntax validation: insufficient security for a production-quality shortener.
- Manual approval of all links: too restrictive for the intended self-service product.

## Decision: Use OpenAPI as the API contract artifact

**Rationale**: The project exposes a REST API and needs clear endpoint documentation. OpenAPI provides a reviewer-friendly contract that can drive docs, tests, and client expectations.

**Alternatives considered**:

- Markdown-only endpoint docs: readable but less precise.
- GraphQL schema: unnecessary for the required RESTful API.

## Decision: Validate with Docker Compose plus automated CI

**Rationale**: The user requires a one-command local startup and CI/CD checks. Docker Compose should start frontend, backend, PostgreSQL, and Redis. CI should install dependencies, lint, test, build, and verify Docker images.

**Alternatives considered**:

- Local-only npm scripts: faster for development but misses the deployment and reviewer reproducibility goals.
- Full Kubernetes setup: too heavy for the target junior-to-mid portfolio scope.
