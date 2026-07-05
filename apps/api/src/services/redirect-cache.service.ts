import type { Link } from "@prisma/client";
import { deleteKey, getJson, setJson } from "../db/redis.js";

const key = (shortCode: string) => `redirect:${shortCode}`;

export type CachedRedirect = Pick<Link, "id" | "originalUrl" | "shortCode" | "status" | "expiresAt">;

export function getCachedRedirect(shortCode: string) {
  return getJson<CachedRedirect>(key(shortCode));
}

export function cacheRedirect(link: CachedRedirect) {
  return setJson(key(link.shortCode), link, 3600);
}

export function invalidateRedirect(shortCode: string) {
  return deleteKey(key(shortCode));
}
