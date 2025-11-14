import axiosInstance from "./axiosInstance";
import API from "./apiRoutes";

// -------------------- NOTIFICATIONS SERVICE --------------------

// Get all notifications
export const getNotifications = () => {
  return axiosInstance.get(API.notifications.getAll);
};

// Mark a notification as read
export const markNotificationAsRead = (id) => {
  return axiosInstance.patch(API.notifications.markAsRead(id));
};

// Delete a notification
export const deleteNotification = (id) => {
  return axiosInstance.delete(API.notifications.delete(id));
};
