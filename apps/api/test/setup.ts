process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://linkpulse:linkpulse@localhost:5432/linkpulse_test?schema=public";
process.env.JWT_ACCESS_SECRET ??= "test-access-secret-that-is-long-enough";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-that-is-long-enough";
process.env.APP_BASE_URL ??= "http://localhost:4000";
process.env.WEB_ORIGIN ??= "http://localhost:5173";
