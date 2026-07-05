import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CreateLinkForm } from "./CreateLinkForm";

describe("CreateLinkForm", () => {
  it("renders the destination field", () => {
    expect(renderToString(<CreateLinkForm onCreated={() => undefined} />)).toContain("Destination");
  });
});
