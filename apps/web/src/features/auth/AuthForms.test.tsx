import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "./AuthProvider";
import { LoginPage } from "../../pages/LoginPage";

describe("auth forms", () => {
  it("renders login form", () => {
    expect(renderToString(<AuthProvider><LoginPage /></AuthProvider>)).toContain("Sign in");
  });
});
