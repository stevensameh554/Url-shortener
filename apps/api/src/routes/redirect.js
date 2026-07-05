import { Router } from "express";
import { getCachedLink, cacheLink } from "../redis.js";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { recordClick } from "../services/analytics.js";

export const redirectRouter = Router();

redirectRouter.get(
  "/:shortCode",
  asyncHandler(async (req, res) => {
    const { shortCode } = req.params;
    let link = await getCachedLink(shortCode);

    if (!link) {
      link = await prisma.link.findUnique({ where: { shortCode } });
      if (!link) throw new HttpError(404, "Link not found");
      if (link.expiresAt && link.expiresAt < new Date()) throw new HttpError(410, "Link has expired");
      await cacheLink(shortCode, link);
    }

    recordClick(req, link).catch((error) => console.error("Failed to record click", error));
    res.redirect(302, link.originalUrl);
  })
);
