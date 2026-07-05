import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

vi.mock("../../src/services/redirect.service.js", () => ({
  resolveRedirect: vi.fn(async (code: string) => {
    if (code === "missing") {
      const error: any = new Error("Link not found");
      error.statusCode = 404;
      throw error;
    }
    return "https://example.com";
  })
}));

describe("redirect API", () => {
  it("redirects active links", async () => {
    const response = await request(makeTestApp()).get("/abc123");
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("https://example.com");
  });

  it("returns not found for missing links", async () => {
    const response = await request(makeTestApp()).get("/missing");
    expect(response.status).toBe(404);
  });
});
