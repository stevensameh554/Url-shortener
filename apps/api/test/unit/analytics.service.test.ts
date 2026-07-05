import { describe, expect, it } from "vitest";

describe("analytics aggregation", () => {
  it("groups daily clicks", () => {
    const events = [new Date("2026-07-05T10:00:00Z"), new Date("2026-07-05T11:00:00Z")];
    const grouped = events.reduce<Record<string, number>>((acc, date) => {
      const key = date.toISOString().slice(0, 10);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    expect(grouped["2026-07-05"]).toBe(2);
  });
});
