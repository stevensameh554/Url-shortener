# LinkPulse

URL shortener with analytics, authentication, Redis-backed redirects, PostgreSQL, Prisma, Docker, and a React dashboard.

## Features

- Create short links with generated codes or custom aliases
- Redirect short links to their original URLs
- Expiration dates and duplicate-alias prevention
- JWT auth with refresh tokens
- Per-link analytics, click events, referrers, browser/device, country field, and unique visitor estimates
- Rate limiting, Helmet headers, CORS, and Zod input validation
- Redis cache path for fast redirects
- Docker Compose for PostgreSQL, Redis, API, and web

## Tech Stack

- Backend: Node.js, Express, Prisma, PostgreSQL, Redis
- Frontend: React, Vite, Recharts, plain CSS
- Testing: Vitest, Supertest
- Deployment-ready docs: API docs and system design notes

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
npm run db:studio
docker compose up --build
```

## API Examples

```bash
curl -X POST http://localhost:4000/api/shorten ^
  -H "Content-Type: application/json" ^
  -d "{\"originalUrl\":\"https://example.com/very/long/path\",\"customAlias\":\"demo\"}"
```

```bash
curl http://localhost:4000/api/links/demo
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) and [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).
