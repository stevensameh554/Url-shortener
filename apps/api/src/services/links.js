import crypto from "node:crypto";
import { customAlphabet } from "nanoid";
import { prisma } from "../db.js";
import { cacheLink, deleteCachedLink } from "../redis.js";
import { HttpError } from "../utils/http-error.js";
import { normalizeAndValidateUrl } from "../utils/url.js";

const makeCode = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 7);

export async function createShortLink({ originalUrl, customAlias, expiresAt, userId }) {
  const normalizedUrl = normalizeAndValidateUrl(originalUrl);
  const shortCode = customAlias || makeCode();

  if (customAlias && !/^[a-zA-Z0-9_-]{3,32}$/.test(customAlias)) {
    throw new HttpError(400, "Custom alias must be 3-32 letters, numbers, underscores, or hyphens");
  }

  const existing = await prisma.link.findFirst({
    where: { OR: [{ shortCode }, { customAlias: customAlias || undefined }] }
  });

  if (existing) throw new HttpError(409, "Short code or alias already exists");

  const link = await prisma.link.create({
    data: {
      userId,
      originalUrl: normalizedUrl,
      shortCode,
      customAlias: customAlias || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }
  });

  await cacheLink(shortCode, link);
  return link;
}

export async function findActiveLink(shortCode) {
  const link = await prisma.link.findUnique({ where: { shortCode } });
  if (!link) throw new HttpError(404, "Link not found");
  if (link.expiresAt && link.expiresAt < new Date()) {
    await deleteCachedLink(shortCode);
    throw new HttpError(410, "Link has expired");
  }
  return link;
}

export async function deleteLink(shortCode, userId) {
  const link = await prisma.link.findUnique({ where: { shortCode } });
  if (!link) throw new HttpError(404, "Link not found");
  if (link.userId && link.userId !== userId) throw new HttpError(403, "You cannot delete this link");

  await prisma.link.delete({ where: { id: link.id } });
  await deleteCachedLink(shortCode);
}

export function anonymizeIp(ip) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex");
}
