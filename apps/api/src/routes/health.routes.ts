import { Router } from "express";
import { health, readiness } from "../controllers/health.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const healthRoutes = Router();
healthRoutes.get("/health", asyncHandler(health));
healthRoutes.get("/ready", asyncHandler(readiness));
