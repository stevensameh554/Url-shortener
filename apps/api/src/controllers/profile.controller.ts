import type { Request, Response } from "express";
import { getProfile } from "../services/auth.service.js";
import { ok } from "../utils/responses.js";

export async function profile(req: Request, res: Response) {
  return ok(res, await getProfile(req.user!.sub));
}
