import express from "express";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notificationsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect); // ensure all routes require login

router.get("/", getNotifications); // fetch all notifications
router.patch("/:id/read", markAsRead); // mark single notification as read
router.delete("/:id", deleteNotification); // delete single notification

export default router;
