import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./mailer.js";
import { getIO } from "./socket.js"; // Updated import for Socket.IO

const prisma = new PrismaClient();

export const notifyLeadUser = async ({
  leadId,
  userId,
  type,
  message,
  changes = [],
}) => {
  // ----------------- REAL-TIME -----------------
  try {
    const io = getIO();
    io.to(userId).emit("newNotification", {
      type,
      message,
      leadId,
      changes,
      createdAt: new Date(),
    });
    console.log(`Notification sent to user ${userId}`);
  } catch (err) {
    console.error("Socket.IO not initialized:", err.message);
  }

  // ----------------- DATABASE -----------------
  await prisma.notification.create({
    data: {
      userId,
      type,
      payload: { leadId, message, changes },
    },
  });

  // ----------------- EMAIL -----------------
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.email) return;

  let subject = "";
  let html = "";

  switch (type) {
    case "LEAD_ASSIGNED":
      subject = `New Lead Assigned`;
      html = `<p>Hello ${user.name},</p>
              <p>A new lead has been assigned to you.</p>
              <p>Check your CRM dashboard for details.</p>`;
      break;
    case "LEAD_UPDATED":
      subject = `Lead Updated`;
      html = `<p>Hello ${user.name},</p>
              <p>The lead has been updated with the following changes:</p>
              <p>${changes.join("<br>")}</p>
              <p>Check your CRM dashboard for details.</p>`;
      break;
    case "LEAD_DELETED":
      subject = `Lead Deleted`;
      html = `<p>Hello ${user.name},</p>
              <p>The lead has been deleted.</p>
              <p>Check your CRM dashboard for details.</p>`;
      break;
    default:
      subject = `CRM Notification`;
      html = `<p>Hello ${user.name},</p><p>${message}</p>`;
  }

  sendEmail({ to: user.email, subject, html });
};
