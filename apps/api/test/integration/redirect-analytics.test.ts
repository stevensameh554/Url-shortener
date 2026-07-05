import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/click-event.repository.js", () => ({
  createClickEvent: vi.fn(async () => {
    throw new Error("analytics unavailable");
  })
}));

const { recordClickEvent } = await import("../../src/services/click-event.service.js");

describe("redirect analytics resilience", () => {
  it("does not throw when analytics recording fails asynchronously", () => {
    expect(() => recordClickEvent("l1", { header: () => undefined, ip: "127.0.0.1", socket: {} } as any)).not.toThrow();
  });
});
