import { findLinkByCode } from "../repositories/link.repository.js";
import { getClickEvents } from "../repositories/click-event.repository.js";
import { HttpError } from "../utils/http-error.js";

function countBy<T extends Record<string, any>>(items: T[], key: keyof T) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const label = String(item[key] ?? "Unknown");
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
}

export async function getLinkAnalytics(shortCode: string, userId: string, range: { start?: Date; end?: Date }) {
  const link = await findLinkByCode(shortCode);
  if (!link || link.userId !== userId || link.status === "deleted") throw new HttpError(404, "Link not found");
  const events = await getClickEvents(link.id, range.start, range.end);
  const daily = events.reduce<Record<string, number>>((acc, event) => {
    const day = event.clickedAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});
  return {
    link: { shortCode: link.shortCode, originalUrl: link.originalUrl, clickCount: link.clickCount },
    totalClicks: events.length,
    uniqueVisitors: new Set(events.map((event) => event.visitorHash).filter(Boolean)).size,
    daily,
    browsers: countBy(events, "browser"),
    operatingSystems: countBy(events, "operatingSystem"),
    devices: countBy(events, "deviceType"),
    referrers: countBy(events, "referrer"),
    countries: countBy(events, "country"),
    events: events.slice(0, 100)
  };
}
