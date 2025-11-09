import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : [],
    errorFormat: "pretty", // optional but makes errors readable
  });
}

prisma = global.prisma;

export default prisma;
