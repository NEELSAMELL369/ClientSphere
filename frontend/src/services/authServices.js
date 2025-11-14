import axiosInstance from "./axiosInstance";
import API from "./apiRoutes";

// -------------------- AUTH SERVICE --------------------

// Login user
export const loginService = async (email, password) => {
  try {
    const { data } = await axiosInstance.post(API.auth.login, { email, password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Logout user
export const logoutService = async () => {
  try {
    const { data } = await axiosInstance.post(API.auth.logout);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

// Register new user (Admin only)
export const registerService = async (userData) => {
  try {
    const { data } = await axiosInstance.post(API.auth.register, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Get current user profile
export const getProfileService = async () => {
  try {
    const { data } = await axiosInstance.get(API.auth.profile);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

// Get all users (Admin + Manager)
export const getAllUsersService = async () => {
  try {
    const { data } = await axiosInstance.get(API.auth.getAllUsers);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
