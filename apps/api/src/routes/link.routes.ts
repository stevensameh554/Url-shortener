import { Router } from "express";
import { create, detail, list, patch, qr, remove } from "../controllers/link.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { codeParamSchema, createLinkSchema, listLinksSchema, updateLinkSchema } from "../validators/link.validators.js";

export const linkRoutes = Router();
linkRoutes.post("/links", optionalAuth, validate(createLinkSchema), asyncHandler(create));
linkRoutes.post("/shorten", optionalAuth, validate(createLinkSchema), asyncHandler(create));
linkRoutes.get("/links", requireAuth, validate(listLinksSchema), asyncHandler(list));
linkRoutes.get("/links/:shortCode", validate(codeParamSchema), asyncHandler(detail));
linkRoutes.patch("/links/:shortCode", requireAuth, validate(updateLinkSchema), asyncHandler(patch));
linkRoutes.delete("/links/:shortCode", requireAuth, validate(codeParamSchema), asyncHandler(remove));
linkRoutes.get("/links/:shortCode/qr", requireAuth, validate(codeParamSchema), asyncHandler(qr));
