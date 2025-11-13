import { Router } from "express";
import { getAllActivities } from "../controllers/activityController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/all", protect, authorize(["ADMIN", "MANAGER", "SALES"]), getAllActivities);

export default router;
