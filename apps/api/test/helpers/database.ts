import { prisma } from "../../src/db/prisma.js";

export async function cleanDatabase() {
  await prisma.clickEvent.deleteMany();
  await prisma.refreshSession.deleteMany();
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();
}
