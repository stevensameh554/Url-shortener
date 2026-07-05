import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { loginSchema, refreshSchema, registerSchema } from "../validators/auth.validators.js";

export const authRoutes = Router();
authRoutes.post("/register", validate(registerSchema), asyncHandler(register));
authRoutes.post("/login", validate(loginSchema), asyncHandler(login));
authRoutes.post("/refresh", validate(refreshSchema), asyncHandler(refresh));
authRoutes.post("/logout", validate(refreshSchema), asyncHandler(logout));
