import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodTypeAny } from "zod";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error.js";

export function validate(schema: AnyZodObject | ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new HttpError(400, "Validation failed", error.flatten()));
        return;
      }
      next(error);
    }
  };
}
