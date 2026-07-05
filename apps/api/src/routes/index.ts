import { Router } from "express";
import { analyticsRoutes } from "./analytics.routes.js";
import { authRoutes } from "./auth.routes.js";
import { healthRoutes } from "./health.routes.js";
import { linkRoutes } from "./link.routes.js";
import { profileRoutes } from "./profile.routes.js";

export const apiRoutes = Router();
apiRoutes.use(healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use(linkRoutes);
apiRoutes.use(profileRoutes);
apiRoutes.use(analyticsRoutes);
