import { beforeEach, describe, expect, it, vi } from "vitest";

const cacheRedirect = vi.fn();
const invalidateRedirect = vi.fn();
const createLink = vi.fn();
const findAliasOrCode = vi.fn();
const findLinkByCode = vi.fn();
const listOwnedLinks = vi.fn();
const updateOwnedLink = vi.fn();
const validatePublicUrl = vi.fn(async (url: string) => url);
const generateShortCode = vi.fn(() => "gen1234");

vi.mock("../../src/services/redirect-cache.service.js", () => ({ cacheRedirect, invalidateRedirect }));
vi.mock("../../src/repositories/link.repository.js", () => ({ createLink, findAliasOrCode, findLinkByCode, listOwnedLinks, updateOwnedLink }));
vi.mock("../../src/utils/url-validator.js", () => ({ validatePublicUrl }));
vi.mock("../../src/utils/short-code.js", async () => {
  const actual = await vi.importActual<any>("../../src/utils/short-code.js");
  return { ...actual, generateShortCode };
});

const links = await import("../../src/services/link.service.js");

const baseLink = {
  id: "l1",
  userId: "u1",
  originalUrl: "https://example.com",
  shortCode: "abc123",
  customAlias: null,
  status: "active",
  clickCount: 2,
  expiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("link service behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findAliasOrCode.mockResolvedValue(null);
    createLink.mockResolvedValue(baseLink);
    cacheRedirect.mockResolvedValue(undefined);
    invalidateRedirect.mockResolvedValue(undefined);
  });

  it("creates generated and custom links", async () => {
    const generated = await links.createShortLink({ originalUrl: "https://example.com", userId: "u1" });
    expect(generated.shortCode).toBe("abc123");
    expect(createLink).toHaveBeenCalledWith(expect.objectContaining({ shortCode: "gen1234", userId: "u1" }));

    createLink.mockResolvedValue({ ...baseLink, shortCode: "launch", customAlias: "launch" });
    const custom = await links.createShortLink({ originalUrl: "https://example.com", customAlias: "launch" });
    expect(custom.shortCode).toBe("launch");
  });

  it("rejects invalid aliases, duplicate aliases, and past expirations", async () => {
    await expect(links.createShortLink({ originalUrl: "https://example.com", customAlias: "bad alias" })).rejects.toMatchObject({ statusCode: 400 });
    findAliasOrCode.mockResolvedValue({ id: "existing" });
    await expect(links.createShortLink({ originalUrl: "https://example.com", customAlias: "launch" })).rejects.toMatchObject({ statusCode: 409 });
    await expect(links.createShortLink({ originalUrl: "https://example.com", expiresAt: new Date(Date.now() - 1000).toISOString() })).rejects.toMatchObject({ statusCode: 400 });
  });

  it("returns public links and hides deleted or missing links", async () => {
    findLinkByCode.mockResolvedValue(baseLink);
    await expect(links.getPublicLink("abc123")).resolves.toHaveProperty("shortCode", "abc123");
    findLinkByCode.mockResolvedValue({ ...baseLink, status: "deleted" });
    await expect(links.getPublicLink("abc123")).rejects.toMatchObject({ statusCode: 404 });
    findLinkByCode.mockResolvedValue(null);
    await expect(links.getPublicLink("missing")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("lists owned links with normalized pagination", async () => {
    listOwnedLinks.mockResolvedValue([1, [baseLink]]);
    const result = await links.listLinks("u1", { search: "abc", status: "active", sort: "clickCount", direction: "asc", page: -1, pageSize: 999 });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(100);
    expect(result.total).toBe(1);
  });

  it("updates owned links and invalidates cache", async () => {
    findLinkByCode.mockResolvedValue(baseLink);
    updateOwnedLink.mockResolvedValue({ ...baseLink, originalUrl: "https://new.example.com" });
    await expect(links.updateLink("abc123", "u1", { originalUrl: "https://new.example.com", status: "active", customAlias: null, expiresAt: null })).resolves.toHaveProperty("originalUrl", "https://new.example.com");
    expect(invalidateRedirect).toHaveBeenCalledWith("abc123");
    expect(cacheRedirect).toHaveBeenCalled();
  });

  it("rejects unauthorized, deleted, invalid, and duplicate update cases", async () => {
    findLinkByCode.mockResolvedValue(null);
    await expect(links.updateLink("abc123", "u1", {})).rejects.toMatchObject({ statusCode: 404 });
    findLinkByCode.mockResolvedValue({ ...baseLink, userId: "u2" });
    await expect(links.updateLink("abc123", "u1", {})).rejects.toMatchObject({ statusCode: 404 });
    findLinkByCode.mockResolvedValue({ ...baseLink, status: "deleted" });
    await expect(links.updateLink("abc123", "u1", {})).rejects.toMatchObject({ statusCode: 404 });
    findLinkByCode.mockResolvedValue(baseLink);
    await expect(links.updateLink("abc123", "u1", { customAlias: "bad alias" })).rejects.toMatchObject({ statusCode: 400 });
    findAliasOrCode.mockResolvedValue({ id: "other" });
    await expect(links.updateLink("abc123", "u1", { customAlias: "other" })).rejects.toMatchObject({ statusCode: 409 });
  });

  it("soft deletes owned links", async () => {
    findLinkByCode.mockResolvedValue(baseLink);
    updateOwnedLink.mockResolvedValue({ ...baseLink, status: "deleted" });
    await links.deleteLink("abc123", "u1");
    expect(updateOwnedLink).toHaveBeenCalledWith("l1", expect.objectContaining({ status: "deleted" }));
    expect(invalidateRedirect).toHaveBeenCalledWith("abc123");
  });
});
