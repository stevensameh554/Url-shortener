import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LinkTable } from "./LinkTable";

describe("LinkTable", () => {
  it("renders link rows", () => {
    const html = renderToString(<LinkTable links={[{ id: "1", originalUrl: "https://example.com", shortCode: "abc", status: "active", shortUrl: "http://x/abc", clickCount: 2, createdAt: "", updatedAt: "" }]} onSelect={() => undefined} onQr={() => undefined} />);
    expect(html).toContain("abc");
  });
});
