import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
} from "../controllers/authController.js";


import { protect,authorize } from "../middlewares/authMiddleware.js"; // JWT auth middleware

const router = express.Router();

// ----------------- AUTH ROUTES -----------------
router.post("/register", register); // Only Admin can create users
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.get("/users", protect, authorize(["ADMIN", "MANAGER"]), getAllUsers);



export default router;
