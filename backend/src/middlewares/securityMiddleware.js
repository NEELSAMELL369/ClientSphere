import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const securityMiddleware = (app) => {
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
    })
  );

  // ------------------------------
  // RATE LIMIT (disabled in dev)
  // ------------------------------
  if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // allow only 100 reqs for production
      message: "Too many requests from this IP, please try again later",
    });

    app.use("/api", limiter);
  } else {
    console.log("⚠️ Rate limiting DISABLED in development");
  }
};
