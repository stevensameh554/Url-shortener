import type { JwtPayload } from "../services/auth.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      requestId?: string;
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};
