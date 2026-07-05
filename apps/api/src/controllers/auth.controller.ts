import type { Request, Response } from "express";
import { created, noContent, ok } from "../utils/responses.js";
import * as authService from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  return created(res, await authService.register((req.validated as any).body));
}

export async function login(req: Request, res: Response) {
  return ok(res, await authService.login((req.validated as any).body));
}

export async function refresh(req: Request, res: Response) {
  return ok(res, await authService.refresh((req.validated as any).body.refreshToken));
}

export async function logout(req: Request, res: Response) {
  await authService.logout((req.validated as any).body.refreshToken);
  return noContent(res);
}
