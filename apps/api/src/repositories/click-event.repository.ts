import { prisma } from "../db/prisma.js";

export function createClickEvent(data: {
  linkId: string;
  ipHash?: string;
  visitorHash?: string;
  userAgent?: string;
  browser?: string;
  operatingSystem?: string;
  deviceType?: string;
  referrer?: string;
  country?: string;
}) {
  return prisma.clickEvent.create({ data });
}

export function getClickEvents(linkId: string, start?: Date, end?: Date) {
  const clickedAt: { gte?: Date; lte?: Date } = {};
  if (start) clickedAt.gte = start;
  if (end) clickedAt.lte = end;
  return prisma.clickEvent.findMany({
    where: { linkId, ...(start || end ? { clickedAt } : {}) },
    orderBy: { clickedAt: "desc" }
  });
}
