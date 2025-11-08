

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import prisma from "./src/config/prismaClient.js"

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database successfully");
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
  }
  console.log(`Server running on port ${PORT}`);
});
