import express from "express";
import {
  registerUser,
  loginUser,
  generateInvite,
  approveUser,
  getPendingUsers
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only routes
router.post("/generate-invite", protect, authorizeRoles("ADMIN"), generateInvite);
router.post("/approve-user", protect, authorizeRoles("ADMIN"), approveUser);
router.get("/pending-users", protect, authorizeRoles("ADMIN"), getPendingUsers);

export default router;
