import dotenv from "dotenv";
import http from "http";
import { PrismaClient } from "@prisma/client";
import app from "./src/app.js";
import { initIO } from "./src/utils/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

const server = http.createServer(app);
export const io = initIO(server);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to database successfully!");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
