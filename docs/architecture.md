# LinkPulse Architecture

LinkPulse is a TypeScript monorepo with an Express API, React/Vite web app, PostgreSQL database, and Redis redirect cache.

```text
Browser -> React Web -> REST API -> Controllers -> Services -> Repositories -> PostgreSQL
                                      |
                                      +-> Redis redirect cache
```

The API keeps HTTP concerns in routes/controllers, business rules in services, persistence in repositories, and shared cross-cutting behavior in middleware/utilities.
