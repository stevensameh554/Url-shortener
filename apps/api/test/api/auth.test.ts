import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

vi.mock("../../src/services/auth.service.js", () => ({
  register: vi.fn(async () => ({ user: { sub: "u1", email: "u@example.com", name: "User" }, accessToken: "a", refreshToken: "r", expiresAt: new Date() })),
  login: vi.fn(async () => ({ user: { sub: "u1", email: "u@example.com", name: "User" }, accessToken: "a", refreshToken: "r", expiresAt: new Date() })),
  refresh: vi.fn(async () => ({ user: { sub: "u1", email: "u@example.com", name: "User" }, accessToken: "a", refreshToken: "r", expiresAt: new Date() })),
  logout: vi.fn(async () => undefined),
  verifyAccessToken: vi.fn(() => ({ sub: "u1", email: "u@example.com", name: "User" })),
  getProfile: vi.fn(async () => ({ id: "u1", email: "u@example.com", name: "User" }))
}));

describe("auth API", () => {
  it("supports register, login, refresh, logout, and profile", async () => {
    const app = makeTestApp();
    expect((await request(app).post("/api/auth/register").send({ name: "User", email: "u@example.com", password: "Password123" })).status).toBe(201);
    expect((await request(app).post("/api/auth/login").send({ email: "u@example.com", password: "Password123" })).status).toBe(200);
    expect((await request(app).post("/api/auth/refresh").send({ refreshToken: "refresh-token-that-is-long" })).status).toBe(200);
    expect((await request(app).post("/api/auth/logout").send({ refreshToken: "refresh-token-that-is-long" })).status).toBe(204);
    expect((await request(app).get("/api/profile").set({ authorization: "Bearer token" })).status).toBe(200);
  });
});
