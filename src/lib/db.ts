import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

function createEdgePrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Return a dummy client during build time if DATABASE_URL is not set
    return new PrismaClient();
  }
  const sql = neon(process.env.DATABASE_URL);
  const adapter = new PrismaNeon(sql);
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma || createEdgePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
