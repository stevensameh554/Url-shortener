import { beforeEach, describe, expect, it, vi } from "vitest";

const findLinkByCode = vi.fn();
const getClickEvents = vi.fn();

vi.mock("../../src/repositories/link.repository.js", () => ({ findLinkByCode }));
vi.mock("../../src/repositories/click-event.repository.js", () => ({ getClickEvents }));

const { getLinkAnalytics } = await import("../../src/services/analytics.service.js");

describe("analytics service behavior", () => {
  beforeEach(() => vi.clearAllMocks());

  it("aggregates analytics dimensions", async () => {
    findLinkByCode.mockResolvedValue({ id: "l1", userId: "u1", shortCode: "abc", originalUrl: "https://example.com", clickCount: 4, status: "active" });
    getClickEvents.mockResolvedValue([
      { clickedAt: new Date("2026-07-05T10:00:00Z"), visitorHash: "v1", browser: "Chrome", operatingSystem: "Windows", deviceType: "desktop", referrer: "direct", country: "EG" },
      { clickedAt: new Date("2026-07-05T11:00:00Z"), visitorHash: "v1", browser: "Firefox", operatingSystem: "Windows", deviceType: "mobile", referrer: null, country: null }
    ]);

    const result = await getLinkAnalytics("abc", "u1", {});
    expect(result.totalClicks).toBe(2);
    expect(result.uniqueVisitors).toBe(1);
    expect(result.daily["2026-07-05"]).toBe(2);
    expect(result.browsers.Chrome).toBe(1);
    expect(result.referrers.Unknown).toBe(1);
  });

  it("denies missing, deleted, and non-owned links", async () => {
    findLinkByCode.mockResolvedValue(null);
    await expect(getLinkAnalytics("abc", "u1", {})).rejects.toMatchObject({ statusCode: 404 });
    findLinkByCode.mockResolvedValue({ id: "l1", userId: "u2", status: "active" });
    await expect(getLinkAnalytics("abc", "u1", {})).rejects.toMatchObject({ statusCode: 404 });
    findLinkByCode.mockResolvedValue({ id: "l1", userId: "u1", status: "deleted" });
    await expect(getLinkAnalytics("abc", "u1", {})).rejects.toMatchObject({ statusCode: 404 });
  });
});
