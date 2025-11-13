import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import logger from "../config/logger.js";

const prisma = new PrismaClient();


// ---------------- Role-based Access ----------------
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Protect middleware error: ${error.message}`);
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};




// ---------------- Role-based Access ----------------
export const authorize = (roles = [], checkOwnership = async () => true) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        logger.warn(`Role "${req.user.role}" denied access`);
        return res.status(403).json({ success: false, message: "Access denied for this role" });
      }

      const allowed = await checkOwnership(req.user, req);
      if (!allowed) {
        logger.warn(`${req.user.role} not allowed for this resource`);
        return res.status(403).json({ success: false, message: "Access denied: not allowed for this resource" });
      }

      next();
    } catch (error) {
      logger.error(`Authorize middleware error: ${error.message}`);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
};



