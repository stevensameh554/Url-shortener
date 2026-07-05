import { UAParser } from "ua-parser-js";
import { prisma } from "../db.js";
import { anonymizeIp } from "./links.js";

function groupCount(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export async function recordClick(req, link) {
  const parser = new UAParser(req.get("user-agent") || "");
  const result = parser.getResult();
  const deviceType = result.device.type || "desktop";
  const browser = result.browser.name || "Unknown";
  const ipAddress = req.ip || req.socket?.remoteAddress || null;

  await prisma.$transaction([
    prisma.link.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }),
    prisma.clickEvent.create({
      data: {
        linkId: link.id,
        ipAddress,
        ipHash: anonymizeIp(ipAddress),
        userAgent: req.get("user-agent"),
        referrer: req.get("referer") || req.get("referrer") || "Direct",
        country: req.get("cf-ipcountry") || "Unknown",
        deviceType,
        browser
      }
    })
  ]);
}

export async function buildLinkAnalytics(linkId) {
  const events = await prisma.clickEvent.findMany({
    where: { linkId },
    orderBy: { clickedAt: "asc" }
  });

  const clicksByDay = events.reduce((acc, event) => {
    const day = event.clickedAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  return {
    totalClicks: events.length,
    uniqueVisitors: new Set(events.map((event) => event.ipHash).filter(Boolean)).size,
    clicksByDay,
    devices: groupCount(events, "deviceType"),
    browsers: groupCount(events, "browser"),
    countries: groupCount(events, "country"),
    referrers: groupCount(events, "referrer")
  };
}
