import type { LinkStatus, Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

export type LinkSort = "createdAt" | "clickCount" | "expiresAt";

export function findLinkByCode(shortCode: string) {
  return prisma.link.findUnique({ where: { shortCode } });
}

export function findAliasOrCode(value: string) {
  return prisma.link.findFirst({ where: { OR: [{ shortCode: value }, { customAlias: value }] } });
}

export function createLink(data: {
  userId?: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  expiresAt?: Date;
}) {
  const createData: Prisma.LinkUncheckedCreateInput = {
    originalUrl: data.originalUrl,
    shortCode: data.shortCode
  };
  if (data.userId) createData.userId = data.userId;
  if (data.customAlias) createData.customAlias = data.customAlias;
  if (data.expiresAt) createData.expiresAt = data.expiresAt;
  return prisma.link.create({
    data: createData
  });
}

export function listOwnedLinks(options: {
  userId: string;
  search?: string;
  status?: LinkStatus;
  sort?: LinkSort;
  direction?: "asc" | "desc";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.LinkWhereInput = { userId: options.userId };
  if (options.status) where.status = options.status;
  if (options.search) {
    where.OR = [
      { shortCode: { contains: options.search, mode: "insensitive" } },
      { customAlias: { contains: options.search, mode: "insensitive" } },
      { originalUrl: { contains: options.search, mode: "insensitive" } }
    ];
  }
  return prisma.$transaction([
    prisma.link.count({ where }),
    prisma.link.findMany({
      where,
      orderBy: { [options.sort ?? "createdAt"]: options.direction ?? "desc" },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize
    })
  ]);
}

export function updateOwnedLink(id: string, data: Prisma.LinkUpdateInput) {
  return prisma.link.update({ where: { id }, data });
}

export function incrementClickCount(id: string) {
  return prisma.link.update({ where: { id }, data: { clickCount: { increment: 1 } } });
}
