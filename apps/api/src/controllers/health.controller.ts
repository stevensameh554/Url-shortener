import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { redis } from "../db/redis.js";

export async function health(_req: Request, res: Response) {
  res.json({ status: "ok" });
}

export async function readiness(_req: Request, res: Response) {
  const checks: Record<string, string> = {};
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.postgres = "ok";
  } catch {
    checks.postgres = "down";
  }
  checks.redis = !redis || redis.status === "ready" ? "ok" : "down";
  const ready = Object.values(checks).every((value) => value === "ok");
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "degraded", checks });
}
