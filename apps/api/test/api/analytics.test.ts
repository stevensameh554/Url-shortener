import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

vi.mock("../../src/services/auth.service.js", () => ({ verifyAccessToken: () => ({ sub: "u1", email: "u@example.com", name: "User" }) }));
vi.mock("../../src/services/analytics.service.js", () => ({
  getLinkAnalytics: vi.fn(async () => ({ totalClicks: 0, uniqueVisitors: 0, daily: {}, browsers: {}, operatingSystems: {}, devices: {}, referrers: {}, countries: {}, events: [] }))
}));

describe("analytics API", () => {
  it("returns grouped metrics for owners", async () => {
    const response = await request(makeTestApp()).get("/api/links/abc123/analytics").set({ authorization: "Bearer token" });
    expect(response.status).toBe(200);
    expect(response.body.data.totalClicks).toBe(0);
  });
});
