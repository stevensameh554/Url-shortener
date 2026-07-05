import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const redis = env.REDIS_URL ? new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 }) : null;

export async function connectRedis() {
  if (!redis || redis.status === "ready") return;
  try {
    await redis.connect();
  } catch (error) {
    logger.warn("Redis unavailable; continuing without cache", error);
  }
}

export async function getJson<T>(key: string): Promise<T | null> {
  if (!redis || redis.status !== "ready") return null;
  const value = await redis.get(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function setJson(key: string, value: unknown, ttlSeconds = 3600) {
  if (!redis || redis.status !== "ready") return;
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function deleteKey(key: string) {
  if (!redis || redis.status !== "ready") return;
  await redis.del(key);
}
