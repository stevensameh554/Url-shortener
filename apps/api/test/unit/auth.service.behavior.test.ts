import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findUserByEmail = vi.fn();
const findUserById = vi.fn();
const createUser = vi.fn();
const createRefreshSession = vi.fn();
const findRefreshSession = vi.fn();
const revokeRefreshSession = vi.fn();

vi.mock("../../src/repositories/user.repository.js", () => ({
  findUserByEmail,
  findUserById,
  createUser
}));

vi.mock("../../src/repositories/refresh-session.repository.js", () => ({
  createRefreshSession,
  findRefreshSession,
  revokeRefreshSession
}));

const auth = await import("../../src/services/auth.service.js");

describe("auth service behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createRefreshSession.mockResolvedValue({});
  });

  it("registers a new user and creates a refresh session", async () => {
    findUserByEmail.mockResolvedValue(null);
    createUser.mockResolvedValue({ id: "u1", name: "User", email: "u@example.com" });

    const result = await auth.register({ name: "User", email: "u@example.com", password: "Password123" });

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({ email: "u@example.com" }));
    expect(createRefreshSession).toHaveBeenCalledWith(expect.objectContaining({ userId: "u1" }));
  });

  it("rejects duplicate registration", async () => {
    findUserByEmail.mockResolvedValue({ id: "u1" });
    await expect(auth.register({ name: "User", email: "u@example.com", password: "Password123" })).rejects.toMatchObject({ statusCode: 409 });
  });

  it("logs in with a matching password and rejects invalid credentials", async () => {
    findUserByEmail.mockResolvedValue({ id: "u1", name: "User", email: "u@example.com", passwordHash: await bcrypt.hash("Password123", 8) });
    await expect(auth.login({ email: "u@example.com", password: "Password123" })).resolves.toHaveProperty("accessToken");
    await expect(auth.login({ email: "u@example.com", password: "wrong" })).rejects.toMatchObject({ statusCode: 401 });
    findUserByEmail.mockResolvedValue(null);
    await expect(auth.login({ email: "none@example.com", password: "Password123" })).rejects.toMatchObject({ statusCode: 401 });
  });

  it("refreshes valid sessions and rejects revoked, expired, or missing sessions", async () => {
    const user = { id: "u1", name: "User", email: "u@example.com" };
    findRefreshSession.mockResolvedValue({ id: "s1", user, revokedAt: null, expiresAt: new Date(Date.now() + 10000) });
    await expect(auth.refresh("refresh-token")).resolves.toHaveProperty("accessToken");
    expect(revokeRefreshSession).toHaveBeenCalledWith("s1");

    findRefreshSession.mockResolvedValue(null);
    await expect(auth.refresh("missing-token")).rejects.toMatchObject({ statusCode: 401 });
    findRefreshSession.mockResolvedValue({ id: "s2", user, revokedAt: new Date(), expiresAt: new Date(Date.now() + 10000) });
    await expect(auth.refresh("revoked-token")).rejects.toMatchObject({ statusCode: 401 });
    findRefreshSession.mockResolvedValue({ id: "s3", user, revokedAt: null, expiresAt: new Date(Date.now() - 10000) });
    await expect(auth.refresh("expired-token")).rejects.toMatchObject({ statusCode: 401 });
  });

  it("logs out active sessions and returns profiles", async () => {
    findRefreshSession.mockResolvedValue({ id: "s1", revokedAt: null });
    await auth.logout("refresh-token");
    expect(revokeRefreshSession).toHaveBeenCalledWith("s1");

    findRefreshSession.mockResolvedValue({ id: "s2", revokedAt: new Date() });
    await auth.logout("refresh-token");

    const createdAt = new Date();
    findUserById.mockResolvedValue({ id: "u1", name: "User", email: "u@example.com", createdAt });
    await expect(auth.getProfile("u1")).resolves.toEqual({ id: "u1", name: "User", email: "u@example.com", createdAt });
    findUserById.mockResolvedValue(null);
    await expect(auth.getProfile("missing")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("verifies valid tokens and rejects invalid tokens", () => {
    const token = jwt.sign({ sub: "u1", email: "u@example.com", name: "User" }, process.env.JWT_ACCESS_SECRET!);
    expect(auth.verifyAccessToken(token).sub).toBe("u1");
    expect(() => auth.verifyAccessToken("bad-token")).toThrow();
  });
});
