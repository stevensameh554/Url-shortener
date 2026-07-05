import express from "express";
import { connectRedis } from "./db/redis.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { requestContext } from "./middleware/request-context.js";
import { applySecurity } from "./middleware/security.js";
import { apiRoutes } from "./routes/index.js";
import { redirectRoutes } from "./routes/redirect.routes.js";

export function createApp() {
  const app = express();
  applySecurity(app);
  app.use(requestContext);
  app.use("/api", apiRoutes);
  app.use(redirectRoutes);
  app.use(notFound);
  app.use(errorHandler);
  void connectRedis();
  return app;
}
