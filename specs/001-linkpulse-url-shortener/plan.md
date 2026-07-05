# Implementation Plan: LinkPulse URL Shortener Platform

**Branch**: `001-linkpulse-url-shortener` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-linkpulse-url-shortener/spec.md`

## Summary

Build LinkPulse as a production-style URL shortening SaaS: users can create and manage short links, visitors get low-latency redirects, owners see analytics, and reviewers can run, test, and deploy the full product from documented commands. The existing JavaScript monorepo will be upgraded into a strict TypeScript workspace with a layered API, React dashboard, PostgreSQL persistence, Redis-backed redirect caching, automated tests, Docker Compose, CI checks, and deployment documentation.

## Technical Context

**Language/Version**: TypeScript 5.x strict mode across backend and frontend; Node.js 22 LTS runtime; SQL schema managed through Prisma.

**Primary Dependencies**: Express for the HTTP API, Prisma for data access, PostgreSQL for durable storage, Redis for redirect cache, bcrypt for password hashing, JWT for access and refresh sessions, Zod for validation, Helmet/CORS/rate-limit middleware for security, React + Vite for the frontend, Recharts for analytics charts, QR code generation library for link QR codes.

**Storage**: PostgreSQL for users, links, refresh sessions, and click events; Redis for hot redirect lookups and cache invalidation; environment variables for secrets and deployment configuration.

**Testing**: Vitest for unit and integration tests, Supertest for API endpoint tests, Prisma test database setup for repository/service coverage, frontend component/page smoke tests where practical, Docker image verification in CI.

**Target Platform**: Containerized web application running on Linux-compatible hosts; local development on Windows through npm workspaces and Docker Compose.

**Project Type**: Full-stack web application with REST API backend, React frontend, PostgreSQL database, Redis cache, and deployment/CI infrastructure.

**Performance Goals**: 95% of active short-link visits begin redirecting in under 300ms under normal local/deployed conditions; 95% of short-link creation attempts complete in under 2s; dashboard search/filter remains usable for at least 500 owned links.

**Constraints**: Backend coverage target is at least 80%; business logic must be testable outside route handlers; all protected resources must enforce ownership; redirects must not expose private destination details for unavailable links; analytics recording must not block successful redirects when non-critical metadata capture fails.

**Scale/Scope**: Portfolio-grade SaaS suitable for junior-to-mid backend review: individual account model, anonymous link creation, owned link management, per-link analytics, no paid plans, no organization/team roles, no enterprise SSO.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The generated constitution file still contains placeholder text and no enforceable project-specific principles. Planning therefore uses the user-supplied quality requirements as the active gates:

- Strict TypeScript across application code.
- Layered backend separation: routes, controllers, services, repositories, models, middleware, utilities.
- Production security controls: validation, password hashing, JWT/refresh sessions, CORS, Helmet, rate limiting, safe URL handling.
- Automated quality gates: lint, tests, build, Docker verification.
- Documentation complete enough for setup, architecture review, API use, database schema review, environment setup, and deployment.

**Gate Status**: PASS. No unresolved clarifications remain.

## Project Structure

### Documentation (this feature)

```text
specs/001-linkpulse-url-shortener/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- openapi.yaml
|-- checklists/
|   |-- requirements.md
|-- spec.md
```

### Source Code (repository root)

```text
apps/
|-- api/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- db/
|   |   |-- middleware/
|   |   |-- repositories/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   |-- utils/
|   |   |-- app.ts
|   |   |-- server.ts
|   |-- test/
|   |   |-- unit/
|   |   |-- integration/
|   |   |-- api/
|   |-- Dockerfile
|   |-- package.json
|   |-- tsconfig.json
|-- web/
|   |-- src/
|   |   |-- components/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- styles/
|   |   |-- types/
|   |   |-- main.tsx
|   |-- Dockerfile
|   |-- package.json
|   |-- tsconfig.json
prisma/
|-- schema.prisma
|-- migrations/
.github/
|-- workflows/
|   |-- ci.yml
docs/
|-- architecture.md
|-- api.md
|-- database.md
|-- deployment.md
|-- environment.md
docker-compose.yml
package.json
README.md
```

**Structure Decision**: Keep the existing `apps/api`, `apps/web`, and `prisma` monorepo shape, but migrate source files from `.js`/`.jsx` to `.ts`/`.tsx` and add missing layers, tests, docs, and CI infrastructure. This preserves the current scaffold while meeting the production-quality requirements.

## Complexity Tracking

No constitution violations are present. The repository/service layering is deliberate because authentication, link ownership, redirect caching, analytics recording, and reporting queries need independently testable business logic.

## Phase 0 Output

Research decisions are captured in [research.md](./research.md).

## Phase 1 Output

Design artifacts are captured in:

- [data-model.md](./data-model.md)
- [quickstart.md](./quickstart.md)
- [contracts/openapi.yaml](./contracts/openapi.yaml)

## Post-Design Constitution Check

**Gate Status**: PASS.

- The data model supports all specified entities and ownership rules.
- The API contract covers authentication, URL CRUD, redirects, analytics, dashboard, health, and account profile endpoints.
- The quickstart defines local validation, test, build, Docker, and CI expectations.
- No active extension hooks are configured in `.specify/extensions.yml`.
