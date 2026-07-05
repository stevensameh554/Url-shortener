# API Documentation

Base URL: `http://localhost:4000`

## Auth

### Register

`POST /api/auth/register`

```json
{
  "name": "Steve",
  "email": "steve@example.com",
  "password": "StrongPass123!"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "steve@example.com",
  "password": "StrongPass123!"
}
```

### Refresh

`POST /api/auth/refresh`

```json
{
  "refreshToken": "token"
}
```

### Logout

`POST /api/auth/logout`

## Links

### Create Short Link

`POST /api/shorten`

Authorization is optional. Authenticated users own the created link.

```json
{
  "originalUrl": "https://example.com/a/long/url",
  "customAlias": "launch",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

### Redirect

`GET /:shortCode`

Returns an HTTP redirect to the original URL.

### Link Details

`GET /api/links/:shortCode`

### Delete Link

`DELETE /api/links/:shortCode`

Requires ownership when the link belongs to a user.

## Analytics

### Per-Link Analytics

`GET /api/links/:shortCode/analytics`

Returns total clicks, clicks by day, devices, browsers, countries, referrers, and unique visitor count.

### Dashboard Stats

`GET /api/dashboard/stats`

Requires authentication.
