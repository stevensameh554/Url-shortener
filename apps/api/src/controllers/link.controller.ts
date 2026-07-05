import type { Request, Response } from "express";
import { createQrCodeDataUrl } from "../services/qr-code.service.js";
import { createShortLink, deleteLink, getPublicLink, listLinks, toLinkDto, updateLink } from "../services/link.service.js";
import { findLinkByCode } from "../repositories/link.repository.js";
import { HttpError } from "../utils/http-error.js";
import { created, noContent, ok } from "../utils/responses.js";

export async function create(req: Request, res: Response) {
  return created(res, await createShortLink({ ...(req.validated as any).body, userId: req.user?.sub }));
}

export async function detail(req: Request, res: Response) {
  return ok(res, await getPublicLink((req.validated as any).params.shortCode));
}

export async function list(req: Request, res: Response) {
  return ok(res, await listLinks(req.user!.sub, (req.validated as any).query));
}

export async function patch(req: Request, res: Response) {
  return ok(res, await updateLink((req.validated as any).params.shortCode, req.user!.sub, (req.validated as any).body));
}

export async function remove(req: Request, res: Response) {
  await deleteLink((req.validated as any).params.shortCode, req.user!.sub);
  return noContent(res);
}

export async function qr(req: Request, res: Response) {
  const link = await findLinkByCode((req.validated as any).params.shortCode);
  if (!link || link.userId !== req.user!.sub || link.status === "deleted") throw new HttpError(404, "Link not found");
  const dto = toLinkDto(link);
  return ok(res, { shortUrl: dto.shortUrl, dataUrl: await createQrCodeDataUrl(dto.shortUrl) });
}
