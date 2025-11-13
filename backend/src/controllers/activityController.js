import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ----------------- GET ALL ACTIVITIES -----------------
export const getAllActivities = async (req, res, next) => {
  try {
    let whereClause = {};

    if (req.user.role === "ADMIN") {
      // Admin sees all activities in the company
      whereClause = { lead: { companyId: req.user.companyId } };
    } else if (req.user.role === "MANAGER") {
      // Manager sees own + team activities
      const team = await prisma.user.findMany({
        where: { managerId: req.user.id },
        select: { id: true },
      });
      const teamIds = team.map((u) => u.id);
      whereClause = {
        lead: { ownerId: { in: [req.user.id, ...teamIds] } },
      };
    } else {
      // Sales sees only own activities
      whereClause = { createdById: req.user.id };
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        lead: { select: { id: true, title: true, ownerId: true } },
        createdBy: { select: { id: true, name: true, role: true } },
      },
    });

    res.json({ success: true, activities });
  } catch (err) {
    next(err);
  }
};
