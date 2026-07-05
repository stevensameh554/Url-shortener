import { describe, expect, it } from "vitest";
import { isPrivateIp } from "../../src/utils/url-validator.js";

describe("url safety", () => {
  it("detects private addresses", () => {
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("10.0.0.2")).toBe(true);
    expect(isPrivateIp("8.8.8.8")).toBe(false);
  });
});
