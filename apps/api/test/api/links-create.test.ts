import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

vi.mock("../../src/services/link.service.js", async () => {
  const actual = await vi.importActual<any>("../../src/services/link.service.js");
  return {
    ...actual,
    createShortLink: vi.fn(async (input) => ({
      id: "l1",
      originalUrl: input.originalUrl,
      shortCode: input.customAlias ?? "abc1234",
      customAlias: input.customAlias ?? null,
      status: "active",
      shortUrl: `http://localhost:4000/${input.customAlias ?? "abc1234"}`,
      clickCount: 0,
      expiresAt: input.expiresAt ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  };
});

describe("create link API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates generated short links and aliases", async () => {
    const response = await request(makeTestApp()).post("/api/links").send({ originalUrl: "https://example.com", customAlias: "launch" });
    expect(response.status).toBe(201);
    expect(response.body.data.shortCode).toBe("launch");
  });

  it("rejects invalid URL input", async () => {
    const response = await request(makeTestApp()).post("/api/links").send({ originalUrl: "not-a-url" });
    expect(response.status).toBe(400);
  });
});
