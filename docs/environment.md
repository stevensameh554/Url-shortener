# Environment Variables

Copy `.env.example` to `apps/api/.env` for local API development.

- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_URL`: Redis connection string.
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: long random secrets.
- `APP_BASE_URL`: public short-link base URL.
- `WEB_ORIGIN`: comma-separated allowed CORS origins.
- `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL_DAYS`: session lifetime settings.
- `BCRYPT_ROUNDS`: password hashing cost.
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`: API rate limit.
- `VITE_API_BASE_URL`: frontend API target.
