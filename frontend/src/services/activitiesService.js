import axiosInstance from "./axiosInstance";
import API from "./apiRoutes";

// -------------------- ACTIVITIES SERVICE --------------------

// Get all activities
export const getAllActivities = (filters = {}) => {
  // If your backend expects POST with filters
  return axiosInstance.post(API.activities.getAll, filters);
};
