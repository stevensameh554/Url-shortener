import { prisma } from "../db/prisma.js";

export function createRefreshSession(data: { userId: string; tokenHash: string; expiresAt: Date }) {
  return prisma.refreshSession.create({ data });
}

export function findRefreshSession(tokenHash: string) {
  return prisma.refreshSession.findUnique({ where: { tokenHash }, include: { user: true } });
}

export function revokeRefreshSession(id: string) {
  return prisma.refreshSession.update({ where: { id }, data: { revokedAt: new Date() } });
}

export function revokeUserSessions(userId: string) {
  return prisma.refreshSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}
