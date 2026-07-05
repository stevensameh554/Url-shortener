# LinkPulse

LinkPulse is a production-style URL shortening platform built as a full-stack engineering portfolio project. It combines authenticated link management, low-latency redirects, Redis caching, detailed click analytics, PostgreSQL persistence, Dockerized infrastructure, automated tests, and deployment-ready documentation.

The goal is to demonstrate backend engineering fundamentals in a realistic SaaS product rather than a tutorial-sized CRUD app.

## What It Does

- Shortens public HTTP/HTTPS URLs into unique short links.
- Supports generated short codes and custom aliases.
- Redirects visitors quickly through a cache-aware redirect service.
- Tracks click analytics without blocking the redirect path.
- Lets authenticated users manage their links from a React dashboard.
- Shows per-link analytics, QR codes, status controls, search, filtering, and sorting.
- Protects private link management and analytics with JWT authentication.
- Runs locally with PostgreSQL, Redis, API, and web containers using Docker Compose.

## Core Features

### Authentication

- User registration and sign in
- JWT access tokens
- Revocable hashed refresh sessions
- bcrypt password hashing
- Protected profile, dashboard, management, QR, and analytics routes

### Link Management

- Create short links
- Custom aliases
- Expiration dates
- Enable and disable links
- Soft delete links
- Search, filter, sort, and paginate owned links
- Generate QR codes for short links

### Redirect Service

- Public `GET /{shortCode}` redirect endpoint
- Redis cache lookup for hot redirects
- PostgreSQL fallback on cache miss
- Correct `302`, `404`, and `410` behavior
- Non-blocking click-event recording

### Analytics

LinkPulse records:

- Total clicks
- Unique visitors
- Daily click history
- Browser
- Operating system
- Device type
- Referrer
- Country when provided by infrastructure headers
- Timestamped click events

### Security

- Zod request validation
- Safe public URL validation
- Localhost/private network URL blocking
- Helmet security headers
- CORS allow-list
- Rate limiting
- Prisma-based SQL injection protection
- Hashed passwords and hashed refresh token storage
- Ownership checks for private resources

## Technology Stack

### Backend

- Node.js 22
- TypeScript strict mode
- Express
- Prisma ORM
- PostgreSQL
- Redis
- Zod
- bcryptjs
- JSON Web Tokens
- Helmet, CORS, express-rate-limit
- Vitest and Supertest

### Frontend

- React
- TypeScript
- Vite
- Recharts
- lucide-react
- Responsive CSS

### Infrastructure

- Docker
- Docker Compose
- GitHub Actions CI workflow
- Prisma migrations
- OpenAPI contract

## Architecture

The backend uses a layered architecture:

```text
HTTP Routes
  -> Controllers
    -> Services
      -> Repositories
        -> Prisma / PostgreSQL

Redirect Service
  -> Redis cache
  -> PostgreSQL fallback
  -> async click analytics
```

Business logic lives in services, persistence lives in repositories, and route handlers only handle HTTP wiring.

## Project Structure

```text
apps/
  api/
    src/
      config/
      controllers/
      db/
      middleware/
      repositories/
      routes/
      services/
      types/
      utils/
      validators/
    test/
    Dockerfile
  web/
    src/
      features/
      lib/
      pages/
      styles/
      types/
    Dockerfile
docs/
  api.md
  architecture.md
  database.md
  deployment.md
  environment.md
  openapi.yaml
prisma/
  migrations/
  schema.prisma
  seed.ts
scripts/
  smoke/
docker-compose.yml
```

## Development Phases

1. Planning and architecture
   - Defined the SaaS scope, core entities, API surface, security requirements, and Docker-first local workflow.

2. TypeScript monorepo migration
   - Migrated the initial JavaScript scaffold into strict TypeScript workspaces for the API and web apps.

3. Backend foundation
   - Added environment validation, Prisma client, Redis helpers, structured errors, security middleware, request validation, and health/readiness checks.

4. URL shortener MVP
   - Implemented URL safety validation, short-code generation, link creation, public link details, and redirect behavior.

5. Authentication and ownership
   - Added registration, sign in, access tokens, refresh sessions, protected routes, profile access, and per-user ownership rules.

6. Management dashboard
   - Added owned link listing, update, disable, delete, QR generation, search/filter/sort APIs, and React dashboard components.

7. Analytics
   - Added click-event recording, visitor hashing, user-agent metadata, aggregation services, and frontend chart components.

8. Production hardening
   - Added Docker Compose, migrations on container startup, CI workflow, API docs, architecture docs, database docs, environment guide, and deployment notes.

9. Test coverage and validation
   - Added unit, integration, API, and frontend smoke tests.
   - Backend coverage is above the 80% target.
   - Verified Docker Compose end-to-end with PostgreSQL, Redis, API, and web containers.

## Getting Started

### Prerequisites

- Node.js 22
- npm
- Docker Desktop

### Local setup

```powershell
npm install
Copy-Item .env.example apps\api\.env
docker compose up -d postgres redis
npm run db:generate
npm run db:migrate
npm run dev
```

Local URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:4000`
- Prisma Studio: `http://localhost:5555`

### Docker setup

```powershell
docker compose up -d --build
```

Docker services:

- Web: `http://localhost:5173`
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

The API container runs Prisma migrations before starting.

## Useful Commands

```powershell
npm run lint
npm run test
npm run build
npm --workspace apps/api run test:coverage
npm run db:studio
docker compose ps
docker compose logs api
```

## API Examples

Create a short link:

```powershell
$body = @{ originalUrl = "https://www.wikipedia.org" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/links -ContentType "application/json" -Body $body
```

Check health:

```powershell
Invoke-RestMethod http://localhost:4000/api/health
Invoke-RestMethod http://localhost:4000/api/ready
```

## Quality Gates

Current validation commands:

```powershell
npm run lint
npm run test
npm run build
npm --workspace apps/api run test:coverage
docker compose up -d --build
```

Backend coverage from the latest coverage run:

- Statements and lines: 92.16%
- Functions: 90.47%
- Branches: 84.4%

## Documentation

- [Architecture](docs/architecture.md)
- [API Guide](docs/api.md)
- [OpenAPI Contract](docs/openapi.yaml)
- [Database Schema](docs/database.md)
- [Environment Variables](docs/environment.md)
- [Deployment Guide](docs/deployment.md)
