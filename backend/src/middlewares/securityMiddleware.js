  import helmet from "helmet";
  import rateLimit from "express-rate-limit";
  import cors from "cors";

  export const securityMiddleware = (app) => {
    app.use(helmet());
    app.use(cors());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      message: "Too many requests from this IP, please try again later",
    });
    app.use("/api", limiter);
  };
