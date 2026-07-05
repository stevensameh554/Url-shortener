# Quickstart: LinkPulse URL Shortener Platform

This guide validates the planned feature end to end. Exact commands may be adjusted during implementation, but the final project must preserve the same validation coverage.

## Prerequisites

- Node.js 22 LTS
- npm
- Docker Desktop with Compose
- GitHub Actions-compatible CI environment for remote checks

## Local Setup

1. Install workspace dependencies:

   ```powershell
   npm install
   ```

2. Create local environment files from the documented examples:

   ```powershell
   Copy-Item .env.example apps\api\.env
   ```

3. Start PostgreSQL and Redis for development:

   ```powershell
   docker compose up -d postgres redis
   ```

4. Generate the database client and apply migrations:

   ```powershell
   npm run db:generate
   npm run db:migrate
   ```

5. Start the API and frontend:

   ```powershell
   npm run dev
   ```

Expected local URLs:

- API: `http://localhost:4000`
- Web: `http://localhost:5173`

## Validation Scenarios

### Authentication

1. Register a new user.
2. Log in with the created user.
3. Confirm protected dashboard/profile endpoints reject unauthenticated requests.
4. Refresh the session and confirm access continues.
5. Log out and confirm protected access is denied.

### Link Creation and Redirect

1. Create a short link for a valid public URL.
2. Open the returned short URL.
3. Confirm the response redirects to the original URL.
4. Try a duplicate custom alias and confirm a conflict response.
5. Try malformed, unsupported, local, or private-network URLs and confirm validation rejection.

### Link Management

1. Create at least three owned links.
2. Search, filter, sort, and paginate dashboard results.
3. Edit destination, alias, expiration, and enabled state for owned links.
4. Delete a link and confirm it no longer redirects.
5. Generate and display or download a QR code for an owned link.

### Analytics

1. Visit a short link multiple times with different referrers or user agents.
2. Open the link analytics page.
3. Confirm total clicks, unique visitor estimate, daily history, browser, operating system, device, referrer, country, and timestamp data are visible when available.
4. Confirm empty analytics states render correctly for a new unvisited link.
5. Confirm analytics for another user's link are denied.

### Quality Gates

Run all local checks:

```powershell
npm run lint
npm run test
npm run build
```

Expected outcome:

- Lint passes.
- Backend tests meet at least 80% behavior coverage.
- API and web builds complete.

### Docker Compose

Run the full stack:

```powershell
docker compose up --build
```

Expected outcome:

- PostgreSQL, Redis, API, and frontend containers start.
- API health endpoint reports healthy dependencies.
- Frontend can create, redirect, manage, and analyze links against the containerized API.

Validated on 2026-07-05:

- `docker compose up -d --build` built the API and web images and started PostgreSQL, Redis, API, and web containers.
- `docker compose ps` reported PostgreSQL, Redis, and API as healthy, with the web container running.
- `GET http://localhost:4000/api/health` returned `{"status":"ok"}`.
- `GET http://localhost:4000/api/ready` returned `{"status":"ready","checks":{"postgres":"ok","redis":"ok"}}`.
- `GET http://localhost:5173` returned HTTP `200`.
- `POST http://localhost:4000/api/links` created a short link backed by the containerized PostgreSQL database.
- `GET /{shortCode}` returned HTTP `302` with the original URL in the `Location` header.

Implementation note: the API service runs `npm --workspace apps/api run db:deploy` before `npm --workspace apps/api start`, so migrations are applied during container startup.

### CI/CD

Push a branch or open a pull request.

Expected CI checks:

- Install dependencies.
- Run linting.
- Run tests.
- Build API and web.
- Verify Docker image builds.

## Related Artifacts

- API contract: [contracts/openapi.yaml](./contracts/openapi.yaml)
- Data model: [data-model.md](./data-model.md)
- Implementation plan: [plan.md](./plan.md)
