import request from "supertest";
import { describe, expect, it } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

describe("security controls", () => {
  it("rejects malformed request bodies and emits security headers", async () => {
    const response = await request(makeTestApp()).post("/api/links").send({ originalUrl: "<script>alert(1)</script>" });
    expect(response.status).toBe(400);
    expect(response.header["x-dns-prefetch-control"]).toBeDefined();
  });
});
