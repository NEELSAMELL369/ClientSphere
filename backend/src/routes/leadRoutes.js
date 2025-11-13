import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();

router.post("/", protect, authorize(["ADMIN", "MANAGER", "SALES"]), createLead);
router.get("/", protect, authorize(["ADMIN", "MANAGER", "SALES"]), getLeads);
router.get("/:id", protect, authorize(["ADMIN", "MANAGER", "SALES"]), getLeadById);
router.put("/:id", protect, authorize(["ADMIN", "MANAGER", "SALES"]), updateLead);
router.delete("/:id", protect, authorize(["ADMIN", "MANAGER", "SALES"]), deleteLead);

export default router;
