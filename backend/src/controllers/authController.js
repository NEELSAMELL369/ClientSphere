import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateCookie } from "../utils/generateCookie.js";
import { sendEmail } from "../utils/mailer.js";

const prisma = new PrismaClient();

// ----------------- REGISTER -----------------
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, companyId, managerId } = req.body;
    const validRoles = ["ADMIN", "MANAGER", "SALES"];
    if (!validRoles.includes(role)) throw new Error("Invalid role");

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    let finalCompanyId;

    if (role === "ADMIN") {
      if (!companyName) throw new Error("Company name required for Admin");
      const company = await prisma.company.create({ data: { name: companyName } });
      finalCompanyId = company.id;
    } else {
      if (!companyId) throw new Error("CompanyId required for Manager/Sales");
      const companyExists = await prisma.company.findUnique({ where: { id: companyId } });
      if (!companyExists) throw new Error("Company not found");
      finalCompanyId = companyId;
    }

    let user;

    switch (role) {
      case "ADMIN":
        user = await prisma.user.create({
          data: { name, email: normalizedEmail, password: hashedPassword, role, companyId: finalCompanyId, managerId: null },
        });
        break;
      case "MANAGER":
        user = await prisma.user.create({
          data: { name, email: normalizedEmail, password: hashedPassword, role, companyId: finalCompanyId, managerId: null },
        });
        user = await prisma.user.update({ where: { id: user.id }, data: { managerId: user.id } });
        break;
      case "SALES":
        if (!managerId) throw new Error("ManagerId required for Sales");
        const manager = await prisma.user.findUnique({ where: { id: managerId } });
        if (!manager || manager.companyId !== finalCompanyId || manager.role !== "MANAGER") {
          throw new Error("Invalid managerId");
        }
        user = await prisma.user.create({
          data: { name, email: normalizedEmail, password: hashedPassword, role, companyId: finalCompanyId, managerId },
        });
        break;
    }

    generateCookie(res, user);

    sendEmail({
      to: normalizedEmail,
      subject: "Welcome to CRM Platform",
      text: `Hi ${name}, welcome to our CRM platform!`,
      html: `<p>Hi <b>${name}</b>, welcome to our CRM platform!</p>`,
    }).catch(() => {}); // don't throw email errors

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, companyId: user.companyId, managerId: user.managerId },
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    generateCookie(res, user);

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, companyId: user.companyId, managerId: user.managerId },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// ----------------- LOGOUT -----------------
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ----------------- GET PROFILE -----------------
export const getProfile = async (req, res, next) => {
  try {
    const { id, name, email, role, companyId, managerId } = req.user;
    res.json({ success: true, user: { id, name, email, role, companyId, managerId } });
  } catch (error) {
    next(error);
  }
};

// ----------------- GET ALL USERS -----------------
export const getAllUsers = async (req, res, next) => {
  try {
    let users;

    if (req.user.role === "ADMIN") {
      users = await prisma.user.findMany({
        where: { companyId: req.user.companyId },
        select: { id: true, name: true, email: true, role: true, companyId: true, managerId: true, createdAt: true, updatedAt: true },
        orderBy: [{ role: "asc" }, { name: "asc" }],
      });
    } else if (req.user.role === "MANAGER") {
      users = await prisma.user.findMany({
        where: { OR: [{ id: req.user.id }, { managerId: req.user.id }] },
        select: { id: true, name: true, email: true, role: true, companyId: true, managerId: true, createdAt: true, updatedAt: true },
        orderBy: [{ role: "asc" }, { name: "asc" }],
      });
    } else {
      throw new Error("Access denied");
    }

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
