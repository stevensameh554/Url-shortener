import { Router } from "express";
import { redirect } from "../controllers/redirect.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const redirectRoutes = Router();
redirectRoutes.get("/:shortCode([a-zA-Z0-9_-]{3,64})", asyncHandler(redirect));
