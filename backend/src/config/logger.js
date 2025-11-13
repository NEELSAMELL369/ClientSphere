import fs from "fs";
import path from "path";
import winston from "winston";

const logDir = path.resolve("logs");

// Ensure log folder exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Determine environment
const isDev = process.env.NODE_ENV !== "production";

// Define all custom levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors for each level 🌈
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "blue",
  debug: "cyan",
  silly: "gray",
});

// Common log format (used for files)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
  )
);

// Colorized console format (used for dev)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level.toUpperCase()}] ➜ ${info.message}`
  )
);

// Create the logger instance
const logger = winston.createLogger({
  levels,
  level: isDev ? "silly" : "info",
  format: fileFormat,
  transports: [
    // File for all logs
    new winston.transports.File({filename: path.join(logDir, "combined.log"),level: "silly",}),
    // File for errors only
    new winston.transports.File({filename: path.join(logDir, "error.log"),level: "error",}),
  ],
});

// Add pretty colored console output in development
if (isDev) {logger.add(new winston.transports.Console({level: "silly",format: consoleFormat,}));}

export default logger;
