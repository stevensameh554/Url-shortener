import { z } from "zod";

export const codeParamSchema = z.object({
  params: z.object({ shortCode: z.string().min(3).max(64) })
});

export const createLinkSchema = z.object({
  body: z.object({
    originalUrl: z.string().url(),
    customAlias: z.string().min(3).max(32).optional(),
    expiresAt: z.string().datetime().optional()
  })
});

export const listLinksSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(["active", "disabled", "deleted"]).optional(),
    sort: z.enum(["createdAt", "clickCount", "expiresAt"]).optional(),
    direction: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional()
  })
});

export const updateLinkSchema = codeParamSchema.extend({
  body: z.object({
    originalUrl: z.string().url().optional(),
    customAlias: z.string().min(3).max(32).nullable().optional(),
    status: z.enum(["active", "disabled"]).optional(),
    expiresAt: z.string().datetime().nullable().optional()
  })
});
