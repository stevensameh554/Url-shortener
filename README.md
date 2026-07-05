# LinkPulse

Production-style URL shortening platform with authentication, link management, fast redirects, Redis caching, click analytics, Docker, CI, and a React TypeScript dashboard.

## Features

- Public and authenticated short-link creation with generated codes, custom aliases, expiration dates, and URL safety checks.
- Low-latency redirect endpoint with Redis cache reads, PostgreSQL fallback, proper 404/410 behavior, and non-blocking analytics capture.
- JWT access tokens, revocable hashed refresh sessions, bcrypt password storage, protected profile/dashboard routes, and ownership checks.
- Link dashboard with search-ready API, status management, QR code generation, copy actions, and pagination-ready responses.
- Per-link analytics for total clicks, unique visitors, daily history, browser, OS, device, referrer, country, and recent timestamps.
- Security controls: Helmet, CORS allow-list, Zod validation, rate limiting, safe URL validation, SQL injection protection through Prisma.
- Reviewer-facing docs for API, architecture, database schema, environment variables, deployment, Docker, and CI.

## Tech Stack

- Backend: Node.js 22, Express, TypeScript, Prisma, PostgreSQL, Redis.
- Frontend: React, TypeScript, Vite, Recharts, lucide-react.
- Testing: Vitest, Supertest, coverage thresholds.
- Operations: Docker Compose and GitHub Actions.

## Quick Start

```bash
npm install
copy .env.example apps\api\.env
docker compose up -d postgres redis
npm run db:generate
npm run db:migrate
npm run dev
```

API: `http://localhost:4000`

Web: `http://localhost:5173`

## Useful Commands

```bash
npm run dev
npm run build
npm run test
npm run test:coverage
npm run db:studio
docker compose up --build
```

## API Examples

```bash
curl -X POST http://localhost:4000/api/links ^
  -H "Content-Type: application/json" ^
  -d "{\"originalUrl\":\"https://example.com/very/long/path\",\"customAlias\":\"demo\"}"
```

```bash
curl http://localhost:4000/api/links/demo
```

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Database](docs/database.md)
- [Environment](docs/environment.md)
- [Deployment](docs/deployment.md)
- [OpenAPI contract](specs/001-linkpulse-url-shortener/contracts/openapi.yaml)
