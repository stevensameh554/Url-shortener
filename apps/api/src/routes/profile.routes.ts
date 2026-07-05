import { Router } from "express";
import { profile } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const profileRoutes = Router();
profileRoutes.get("/profile", requireAuth, asyncHandler(profile));
