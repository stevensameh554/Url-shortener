import type { Request, Response } from "express";
import { resolveRedirect } from "../services/redirect.service.js";

export async function redirect(req: Request, res: Response) {
  const destination = await resolveRedirect(String(req.params.shortCode), req);
  res.redirect(302, destination);
}
