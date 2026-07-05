import { describe, expect, it } from "vitest";

describe("link ownership rule", () => {
  it("requires matching user ids for private management", () => {
    const ownsLink = (linkUserId: string | null, userId: string) => linkUserId === userId;
    expect(ownsLink("u1", "u1")).toBe(true);
    expect(ownsLink("u1", "u2")).toBe(false);
  });
});
