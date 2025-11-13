import morgan from "morgan";
import logger from "../config/logger.js";

const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = (req, res) => process.env.NODE_ENV === "production" && res.statusCode < 400;

const loggerMiddleware = morgan("combined", { stream, skip });

export default loggerMiddleware;
