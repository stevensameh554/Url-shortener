import type { Request, Response } from "express";
import { getLinkAnalytics } from "../services/analytics.service.js";
import { ok } from "../utils/responses.js";

export async function analytics(req: Request, res: Response) {
  const query = (req.validated as any).query;
  const range: { start?: Date; end?: Date } = {};
  if (query.start) range.start = new Date(query.start);
  if (query.end) range.end = new Date(query.end);
  return ok(res, await getLinkAnalytics((req.validated as any).params.shortCode, req.user!.sub, range));
}
