import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/db/redis.js", () => {
  const store = new Map<string, string>();
  return {
    getJson: vi.fn(async (key: string) => (store.has(key) ? JSON.parse(store.get(key)!) : null)),
    setJson: vi.fn(async (key: string, value: unknown) => store.set(key, JSON.stringify(value))),
    deleteKey: vi.fn(async (key: string) => store.delete(key))
  };
});

const { cacheRedirect, getCachedRedirect, invalidateRedirect } = await import("../../src/services/redirect-cache.service.js");

describe("redirect cache", () => {
  it("writes, reads, and invalidates redirect entries", async () => {
    await cacheRedirect({ id: "l1", shortCode: "abc", originalUrl: "https://example.com", status: "active", expiresAt: null });
    expect((await getCachedRedirect("abc"))?.originalUrl).toBe("https://example.com");
    await invalidateRedirect("abc");
    expect(await getCachedRedirect("abc")).toBeNull();
  });
});
