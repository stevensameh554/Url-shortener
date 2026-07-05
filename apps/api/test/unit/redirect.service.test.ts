import { beforeEach, describe, expect, it, vi } from "vitest";

const findLinkByCode = vi.fn();
vi.mock("../../src/repositories/link.repository.js", () => ({
  findLinkByCode,
  incrementClickCount: vi.fn(async () => undefined)
}));
vi.mock("../../src/services/redirect-cache.service.js", () => ({
  getCachedRedirect: vi.fn(async () => null),
  cacheRedirect: vi.fn(),
  invalidateRedirect: vi.fn()
}));
vi.mock("../../src/services/click-event.service.js", () => ({ recordClickEvent: vi.fn() }));

const { resolveRedirect } = await import("../../src/services/redirect.service.js");

describe("redirect service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns active destination URLs", async () => {
    findLinkByCode.mockResolvedValue({ id: "l1", shortCode: "abc", originalUrl: "https://example.com", status: "active", expiresAt: null });
    await expect(resolveRedirect("abc", {} as any)).resolves.toBe("https://example.com");
  });

  it.each([
    ["missing", null, 404],
    ["disabled", { id: "l1", status: "disabled", expiresAt: null }, 410],
    ["deleted", { id: "l1", status: "deleted", expiresAt: null }, 404],
    ["expired", { id: "l1", status: "active", expiresAt: new Date(Date.now() - 1000) }, 410]
  ])("handles %s links", async (_name, link, status) => {
    findLinkByCode.mockResolvedValue(link && { shortCode: "abc", originalUrl: "https://example.com", ...link });
    await expect(resolveRedirect("abc", {} as any)).rejects.toMatchObject({ statusCode: status });
  });
});
