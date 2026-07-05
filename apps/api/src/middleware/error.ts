import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { isHttpError } from "../utils/http-error.js";
import { logger } from "../utils/logger.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next({ statusCode: 404, message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (isHttpError(error)) {
    res.status(error.statusCode).json({ error: { message: error.message, details: error.details } });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({ error: { message: "Unique constraint conflict" } });
    return;
  }

  const statusCode = typeof (error as any)?.statusCode === "number" ? (error as any).statusCode : 500;
  const message = typeof (error as any)?.message === "string" ? (error as any).message : "Internal server error";
  if (statusCode >= 500) logger.error("Unhandled request error", { requestId: req.requestId, error });
  res.status(statusCode).json({ error: { message: statusCode >= 500 ? "Internal server error" : message } });
}
