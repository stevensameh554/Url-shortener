import { beforeEach, describe, expect, it, vi } from "vitest";
import { validatePublicUrl } from "../../src/utils/url-validator.js";

const { lookup } = vi.hoisted(() => ({ lookup: vi.fn() }));
vi.mock("node:dns/promises", () => ({ default: { lookup }, lookup }));

describe("public URL validator behavior", () => {
  beforeEach(() => lookup.mockResolvedValue([{ address: "8.8.8.8", family: 4 }] as any));

  it("accepts public http URLs and strips fragments", async () => {
    await expect(validatePublicUrl("https://example.com/path#secret")).resolves.toBe("https://example.com/path");
  });

  it("rejects malformed, unsupported, credentialed, local, and private DNS URLs", async () => {
    await expect(validatePublicUrl("not-a-url")).rejects.toMatchObject({ statusCode: 400 });
    await expect(validatePublicUrl("ftp://example.com")).rejects.toMatchObject({ statusCode: 400 });
    await expect(validatePublicUrl("https://user:pass@example.com")).rejects.toMatchObject({ statusCode: 400 });
    await expect(validatePublicUrl("http://localhost")).rejects.toMatchObject({ statusCode: 400 });
    lookup.mockResolvedValue([{ address: "10.0.0.1", family: 4 }] as any);
    await expect(validatePublicUrl("https://internal.example.com")).rejects.toMatchObject({ statusCode: 400 });
  });
});
