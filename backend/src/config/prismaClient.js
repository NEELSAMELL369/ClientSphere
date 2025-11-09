import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
}

prisma = global.prisma;
export default prisma;
