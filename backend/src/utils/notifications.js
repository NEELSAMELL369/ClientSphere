import { getIO } from "./socket.js";

export const sendNotification = (userId, payload) => {
  try {
    const io = getIO();
    io.to(userId).emit("newNotification", {
      ...payload,
      createdAt: new Date(),
    });
    console.log(`Notification sent to user ${userId}`);
  } catch (err) {
    console.error("Socket.IO not initialized:", err.message);
  }
};
  