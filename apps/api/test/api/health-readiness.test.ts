import request from "supertest";
import { describe, expect, it } from "vitest";
import { makeTestApp } from "../helpers/test-app.js";

describe("health", () => {
  it("returns health status", async () => {
    const response = await request(makeTestApp()).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
