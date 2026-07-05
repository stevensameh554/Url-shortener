import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@linkpulse.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@linkpulse.dev",
      passwordHash: await bcrypt.hash("Password123", 12)
    }
  });

  await prisma.link.upsert({
    where: { shortCode: "demo" },
    update: {},
    create: {
      userId: user.id,
      originalUrl: "https://github.com/github/spec-kit",
      shortCode: "demo",
      customAlias: "demo"
    }
  });
}

main().finally(async () => prisma.$disconnect());
