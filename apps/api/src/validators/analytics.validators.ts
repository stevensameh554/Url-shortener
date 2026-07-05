import { z } from "zod";

export const analyticsSchema = z.object({
  params: z.object({ shortCode: z.string().min(3).max(64) }),
  query: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional()
  })
});
