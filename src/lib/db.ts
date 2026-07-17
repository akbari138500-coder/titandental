import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it as an environment variable in your Netlify settings."
    );
  }

  const client = new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Lazy Proxy — the actual PrismaClient is only instantiated on first
 * property access (i.e., when a real query runs inside a request handler),
 * NOT at module-load / build time. This prevents the Edge Runtime
 * initialization error during Next.js static page data collection.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = createClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
