import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/auth.service.js";
import { HttpError } from "../utils/http-error.js";

function bearer(req: Request) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = bearer(req);
  if (!token) return next();
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next();
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = bearer(req);
  if (!token) return next(new HttpError(401, "Authentication required"));
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
