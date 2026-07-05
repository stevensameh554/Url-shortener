import { prisma } from "../db/prisma.js";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(data: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash
    }
  });
}
