import Redis from "ioredis";
import { config } from "./config.js";

export const redis = config.REDIS_URL
  ? new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 })
  : null;

export async function connectRedis() {
  if (!redis) return;
  if (redis.status === "wait") {
    await redis.connect().catch(() => undefined);
  }
}

export async function cacheLink(shortCode, link) {
  if (!redis || redis.status !== "ready") return;
  const ttlSeconds = link.expiresAt
    ? Math.max(1, Math.floor((new Date(link.expiresAt).getTime() - Date.now()) / 1000))
    : 60 * 60 * 24;

  await redis.set(
    `link:${shortCode}`,
    JSON.stringify({ id: link.id, originalUrl: link.originalUrl, expiresAt: link.expiresAt }),
    "EX",
    ttlSeconds
  );
}

export async function getCachedLink(shortCode) {
  if (!redis || redis.status !== "ready") return null;
  const cached = await redis.get(`link:${shortCode}`);
  return cached ? JSON.parse(cached) : null;
}

export async function deleteCachedLink(shortCode) {
  if (!redis || redis.status !== "ready") return;
  await redis.del(`link:${shortCode}`);
}
