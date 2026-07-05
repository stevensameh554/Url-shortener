import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../db.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { createShortLink, deleteLink, findActiveLink } from "../services/links.js";
import { buildLinkAnalytics } from "../services/analytics.js";

export const linksRouter = Router();

const codeParam = z.object({
  params: z.object({ shortCode: z.string().min(3).max(64) })
});

linksRouter.post(
  "/shorten",
  optionalAuth,
  validate(
    z.object({
      body: z.object({
        originalUrl: z.string().url(),
        customAlias: z.string().min(3).max(32).optional(),
        expiresAt: z.string().datetime().optional()
      })
    })
  ),
  asyncHandler(async (req, res) => {
    const link = await createShortLink({
      ...req.validated.body,
      userId: req.user?.sub
    });
    res.status(201).json({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${config.APP_BASE_URL}/${link.shortCode}`,
      clicks: link.clicks,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt
    });
  })
);

linksRouter.get(
  "/links/:shortCode",
  validate(codeParam),
  asyncHandler(async (req, res) => {
    const link = await findActiveLink(req.validated.params.shortCode);
    res.json({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      customAlias: link.customAlias,
      shortUrl: `${config.APP_BASE_URL}/${link.shortCode}`,
      clicks: link.clicks,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt
    });
  })
);

linksRouter.delete(
  "/links/:shortCode",
  requireAuth,
  validate(codeParam),
  asyncHandler(async (req, res) => {
    await deleteLink(req.validated.params.shortCode, req.user.sub);
    res.status(204).send();
  })
);

linksRouter.get(
  "/links/:shortCode/analytics",
  validate(codeParam),
  asyncHandler(async (req, res) => {
    const link = await findActiveLink(req.validated.params.shortCode);
    res.json(await buildLinkAnalytics(link.id));
  })
);

linksRouter.get(
  "/dashboard/stats",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [links, totalClicks, recentEvents] = await Promise.all([
      prisma.link.findMany({
        where: { userId: req.user.sub },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.link.aggregate({ where: { userId: req.user.sub }, _sum: { clicks: true } }),
      prisma.clickEvent.findMany({
        where: { link: { userId: req.user.sub } },
        orderBy: { clickedAt: "desc" },
        take: 10,
        include: { link: true }
      })
    ]);

    res.json({
      totalLinks: links.length,
      totalClicks: totalClicks._sum.clicks || 0,
      links,
      recentEvents
    });
  })
);
