# Database Schema

PostgreSQL is managed by Prisma.

- `users`: account identity and bcrypt password hashes.
- `refresh_sessions`: revocable hashed refresh tokens.
- `links`: URL destinations, short codes, aliases, status, expiration, and denormalized click counts.
- `click_events`: per-visit analytics metadata with hashed visitor identifiers.

Indexes cover unique email/code/alias constraints, dashboard filtering/sorting, refresh lookup, and click aggregation dimensions.
