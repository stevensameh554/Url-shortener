# System Design

## Architecture

```text
Browser
  |
  | GET /abc123
  v
Express API
  |
  | check Redis link:abc123
  | hit -> record click async -> 302
  | miss
  v
PostgreSQL via Prisma
  |
  | active link found
  v
Redis cache write -> record click -> 302
```

## Data Model

- `users`: identity and password hash
- `links`: original URL, short code, alias, click count, expiration, owner
- `click_events`: analytics events for referrer, device, user agent, IP hash, country, and click time
- `refresh_tokens`: hashed refresh tokens with revocation support

## Redirect Strategy

Redis stores active links by short code with a TTL derived from `expires_at`. Redirects avoid PostgreSQL when cached. The database remains the source of truth.

## Analytics Strategy

Every redirect writes a `click_events` row and increments the link click counter. The analytics endpoint groups events by day, device, browser, country, and referrer.

## Security

- Helmet security headers
- CORS allow-list from `WEB_ORIGIN`
- Zod validation on request bodies and params
- Bcrypt password hashing
- JWT access tokens and hashed refresh token storage
- Rate limiting for API and redirect paths
- URL protocol validation for `http` and `https`
