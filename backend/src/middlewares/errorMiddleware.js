import logger from "../config/logger.js";

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err, req, res, next) => {
  try {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
  } catch (logErr) {
    console.error("Logging failed:", logErr.message);
  }

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

