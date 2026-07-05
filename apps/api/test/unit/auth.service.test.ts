import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { verifyAccessToken } from "../../src/services/auth.service.js";

describe("auth tokens", () => {
  it("verifies signed access tokens", () => {
    const token = jwt.sign({ sub: "u1", email: "a@example.com", name: "A" }, process.env.JWT_ACCESS_SECRET!);
    expect(verifyAccessToken(token).sub).toBe("u1");
  });
});
