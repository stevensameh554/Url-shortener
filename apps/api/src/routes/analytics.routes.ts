import { Router } from "express";
import { analytics } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { analyticsSchema } from "../validators/analytics.validators.js";

export const analyticsRoutes = Router();
analyticsRoutes.get("/links/:shortCode/analytics", requireAuth, validate(analyticsSchema), asyncHandler(analytics));
