import axiosInstance from "./axiosInstance";
import API from "./apiRoutes";

// -------------------- ACTIVITIES SERVICE --------------------

// Get all activities
export const getAllActivities = () => {
  return axiosInstance.get(API.activities.getAll);
};
