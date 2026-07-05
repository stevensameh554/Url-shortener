# Deployment

Deploy the API, web app, PostgreSQL, and Redis together. Docker Compose is the reference deployment artifact for this portfolio project.

1. Set production secrets and database URLs.
2. Build images with `docker compose build`.
3. Apply migrations with `npm run db:deploy` or a one-off API container command.
4. Start the stack with `docker compose up -d`.
5. Verify `GET /api/health` and `GET /api/ready`.

Live demo placeholders:

- Frontend: `https://your-linkpulse-web.example`
- Backend: `https://your-linkpulse-api.example`
