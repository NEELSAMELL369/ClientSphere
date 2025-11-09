import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import prisma from "./src/config/prismaClient.js";

const PORT = process.env.PORT || 5000;

// Retry logic for free-tier sleeping DB
async function connectWithRetry() {
  let connected = false;
  while (!connected) {
    try {
      await prisma.$connect();
      connected = true;
      console.log("✅ Connected to database successfully");
    } catch (err) {
      console.error("❌ Failed to connect to database, retrying in 5s...", err.message);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
