import type { Request } from "express";
import { incrementClickCount, findLinkByCode } from "../repositories/link.repository.js";
import { HttpError } from "../utils/http-error.js";
import { cacheRedirect, getCachedRedirect, invalidateRedirect } from "./redirect-cache.service.js";
import { recordClickEvent } from "./click-event.service.js";

export async function resolveRedirect(shortCode: string, req: Request) {
  const cached = await getCachedRedirect(shortCode);
  const link = cached ?? (await findLinkByCode(shortCode));
  if (!link || link.status === "deleted") throw new HttpError(404, "Link not found");
  if (link.status === "disabled") throw new HttpError(410, "Link is disabled");
  if (link.expiresAt && new Date(link.expiresAt) <= new Date()) {
    await invalidateRedirect(shortCode);
    throw new HttpError(410, "Link has expired");
  }
  if (!cached) await cacheRedirect(link);
  void incrementClickCount(link.id).catch(() => undefined);
  recordClickEvent(link.id, req);
  return link.originalUrl;
}
