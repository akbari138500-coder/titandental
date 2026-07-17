import { PrismaClient } from "@prisma/client";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

function createEdgePrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Fallback during build time when DATABASE_URL is not available
    return new PrismaClient();
  }
  const sql = neon(process.env.DATABASE_URL);
  const adapter = new PrismaNeonHTTP(sql);
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma || createEdgePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
