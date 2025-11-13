import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ----------------- GET ALL NOTIFICATIONS -----------------
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

// ----------------- MARK NOTIFICATION AS READ -----------------
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification || notification.userId !== req.user.id) {
      throw new Error("Notification not found");
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
};

// ----------------- DELETE NOTIFICATION -----------------
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification || notification.userId !== req.user.id) {
      throw new Error("Notification not found");
    }

    await prisma.notification.delete({ where: { id } });

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};
