import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, country, state, phone, inviteCode } = req.body;

    // Admin can register freely
    if (role === "ADMIN") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          country,
          state,
          phone,
          role,
          isApproved: true, // Admin auto-approved
        },
      });
      return res.status(201).json({ message: "Admin registered successfully", user: admin });
    }

    // For MANAGER or SALES_EXECUTIVE → require invite code
    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required for this role" });
    }

    // Find Admin by invite code
    const admin = await prisma.user.findFirst({ where: { inviteCode, role: "ADMIN" } });
    if (!admin) {
      return res.status(400).json({ message: "Invalid invite code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        state,
        phone,
        role,
        isApproved: false, // Require admin approval
        assignedAdminId: admin.id, // Link user to admin
      },
    });

    res.status(201).json({
      message: `Registration successful. Waiting for Admin approval.`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isApproved) {
      return res.status(403).json({
        message: "Your account is not approved by Admin yet.",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin generates invite code
export const generateInvite = async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 8); // 6-char code
    const adminId = req.user.id;

    await prisma.user.update({
      where: { id: adminId },
      data: { inviteCode: code },
    });

    res.json({ inviteCode: code });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves a pending user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { isApproved: true },
    });

    res.json({ message: `${user.role} approved successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending users for this Admin
export const getPendingUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { assignedAdminId: req.user.id, isApproved: false },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
