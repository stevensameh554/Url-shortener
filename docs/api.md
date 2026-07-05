# API Documentation

The formal OpenAPI contract lives at [`docs/openapi.yaml`](openapi.yaml).

Core routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/profile`
- `POST /api/links`
- `GET /api/links`
- `GET /api/links/{shortCode}`
- `PATCH /api/links/{shortCode}`
- `DELETE /api/links/{shortCode}`
- `GET /api/links/{shortCode}/qr`
- `GET /api/links/{shortCode}/analytics`
- `GET /{shortCode}`
- `GET /api/health`
- `GET /api/ready`
