import { PrismaClient } from "@prisma/client";
import { notifyLeadUser } from "../utils/leadNotifier.js";

const prisma = new PrismaClient();

// Helper to get team IDs for a manager
const getTeamIds = async (managerId) => {
  const team = await prisma.user.findMany({
    where: { managerId },
    select: { id: true },
  });
  return team.map((u) => u.id);
};

// Helper to create activity
const createActivity = async ({ leadId, userId, type, content }) => {
  await prisma.activity.create({
    data: { leadId, createdById: userId, type, content },
  });
};

// Helper to notify user
const notifyUser = async (userId, leadId, message, subject, html) => {
  await notifyLeadUser({ leadId, userId, type: "LEAD_UPDATE", message });
  // Optionally send email, etc.
};

// ----------------- CREATE LEAD -----------------
export const createLead = async (req, res, next) => {
  try {
    const { title, companyId, ownerId, email, phone, status } = req.body;

    if (req.user.companyId !== companyId) throw new Error("Cannot create lead in another company");

    let actualOwnerId = ownerId || req.user.id;

    if (req.user.role === "SALES") actualOwnerId = req.user.id;

    if (req.user.role === "MANAGER" && actualOwnerId !== req.user.id) {
      const teamIds = await getTeamIds(req.user.id);
      if (!teamIds.includes(actualOwnerId)) throw new Error("Manager can create lead only for team members");
    }

    const lead = await prisma.lead.create({
      data: { title, companyId, ownerId: actualOwnerId, email, phone, status },
    });

    await createActivity({
      leadId: lead.id,
      userId: req.user.id,
      type: "NOTE",
      content: `Lead "${title}" created by ${req.user.name}`,
    });

    await notifyLeadUser({
      leadId: lead.id,
      userId: actualOwnerId,
      type: "LEAD_ASSIGNED",
      message: `A new lead "${title}" has been assigned to you.`,
    });

    res.status(201).json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};


// ----------------- GET ALL LEADS -----------------
export const getLeads = async (req, res, next) => {
  try {
    let leads;

    const baseWhere = { deleted: false }; // Always exclude deleted

    if (req.user.role === "ADMIN") {
      leads = await prisma.lead.findMany({
        where: { ...baseWhere, companyId: req.user.companyId },
        include: { owner: true, activities: { orderBy: { createdAt: "desc" } } },
      });
    } else if (req.user.role === "MANAGER") {
      const teamIds = await getTeamIds(req.user.id);
      leads = await prisma.lead.findMany({
        where: { 
          ...baseWhere,
          OR: [{ ownerId: req.user.id }, { ownerId: { in: teamIds } }]
        },
        include: { owner: true, activities: { orderBy: { createdAt: "desc" } } },
      });
    } else {
      leads = await prisma.lead.findMany({
        where: { ...baseWhere, ownerId: req.user.id },
        include: { owner: true, activities: { orderBy: { createdAt: "desc" } } },
      });
    }

    res.json({ success: true, leads });
  } catch (err) {
    next(err);
  }
};




// ----------------- GET SINGLE LEAD -----------------
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: { activities: { orderBy: { createdAt: "desc" } } },
    });

    if (!lead) throw new Error("Lead not found");

    if (lead.companyId !== req.user.companyId) throw new Error("Access denied");

    if (req.user.role === "MANAGER") {
      const teamIds = await getTeamIds(req.user.id);
      if (lead.ownerId !== req.user.id && !teamIds.includes(lead.ownerId)) throw new Error("Access denied");
    }

    if (req.user.role === "SALES" && lead.ownerId !== req.user.id) throw new Error("Access denied");

    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

// ----------------- UPDATE LEAD -----------------
export const updateLead = async (req, res, next) => {
  try {
    const { title, email, phone, status, ownerId } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead) throw new Error("Lead not found");

    if (lead.deleted) throw new Error("Cannot update a deleted lead");

    if (lead.companyId !== req.user.companyId)
      throw new Error("Cannot update lead from another company");

    let newOwnerId = ownerId || lead.ownerId;

    // SALES restrictions
    if (req.user.role === "SALES") {
      if (lead.ownerId !== req.user.id) throw new Error("Sales can update only own leads");
      newOwnerId = lead.ownerId;
    }

    // MANAGER restrictions
    if (req.user.role === "MANAGER" && lead.ownerId !== req.user.id) {
      const teamIds = await getTeamIds(req.user.id);
      if (!teamIds.includes(lead.ownerId))
        throw new Error("Manager can update only own or team leads");
    }

    // Track changes
    const changes = [];
    if (title && title !== lead.title) changes.push(`Title changed to "${title}"`);
    if (email && email !== lead.email) changes.push(`Email changed to "${email}"`);
    if (phone && phone !== lead.phone) changes.push(`Phone changed to "${phone}"`);
    if (status && status !== lead.status) changes.push(`Status changed to "${status}"`);
    if (ownerId && ownerId !== lead.ownerId) changes.push(`Owner changed`);

    const updatedLead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { title, email, phone, status, ownerId: newOwnerId },
    });

    if (changes.length > 0) {
      await createActivity({
        leadId: updatedLead.id,
        userId: req.user.id,
        type: "NOTE",  // FIXED
        content: changes.join("; "),
      });

      await notifyUser(
        newOwnerId,
        updatedLead.id,
        `Lead "${updatedLead.title}" updated.`,
        `Lead Updated: ${updatedLead.title}`,
        `<p>Changes:</p><p>${changes.join("<br>")}</p>`
      );
    }

    res.json({ success: true, lead: updatedLead });
  } catch (err) {
    next(err);
  }
};


// ----------------- DELETE LEAD (Soft Delete) -----------------
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead) throw new Error("Lead not found");

    if (lead.companyId !== req.user.companyId)
      throw new Error("Cannot delete lead from another company");

    if (req.user.role === "MANAGER") {
      const teamIds = await getTeamIds(req.user.id);
      if (lead.ownerId !== req.user.id && !teamIds.includes(lead.ownerId))
        throw new Error("Manager can delete only own or team leads");
    }

    if (req.user.role === "SALES" && lead.ownerId !== req.user.id)
      throw new Error("Sales can delete only own leads");

    // Soft delete: mark deleted = true
    const deletedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: { deleted: true },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        leadId: deletedLead.id,
        createdById: req.user.id,
        type: "NOTE", // Use NOTE, since DELETE is not in ActivityType enum
        content: `Lead marked as deleted by ${req.user.name} (${req.user.role})`,
      },
    });

    // Optional: notify owner
    await notifyUser(
      lead.ownerId,
      deletedLead.id,
      `Lead "${deletedLead.title}" marked as deleted by ${req.user.name}.`,
      `Lead Deleted: ${deletedLead.title}`,
      `<p>Lead "<b>${deletedLead.title}</b>" marked as deleted by ${req.user.name} (${req.user.role})</p>`
    );

    res.json({ success: true, message: "Lead marked as deleted" });
  } catch (err) {
    next(err);
  }
};

