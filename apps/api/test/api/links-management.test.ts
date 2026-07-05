import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

vi.mock("../../src/services/auth.service.js", async () => ({
  verifyAccessToken: () => ({ sub: "u1", email: "u@example.com", name: "User" }),
  getProfile: vi.fn()
}));

vi.mock("../../src/services/link.service.js", async () => {
  const dto = { id: "l1", originalUrl: "https://example.com", shortCode: "abc123", status: "active", shortUrl: "http://localhost:4000/abc123", clickCount: 0, createdAt: new Date(), updatedAt: new Date() };
  return {
    listLinks: vi.fn(async () => ({ items: [dto], total: 1, page: 1, pageSize: 20 })),
    updateLink: vi.fn(async () => dto),
    deleteLink: vi.fn(async () => undefined),
    getPublicLink: vi.fn(async () => dto),
    createShortLink: vi.fn(async () => dto),
    toLinkDto: (link: any) => link
  };
});

vi.mock("../../src/repositories/link.repository.js", () => ({
  findLinkByCode: vi.fn(async () => ({ id: "l1", userId: "u1", shortCode: "abc123", status: "active", shortUrl: "http://localhost:4000/abc123" }))
}));
vi.mock("../../src/services/qr-code.service.js", () => ({ createQrCodeDataUrl: vi.fn(async () => "data:image/png;base64,abc") }));

describe("link management API", () => {
  it("lists, updates, deletes, and generates QR for owned links", async () => {
    const app = makeTestApp();
    const auth = { authorization: "Bearer token" };
    expect((await request(app).get("/api/links").set(auth)).status).toBe(200);
    expect((await request(app).patch("/api/links/abc123").set(auth).send({ status: "disabled" })).status).toBe(200);
    expect((await request(app).get("/api/links/abc123/qr").set(auth)).status).toBe(200);
    expect((await request(app).delete("/api/links/abc123").set(auth)).status).toBe(204);
  });
});
