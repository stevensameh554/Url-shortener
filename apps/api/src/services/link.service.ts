import type { LinkStatus } from "@prisma/client";
import { env } from "../config/env.js";
import { cacheRedirect, invalidateRedirect } from "./redirect-cache.service.js";
import { createLink, findAliasOrCode, findLinkByCode, listOwnedLinks, updateOwnedLink } from "../repositories/link.repository.js";
import { HttpError } from "../utils/http-error.js";
import { generateShortCode, isValidAlias } from "../utils/short-code.js";
import { validatePublicUrl } from "../utils/url-validator.js";

export function toLinkDto(link: any) {
  return {
    id: link.id,
    originalUrl: link.originalUrl,
    shortCode: link.shortCode,
    customAlias: link.customAlias,
    status: link.status,
    shortUrl: `${env.APP_BASE_URL}/${link.shortCode}`,
    clickCount: link.clickCount,
    expiresAt: link.expiresAt,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt
  };
}

export async function createShortLink(input: { originalUrl: string; customAlias?: string; expiresAt?: string; userId?: string }) {
  const originalUrl = await validatePublicUrl(input.originalUrl);
  if (input.customAlias && !isValidAlias(input.customAlias)) throw new HttpError(400, "Custom alias must be 3-32 letters, numbers, underscores, or hyphens");
  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : undefined;
  if (expiresAt && expiresAt <= new Date()) throw new HttpError(400, "Expiration must be in the future");
  let shortCode = input.customAlias ?? generateShortCode();
  for (let attempts = 0; attempts < 5; attempts += 1) {
    if (!(await findAliasOrCode(shortCode))) break;
    if (input.customAlias) throw new HttpError(409, "Custom alias is already in use");
    shortCode = generateShortCode();
  }
  const createData: Parameters<typeof createLink>[0] = { originalUrl, shortCode };
  if (input.userId) createData.userId = input.userId;
  if (input.customAlias) createData.customAlias = input.customAlias;
  if (expiresAt) createData.expiresAt = expiresAt;
  const link = await createLink(createData);
  await cacheRedirect(link);
  return toLinkDto(link);
}

export async function getPublicLink(shortCode: string) {
  const link = await findLinkByCode(shortCode);
  if (!link || link.status === "deleted") throw new HttpError(404, "Link not found");
  return toLinkDto(link);
}

export async function listLinks(userId: string, query: { search?: string; status?: LinkStatus; sort?: any; direction?: any; page?: number; pageSize?: number }) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
  const options: Parameters<typeof listOwnedLinks>[0] = { userId, page, pageSize };
  if (query.search) options.search = query.search;
  if (query.status) options.status = query.status;
  if (query.sort) options.sort = query.sort;
  if (query.direction) options.direction = query.direction;
  const [total, links] = await listOwnedLinks(options);
  return { items: links.map(toLinkDto), page, pageSize, total };
}

export async function updateLink(shortCode: string, userId: string, input: { originalUrl?: string; customAlias?: string | null; status?: LinkStatus; expiresAt?: string | null }) {
  const link = await findLinkByCode(shortCode);
  if (!link || link.userId !== userId || link.status === "deleted") throw new HttpError(404, "Link not found");
  if (input.customAlias && input.customAlias !== link.customAlias) {
    if (!isValidAlias(input.customAlias)) throw new HttpError(400, "Invalid custom alias");
    if (await findAliasOrCode(input.customAlias)) throw new HttpError(409, "Custom alias is already in use");
  }
  const data: any = {};
  if (input.originalUrl) data.originalUrl = await validatePublicUrl(input.originalUrl);
  if (input.customAlias !== undefined) data.customAlias = input.customAlias;
  if (input.status) data.status = input.status;
  if (input.expiresAt !== undefined) data.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
  const updated = await updateOwnedLink(link.id, data);
  await invalidateRedirect(link.shortCode);
  if (updated.status === "active") await cacheRedirect(updated);
  return toLinkDto(updated);
}

export async function deleteLink(shortCode: string, userId: string) {
  const link = await findLinkByCode(shortCode);
  if (!link || link.userId !== userId || link.status === "deleted") throw new HttpError(404, "Link not found");
  await updateOwnedLink(link.id, { status: "deleted", deletedAt: new Date() });
  await invalidateRedirect(shortCode);
}
