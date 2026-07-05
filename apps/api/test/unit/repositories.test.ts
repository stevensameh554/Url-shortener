import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = {
  user: { findUnique: vi.fn(), create: vi.fn() },
  refreshSession: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
  link: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn(), count: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  clickEvent: { create: vi.fn(), findMany: vi.fn() },
  $transaction: vi.fn(async (items) => Promise.all(items))
};

vi.mock("../../src/db/prisma.js", () => ({ prisma }));

const users = await import("../../src/repositories/user.repository.js");
const refreshSessions = await import("../../src/repositories/refresh-session.repository.js");
const links = await import("../../src/repositories/link.repository.js");
const clicks = await import("../../src/repositories/click-event.repository.js");

describe("repositories", () => {
  beforeEach(() => vi.clearAllMocks());

  it("normalizes user repository inputs", async () => {
    await users.findUserByEmail("UPPER@EXAMPLE.COM");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "upper@example.com" } });
    await users.createUser({ name: " User ", email: "UPPER@EXAMPLE.COM", passwordHash: "hash" });
    expect(prisma.user.create).toHaveBeenCalledWith({ data: { name: "User", email: "upper@example.com", passwordHash: "hash" } });
    await users.findUserById("u1");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "u1" } });
  });

  it("wraps refresh session persistence", async () => {
    const expiresAt = new Date();
    await refreshSessions.createRefreshSession({ userId: "u1", tokenHash: "hash", expiresAt });
    await refreshSessions.findRefreshSession("hash");
    await refreshSessions.revokeRefreshSession("s1");
    await refreshSessions.revokeUserSessions("u1");
    expect(prisma.refreshSession.create).toHaveBeenCalled();
    expect(prisma.refreshSession.findUnique).toHaveBeenCalledWith({ where: { tokenHash: "hash" }, include: { user: true } });
    expect(prisma.refreshSession.update).toHaveBeenCalledWith({ where: { id: "s1" }, data: { revokedAt: expect.any(Date) } });
    expect(prisma.refreshSession.updateMany).toHaveBeenCalledWith({ where: { userId: "u1", revokedAt: null }, data: { revokedAt: expect.any(Date) } });
  });

  it("wraps link persistence", async () => {
    prisma.link.count.mockResolvedValue(1);
    prisma.link.findMany.mockResolvedValue([]);
    await links.findLinkByCode("abc");
    await links.findAliasOrCode("abc");
    await links.createLink({ originalUrl: "https://example.com", shortCode: "abc", userId: "u1", customAlias: "abc", expiresAt: new Date() });
    await links.listOwnedLinks({ userId: "u1", search: "abc", status: "active", sort: "clickCount", direction: "asc", page: 1, pageSize: 10 });
    await links.updateOwnedLink("l1", { status: "disabled" });
    await links.incrementClickCount("l1");
    expect(prisma.link.findUnique).toHaveBeenCalledWith({ where: { shortCode: "abc" } });
    expect(prisma.link.findFirst).toHaveBeenCalled();
    expect(prisma.link.create).toHaveBeenCalledWith({ data: expect.objectContaining({ shortCode: "abc" }) });
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.link.update).toHaveBeenCalledWith({ where: { id: "l1" }, data: { clickCount: { increment: 1 } } });
  });

  it("wraps click event persistence", async () => {
    await clicks.createClickEvent({ linkId: "l1", browser: "Chrome" });
    await clicks.getClickEvents("l1", new Date("2026-07-01"), new Date("2026-07-05"));
    await clicks.getClickEvents("l1");
    expect(prisma.clickEvent.create).toHaveBeenCalledWith({ data: { linkId: "l1", browser: "Chrome" } });
    expect(prisma.clickEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ linkId: "l1" }) }));
  });
});
