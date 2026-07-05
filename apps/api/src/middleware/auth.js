import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { HttpError } from "../utils/http-error.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_TTL
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_TTL
  });
}

export function optionalAuth(req, _res, next) {
  const header = req.get("authorization");
  if (!header?.startsWith("Bearer ")) return next();

  try {
    req.user = jwt.verify(header.slice(7), config.JWT_ACCESS_SECRET);
  } catch {
    req.user = null;
  }
  next();
}

export function requireAuth(req, _res, next) {
  const header = req.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication required");
  }

  try {
    req.user = jwt.verify(header.slice(7), config.JWT_ACCESS_SECRET);
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
}
