import express from "express";
import cookieParser from "cookie-parser";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";
import { securityMiddleware } from "./middlewares/securityMiddleware.js";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import authRoutes from "./routes/authRoutes.js"; // Import auth routes
import leadRoutes from "./routes/leadRoutes.js"; // Import auth routes
import activityRoutes from "./routes/activityRoutes.js"; // Import auth routes
import notificationRoutes from "./routes/notificationRoutes.js"; // Import auth routes



const app = express();

// Core middlewares
app.use(express.json());
app.use(cookieParser());

// Security middlewares
securityMiddleware(app);

// Logging middleware
app.use(loggerMiddleware);

// ---------------- Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/notification", notificationRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// ---------------- Error Handling ----------------
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
