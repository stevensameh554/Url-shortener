import { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { errorHandler, notFound } from "../../src/middleware/error.js";
import { HttpError } from "../../src/utils/http-error.js";

function response() {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
  return res as any;
}

describe("error middleware", () => {
  it("creates not found errors", () => {
    const next = vi.fn();
    notFound({ method: "GET", path: "/missing" } as any, {} as any, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  it("serializes http errors", () => {
    const res = response();
    errorHandler(new HttpError(400, "Bad request", { field: "url" }), {} as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "Bad request", details: { field: "url" } } });
  });

  it("serializes Prisma unique conflicts", () => {
    const res = response();
    const error = new Prisma.PrismaClientKnownRequestError("Unique", { code: "P2002", clientVersion: "test" });
    errorHandler(error, {} as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("hides internal server errors and returns client errors", () => {
    const res = response();
    errorHandler(new Error("boom"), { requestId: "r1" } as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "Internal server error" } });

    const res2 = response();
    errorHandler({ statusCode: 418, message: "teapot" }, {} as any, res2, vi.fn());
    expect(res2.status).toHaveBeenCalledWith(418);
    expect(res2.json).toHaveBeenCalledWith({ error: { message: "teapot" } });
  });
});
