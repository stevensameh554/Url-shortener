# Tasks: LinkPulse URL Shortener Platform

**Input**: Design documents from `specs/001-linkpulse-url-shortener/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Required by FR-029 and SC-006. Write story tests before implementation and keep backend behavior coverage at or above 80%.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks.
- **[Story]**: User story label from the feature spec. Setup, foundational, and polish tasks have no story label.
- Every task includes an exact target path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Upgrade the existing scaffold into a strict TypeScript monorepo with repeatable local commands.

- [X] T001 Update root workspace scripts and dev dependencies in package.json
- [X] T002 [P] Add root TypeScript shared settings in tsconfig.base.json
- [X] T003 [P] Add root ESLint configuration in eslint.config.js
- [X] T004 [P] Add root Prettier configuration in .prettierrc
- [X] T005 Update API package scripts, runtime dependencies, and TypeScript dev dependencies in apps/api/package.json
- [X] T006 Update web package scripts, runtime dependencies, and TypeScript dev dependencies in apps/web/package.json
- [X] T007 [P] Add API TypeScript config in apps/api/tsconfig.json
- [X] T008 [P] Add web TypeScript config in apps/web/tsconfig.json
- [X] T009 Rename API entry files from apps/api/src/app.js and apps/api/src/server.js to apps/api/src/app.ts and apps/api/src/server.ts
- [X] T010 Rename web entry files from apps/web/src/main.jsx and apps/web/src/api.js to apps/web/src/main.tsx and apps/web/src/lib/api.ts
- [X] T011 Update Docker build commands for TypeScript output in apps/api/Dockerfile
- [X] T012 Update Docker build commands for Vite TypeScript output in apps/web/Dockerfile
- [X] T013 Update docker-compose.yml service environment, health checks, and dependency ordering for postgres, redis, api, and web
- [X] T014 Update .env.example with all API, web, database, Redis, JWT, CORS, rate-limit, and deployment variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schema, configuration, middleware, typing, and test harness required before any user story implementation.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T015 Extend Prisma schema for User, Link, ClickEvent, RefreshSession, status fields, timestamps, and indexes in prisma/schema.prisma
- [X] T016 Generate initial Prisma migration for the planned data model in prisma/migrations/
- [X] T017 Create typed environment loader and validation schema in apps/api/src/config/env.ts
- [X] T018 [P] Create shared API response helpers in apps/api/src/utils/responses.ts
- [X] T019 [P] Create typed HTTP error classes in apps/api/src/utils/http-error.ts
- [X] T020 [P] Create async route wrapper in apps/api/src/utils/async-handler.ts
- [X] T021 [P] Create request typing extensions in apps/api/src/types/express.d.ts
- [X] T022 Create Prisma client module in apps/api/src/db/prisma.ts
- [X] T023 Create Redis client and cache helpers in apps/api/src/db/redis.ts
- [X] T024 Create application logger in apps/api/src/utils/logger.ts
- [X] T025 Create global error middleware in apps/api/src/middleware/error.ts
- [X] T026 Create request validation middleware using Zod in apps/api/src/middleware/validate.ts
- [X] T027 Create request ID and structured logging middleware in apps/api/src/middleware/request-context.ts
- [X] T028 Create security middleware setup for Helmet, CORS, body limits, and rate limits in apps/api/src/middleware/security.ts
- [X] T029 Create API router composition in apps/api/src/routes/index.ts
- [X] T030 Create health controller and route in apps/api/src/controllers/health.controller.ts and apps/api/src/routes/health.routes.ts
- [X] T031 [P] Create backend unit test setup in apps/api/test/setup.ts
- [X] T032 [P] Create backend integration test database helpers in apps/api/test/helpers/database.ts
- [X] T033 [P] Create backend API test app helper in apps/api/test/helpers/test-app.ts
- [X] T034 Create frontend app shell, routing entry, and layout baseline in apps/web/src/App.tsx
- [X] T035 [P] Create frontend API client and auth token plumbing in apps/web/src/lib/api.ts
- [X] T036 [P] Create frontend shared types from API contract in apps/web/src/types/api.ts
- [X] T037 [P] Create frontend global styles and responsive layout tokens in apps/web/src/styles/global.css

**Checkpoint**: Foundation ready. User story implementation can now proceed.

---

## Phase 3: User Story 1 - Shorten and Share Links (Priority: P1) MVP

**Goal**: Visitors and signed-in users can create valid short links, use optional aliases/expiration, and copy the resulting short URL.

**Independent Test**: Submit a valid URL, receive a unique short URL, visit it, and confirm duplicate aliases and invalid URLs are rejected.

### Tests for User Story 1

- [X] T038 [P] [US1] Add URL validation unit tests in apps/api/test/unit/url-validator.test.ts
- [X] T039 [P] [US1] Add short-code generation unit tests in apps/api/test/unit/short-code.test.ts
- [X] T040 [P] [US1] Add create-link API tests for generated codes, aliases, expiration, conflicts, and invalid URLs in apps/api/test/api/links-create.test.ts
- [X] T041 [P] [US1] Add frontend link creation smoke tests in apps/web/src/features/links/CreateLinkForm.test.tsx

### Implementation for User Story 1

- [X] T042 [P] [US1] Implement public URL safety validator in apps/api/src/utils/url-validator.ts
- [X] T043 [P] [US1] Implement short-code generator in apps/api/src/utils/short-code.ts
- [X] T044 [US1] Implement Link repository create and uniqueness methods in apps/api/src/repositories/link.repository.ts
- [X] T045 [US1] Implement Link creation service with alias, expiration, ownership, and conflict rules in apps/api/src/services/link.service.ts
- [X] T046 [US1] Implement create-link schemas in apps/api/src/validators/link.validators.ts
- [X] T047 [US1] Implement link controller create and public detail actions in apps/api/src/controllers/link.controller.ts
- [X] T048 [US1] Implement link routes for POST /api/links and GET /api/links/:shortCode in apps/api/src/routes/link.routes.ts
- [X] T049 [US1] Wire link routes into API router in apps/api/src/routes/index.ts
- [X] T050 [US1] Create landing page with URL shortening form in apps/web/src/pages/LandingPage.tsx
- [X] T051 [US1] Create reusable link creation form in apps/web/src/features/links/CreateLinkForm.tsx
- [X] T052 [US1] Create short-link result and copy interaction in apps/web/src/features/links/ShortLinkResult.tsx
- [X] T053 [US1] Add link creation API functions in apps/web/src/features/links/linkApi.ts

**Checkpoint**: User Story 1 works independently as the MVP.

---

## Phase 4: User Story 2 - Redirect Visitors Reliably (Priority: P1)

**Goal**: Active short links redirect quickly while missing, disabled, deleted, and expired links return correct responses without leaking private details.

**Independent Test**: Open active, unknown, expired, disabled, and deleted short URLs and verify redirect or error behavior plus click recording.

### Tests for User Story 2

- [X] T054 [P] [US2] Add redirect service unit tests for active, expired, disabled, deleted, and missing links in apps/api/test/unit/redirect.service.test.ts
- [X] T055 [P] [US2] Add redirect API tests for 302, 404, 410, cache hit, and cache miss behavior in apps/api/test/api/redirect.test.ts
- [X] T056 [P] [US2] Add analytics recording resilience test for redirect flow in apps/api/test/integration/redirect-analytics.test.ts

### Implementation for User Story 2

- [X] T057 [P] [US2] Implement redirect cache read/write/invalidation helpers in apps/api/src/services/redirect-cache.service.ts
- [X] T058 [US2] Implement redirect lookup and availability rules in apps/api/src/services/redirect.service.ts
- [X] T059 [US2] Implement click counter increment method in apps/api/src/repositories/link.repository.ts
- [X] T060 [US2] Implement non-blocking click event recording entry point in apps/api/src/services/click-event.service.ts
- [X] T061 [US2] Implement redirect controller in apps/api/src/controllers/redirect.controller.ts
- [X] T062 [US2] Implement public redirect route GET /:shortCode in apps/api/src/routes/redirect.routes.ts
- [X] T063 [US2] Wire redirect route before API routes in apps/api/src/app.ts
- [X] T064 [US2] Add expired and unavailable link user-facing response page or JSON handling in apps/web/src/pages/LinkUnavailablePage.tsx

**Checkpoint**: User Stories 1 and 2 provide a complete public shortener loop.

---

## Phase 5: User Story 3 - Manage Owned Links (Priority: P2)

**Goal**: Authenticated users can view, search, filter, sort, edit, enable/disable, delete, copy, and generate QR codes for owned links.

**Independent Test**: Register or log in, create multiple links, manage them in the dashboard, and confirm another user's links are not exposed.

### Tests for User Story 3

- [X] T065 [P] [US3] Add link ownership and authorization tests in apps/api/test/unit/link-ownership.test.ts
- [X] T066 [P] [US3] Add link list, update, delete, and QR API tests in apps/api/test/api/links-management.test.ts
- [X] T067 [P] [US3] Add dashboard link table smoke tests in apps/web/src/features/dashboard/LinkTable.test.tsx

### Implementation for User Story 3

- [X] T068 [US3] Extend Link repository with owned list, search, filter, sort, pagination, update, and soft delete methods in apps/api/src/repositories/link.repository.ts
- [X] T069 [US3] Extend Link service with ownership checks and management actions in apps/api/src/services/link.service.ts
- [X] T070 [US3] Add link management validators in apps/api/src/validators/link.validators.ts
- [X] T071 [US3] Add link management controller actions in apps/api/src/controllers/link.controller.ts
- [X] T072 [US3] Add GET /api/links, PATCH /api/links/:shortCode, DELETE /api/links/:shortCode, and GET /api/links/:shortCode/qr routes in apps/api/src/routes/link.routes.ts
- [X] T073 [P] [US3] Implement QR generation service in apps/api/src/services/qr-code.service.ts
- [X] T074 [US3] Create dashboard page shell in apps/web/src/pages/DashboardPage.tsx
- [X] T075 [P] [US3] Create dashboard stats and link table components in apps/web/src/features/dashboard/LinkTable.tsx
- [X] T076 [P] [US3] Create search, filter, sort, and pagination controls in apps/web/src/features/dashboard/LinkFilters.tsx
- [X] T077 [P] [US3] Create edit link dialog in apps/web/src/features/links/EditLinkDialog.tsx
- [X] T078 [P] [US3] Create QR code display/download component in apps/web/src/features/links/QRCodePanel.tsx
- [X] T079 [US3] Add dashboard and link management API functions in apps/web/src/features/dashboard/dashboardApi.ts

**Checkpoint**: Signed-in users can manage owned links without seeing other users' resources.

---

## Phase 6: User Story 4 - View Actionable Analytics (Priority: P2)

**Goal**: Link owners can view total clicks, unique visitors, daily history, referrers, browser, operating system, device type, country, and timestamps using interactive charts.

**Independent Test**: Generate visits with varied metadata, open analytics for the owned link, and verify totals, breakdowns, empty states, date range behavior, and ownership denial.

### Tests for User Story 4

- [X] T080 [P] [US4] Add analytics aggregation unit tests in apps/api/test/unit/analytics.service.test.ts
- [X] T081 [P] [US4] Add analytics API tests for ownership, empty state, date ranges, and grouped metrics in apps/api/test/api/analytics.test.ts
- [X] T082 [P] [US4] Add analytics page smoke tests in apps/web/src/features/analytics/AnalyticsCharts.test.tsx

### Implementation for User Story 4

- [X] T083 [US4] Implement ClickEvent repository create and aggregate methods in apps/api/src/repositories/click-event.repository.ts
- [X] T084 [US4] Implement user-agent, referrer, visitor hash, and country metadata extraction in apps/api/src/services/click-event.service.ts
- [X] T085 [US4] Implement analytics aggregation service in apps/api/src/services/analytics.service.ts
- [X] T086 [US4] Add analytics validators for short code and date range in apps/api/src/validators/analytics.validators.ts
- [X] T087 [US4] Implement analytics controller in apps/api/src/controllers/analytics.controller.ts
- [X] T088 [US4] Implement GET /api/links/:shortCode/analytics route in apps/api/src/routes/analytics.routes.ts
- [X] T089 [US4] Wire analytics routes into API router in apps/api/src/routes/index.ts
- [X] T090 [US4] Create link details page in apps/web/src/pages/LinkDetailsPage.tsx
- [X] T091 [P] [US4] Create analytics chart components using Recharts in apps/web/src/features/analytics/AnalyticsCharts.tsx
- [X] T092 [P] [US4] Create analytics summary cards and empty states in apps/web/src/features/analytics/AnalyticsSummary.tsx
- [X] T093 [P] [US4] Create analytics date range controls in apps/web/src/features/analytics/DateRangePicker.tsx
- [X] T094 [US4] Add analytics API functions in apps/web/src/features/analytics/analyticsApi.ts

**Checkpoint**: Link owners can inspect useful analytics for each owned link.

---

## Phase 7: User Story 5 - Authenticate and Maintain an Account (Priority: P2)

**Goal**: Users can register, log in, refresh access, log out, access protected pages, and view account settings.

**Independent Test**: Register, log in, access protected resources, refresh a session, log out, and confirm protected routes reject unauthenticated access.

### Tests for User Story 5

- [X] T095 [P] [US5] Add password hashing and token service unit tests in apps/api/test/unit/auth.service.test.ts
- [X] T096 [P] [US5] Add register, login, refresh, logout, and profile API tests in apps/api/test/api/auth.test.ts
- [X] T097 [P] [US5] Add frontend auth form smoke tests in apps/web/src/features/auth/AuthForms.test.tsx

### Implementation for User Story 5

- [X] T098 [P] [US5] Implement User repository in apps/api/src/repositories/user.repository.ts
- [X] T099 [P] [US5] Implement RefreshSession repository in apps/api/src/repositories/refresh-session.repository.ts
- [X] T100 [US5] Implement password hashing, access token, refresh token, revocation, and reuse checks in apps/api/src/services/auth.service.ts
- [X] T101 [US5] Implement authentication middleware in apps/api/src/middleware/auth.ts
- [X] T102 [US5] Implement auth validators in apps/api/src/validators/auth.validators.ts
- [X] T103 [US5] Implement auth controller in apps/api/src/controllers/auth.controller.ts
- [X] T104 [US5] Implement auth routes for register, login, refresh, and logout in apps/api/src/routes/auth.routes.ts
- [X] T105 [US5] Implement profile controller and route in apps/api/src/controllers/profile.controller.ts and apps/api/src/routes/profile.routes.ts
- [X] T106 [US5] Wire auth and profile routes into API router in apps/api/src/routes/index.ts
- [X] T107 [US5] Create auth context and protected route wrapper in apps/web/src/features/auth/AuthProvider.tsx
- [X] T108 [P] [US5] Create login page and form in apps/web/src/pages/LoginPage.tsx
- [X] T109 [P] [US5] Create register page and form in apps/web/src/pages/RegisterPage.tsx
- [X] T110 [P] [US5] Create account settings page in apps/web/src/pages/AccountSettingsPage.tsx
- [X] T111 [US5] Add auth API functions and token persistence in apps/web/src/features/auth/authApi.ts

**Checkpoint**: Authenticated account flows protect private dashboard and analytics resources.

---

## Phase 8: User Story 6 - Operate as a Production-Ready Portfolio Product (Priority: P3)

**Goal**: A reviewer can run, test, inspect, and deploy LinkPulse with professional documentation, CI, Docker, and quality gates.

**Independent Test**: Follow the setup guide on a fresh environment, run tests/builds, start Docker Compose, and inspect architecture/API/database/deployment docs.

### Tests for User Story 6

- [X] T112 [P] [US6] Add Docker Compose smoke test script in scripts/smoke/docker-compose-smoke.ps1
- [X] T113 [P] [US6] Add API health and readiness integration tests in apps/api/test/integration/health-readiness.test.ts
- [X] T114 [P] [US6] Add CI workflow validation steps in .github/workflows/ci.yml

### Implementation for User Story 6

- [X] T115 [US6] Add GitHub Actions workflow for install, lint, tests, build, and Docker verification in .github/workflows/ci.yml
- [X] T116 [US6] Update README with product overview, screenshots placeholders, setup, commands, testing, Docker, and deployment links in README.md
- [X] T117 [P] [US6] Create architecture documentation and diagram source in docs/architecture.md
- [X] T118 [P] [US6] Create API documentation from the OpenAPI contract in docs/api.md
- [X] T119 [P] [US6] Create database schema documentation in docs/database.md
- [X] T120 [P] [US6] Create environment variable guide in docs/environment.md
- [X] T121 [P] [US6] Create deployment instructions with live demo URL placeholders in docs/deployment.md
- [X] T122 [US6] Update API_DOCUMENTATION.md to reference docs/api.md and specs/001-linkpulse-url-shortener/contracts/openapi.yaml
- [X] T123 [US6] Update SYSTEM_DESIGN.md to align with docs/architecture.md and the TypeScript layered architecture
- [X] T124 [US6] Add production-ready health/readiness dependency checks in apps/api/src/controllers/health.controller.ts

**Checkpoint**: The repository is understandable and runnable as a portfolio project.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, security, performance, and verification work across all stories.

- [X] T125 [P] Harden URL validation against localhost, private networks, credentials in URLs, and unsafe redirects in apps/api/src/utils/url-validator.ts
- [X] T126 [P] Add security regression tests for XSS-like inputs, SQL-injection-like inputs, CSRF-relevant requests, and rate limits in apps/api/test/api/security.test.ts
- [X] T127 Improve redirect latency by verifying cache hit path and adding cache invalidation tests in apps/api/test/integration/redirect-cache.test.ts
- [X] T128 Add database seed script for demo links and analytics in prisma/seed.ts
- [X] T129 Add frontend responsive layout checks and mobile dashboard refinements in apps/web/src/styles/global.css
- [X] T130 Add loading, error, and empty states across frontend pages in apps/web/src/components/
- [X] T131 Run lint and fix issues across package.json workspaces with npm run lint
- [X] T132 Run backend and frontend builds and fix issues with npm run build
- [X] T133 Run automated tests and coverage, then close gaps until backend behavior coverage reaches at least 80% with npm run test
- [X] T134 Run Docker Compose validation and update quickstart findings in specs/001-linkpulse-url-shortener/quickstart.md
- [X] T135 Review OpenAPI contract against implemented routes and update specs/001-linkpulse-url-shortener/contracts/openapi.yaml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **US1 (Phase 3)**: Depends on Foundational; MVP public short-link creation.
- **US2 (Phase 4)**: Depends on Foundational and is most useful after US1 creates links.
- **US3 (Phase 5)**: Depends on Foundational and US5 authentication for real protected access, but repository/service work can begin after Foundational.
- **US4 (Phase 6)**: Depends on US2 click recording and US5 ownership checks for complete validation.
- **US5 (Phase 7)**: Depends on Foundational; should be implemented before protected dashboard and analytics are finalized.
- **US6 (Phase 8)**: Depends on enough implementation to document and verify; CI/docs can start after Setup.
- **Polish (Phase 9)**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2; no dependency on other stories.
- **User Story 2 (P1)**: Can start after Phase 2; integrates with links from US1.
- **User Story 5 (P2)**: Can start after Phase 2; enables ownership for US3 and US4.
- **User Story 3 (P2)**: Depends on US5 for protected dashboard behavior.
- **User Story 4 (P2)**: Depends on US2 for click events and US5 for protected analytics.
- **User Story 6 (P3)**: Can progress in parallel, with final validation after implementation.

### Within Each User Story

- Tests first and should fail before implementation.
- Repository methods before services.
- Services before controllers.
- Controllers before routes.
- API routes before frontend API calls.
- Frontend API calls before pages/components that depend on them.

---

## Parallel Opportunities

- Setup tasks T002, T003, T004, T007, T008 can run in parallel.
- Foundational helpers T018 through T021 can run in parallel.
- Foundational frontend shell tasks T035 through T037 can run in parallel.
- Test tasks at the start of each user story can run in parallel.
- Within frontend-heavy stories, independent components can be built in parallel after their API functions are defined.
- Documentation tasks T117 through T121 can run in parallel.

## Parallel Example: User Story 1

```text
Task: "T038 [US1] Add URL validation unit tests in apps/api/test/unit/url-validator.test.ts"
Task: "T039 [US1] Add short-code generation unit tests in apps/api/test/unit/short-code.test.ts"
Task: "T040 [US1] Add create-link API tests for generated codes, aliases, expiration, conflicts, and invalid URLs in apps/api/test/api/links-create.test.ts"
Task: "T041 [US1] Add frontend link creation smoke tests in apps/web/src/features/links/CreateLinkForm.test.tsx"
```

## Parallel Example: User Story 4

```text
Task: "T091 [US4] Create analytics chart components using Recharts in apps/web/src/features/analytics/AnalyticsCharts.tsx"
Task: "T092 [US4] Create analytics summary cards and empty states in apps/web/src/features/analytics/AnalyticsSummary.tsx"
Task: "T093 [US4] Create analytics date range controls in apps/web/src/features/analytics/DateRangePicker.tsx"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Complete Phase 4 (US2).
4. Validate a public user can create a short link and a visitor can redirect through it.

### Production Portfolio Increment

1. Add Phase 7 (US5) authentication.
2. Add Phase 5 (US3) dashboard management.
3. Add Phase 6 (US4) analytics.
4. Add Phase 8 (US6) CI, Docker, and documentation.
5. Finish Phase 9 polish, security, coverage, and quickstart validation.

### Notes

- Keep tasks scoped; do not merge unrelated refactors into story tasks.
- Preserve the existing monorepo shape unless a task explicitly changes it.
- Each completed story must remain independently demonstrable through the quickstart scenarios.
