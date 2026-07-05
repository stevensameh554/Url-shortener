import { describe, expect, it } from "vitest";
import { generateShortCode, isValidAlias } from "../../src/utils/short-code.js";

describe("short codes", () => {
  it("generates URL-safe codes", () => {
    expect(generateShortCode()).toMatch(/^[A-Za-z0-9]{7}$/);
  });

  it("validates aliases", () => {
    expect(isValidAlias("campaign_1")).toBe(true);
    expect(isValidAlias("no spaces")).toBe(false);
  });
});
